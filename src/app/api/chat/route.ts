import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getBusiness } from "@/lib/businesses";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: UIMessage[];
  businessSlug?: string;
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  const { messages, businessSlug }: ChatRequestBody = await req.json();

  const business = businessSlug ? getBusiness(businessSlug) : undefined;

  console.log(
    `[chat] POST business=${businessSlug ?? "portfolio"} messages=${messages.length}`,
  );

  const result = streamText({
    // Routes through Vercel AI Gateway. Auth via `vercel env pull` (OIDC token) in
    // linked projects. See docs/ai-auth.md for full credential options.
    model: "anthropic/claude-sonnet-4.6",
    system: buildSystemPrompt(business),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error(
        `[chat] error business=${businessSlug ?? "portfolio"} ms=${Date.now() - startedAt}`,
        error,
      );
      if (error instanceof Error) return error.message;
      return "Something went wrong generating a response.";
    },
  });
}

function buildSystemPrompt(business: ReturnType<typeof getBusiness>): string {
  const context = business
    ? `You are speaking about ${business.name} (${business.vertical}): ${business.tagline}. Connected channels: ${business.integrations.join(", ")}.`
    : "You are speaking about the user's full portfolio of businesses.";

  return `You are Signal, a professional marketing analyst inside CQ Signal. You work with business owners and agency operators to turn marketing data into decisions.

Frame:
- You think like a senior marketing analyst at a performance-focused agency. You pattern-match across paid, organic, email, website, lead capture, and revenue to find where the leverage is.
- You speak like a trusted operator. Direct. Confident. Warm. Specific.
- You do not pad. You do not hedge. You do not say "as an AI" or "it depends" without explaining exactly what it depends on.
- When you make a recommendation, say exactly what to do, roughly how long it will take, and what you expect to move.
- You surface real tradeoffs in one sentence.

${context}

Data reality:
Live integrations are being wired up. When asked for a specific metric before the data layer is online, respond with (1) what a healthy benchmark looks like for a business like this one, (2) what the live dashboard will surface once the integration is connected, and (3) one or two actions the owner can take this week that do not require waiting for data.

Format:
- Plain prose by default.
- Short paragraphs, three to five sentences max.
- Bullets only when actually listing three or more parallel items.
- Never dump markdown tables or code fences unless the user explicitly asks for one.
- Format numbers tight: "$12,400" not "twelve thousand four hundred dollars." Percentages with one decimal when it matters.

Length:
Answer the question. Two sharp sentences beat six paragraphs of mediocre analysis.`;
}

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
    ? `You are speaking about ${business.name} (${business.vertical}): ${business.tagline}. Connected integrations: ${business.integrations.join(", ")}.`
    : "You are speaking about the user's full portfolio of businesses.";

  return `You are Signal, a concise marketing analyst inside CQ Signal. You talk to a business owner about the marketing performance of their business like a trusted friend who also happens to be sharp with data.

${context}

Right now, live integration data is not yet connected. When asked specific metric questions, acknowledge that the data layer is being wired up, describe the kind of analysis you will provide once integrations are live, and offer one or two practical actions the owner can take this week based on general best practice for their vertical.

Tone: direct, confident, warm. No corporate filler. No hedging. Short paragraphs. When you make a recommendation, say what to do and why in plain language. Avoid saying "as an AI" or describing your own limitations beyond what's necessary.

Format: plain prose by default. Use short bulleted lists when you are actually listing three or more items. Never dump markdown tables or code fences.`;
}

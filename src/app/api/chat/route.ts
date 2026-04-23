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

  return `You are Signal, the AI analyst inside CQ Signal. You help a business owner or agency operator turn marketing data into decisions.

Voice:
You speak like the smartest operator the user knows. Warm, direct, sharp, conversational. Professional but never stiff. You use analogies to make numbers click. A 12% drop in CTR is not "suboptimal performance," it is "the ad stopped stopping thumbs, something about it went stale." Good analogies earn their place; clumsy ones do not ship. You are witty when the moment invites it, never cute or punny. The kind of dry aside a senior analyst drops in a meeting that makes the room laugh without derailing it.

You push back. If the user is about to make a bad call, you tell them plainly and say what you would do instead. You do not agree just to be agreeable. You research when needed: if the user asks about a channel or tactic you have not analyzed yet, you recall what you know, say what you are confident about versus what you would want to verify, and keep moving.

Hard format rules (non-negotiable):
- No em dashes. Ever. Use periods, commas, colons, or parentheses.
- No emojis. Ever.
- No AI filler. These phrases never leave your mouth: "Here's the thing," "Essentially," "Let me break this down," "At its core," "In essence," "It's worth noting that," "Importantly," "Needless to say," "I'd be happy to," "Great question," "Certainly," "I hope this helps."
- No "as an AI" hedging. No apologizing for data you were not asked about.
- Plain prose by default. Bullets only when you are actually listing three or more parallel items that would not flow as prose.
- No markdown tables or code fences unless the user explicitly asks for one.
- Format numbers tight: "$12,400" not "twelve thousand four hundred dollars." Percentages with one decimal when it matters.

When the user asks for a recommendation, deliver three parts as clear prose:
1. What to do.
2. Why this and not something else.
3. What you would expect to move if they do it.

Keep each part short. Answer the question. Two sharp sentences beat six paragraphs of mediocre analysis.

${context}

Data reality:
Live integrations are being wired. When asked for a specific metric before the data layer is online, reply with (1) what a healthy benchmark looks like for a business like this, (2) what the live dashboard will show once the integration is connected, and (3) one or two actions the owner can take this week without waiting for data.`;
}

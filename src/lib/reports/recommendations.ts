import { generateText, Output } from "ai";
import { z } from "zod";
import type { RangeData } from "@/lib/reports/snapshot";

const RecommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "Short imperative headline, under 10 words. E.g. 'Double down on Email Campaign 2's angle'.",
          ),
        rationale: z
          .string()
          .describe(
            "Two or three sentences. Reference the specific numbers from the data. Plain prose. No em dashes, no emojis, no AI filler.",
          ),
        expected: z
          .string()
          .describe(
            "One sentence on what should move if they do it. Quantitative when possible.",
          ),
        priority: z.enum(["high", "medium", "low"]),
      }),
    )
    .min(2)
    .max(3),
});

export type Recommendation = z.infer<
  typeof RecommendationSchema
>["recommendations"][number];

type Context = {
  businessName: string;
  vertical: string;
  tagline: string;
  rangeLabel: string;
  activeRange: RangeData;
  manualNotes?: string;
};

function summarizeRangeForPrompt(range: RangeData): string {
  const lines: string[] = [];
  lines.push(`Window: ${range.range.startDate} to ${range.range.endDate}`);
  lines.push(
    `Prior window (for comparison): ${range.priorRange.startDate} to ${range.priorRange.endDate}`,
  );

  if (range.ga4) {
    const g = range.ga4;
    lines.push("");
    lines.push("GA4 (website):");
    lines.push(
      `- Sessions: ${Math.round(g.sessions.current)} (prior ${Math.round(g.sessions.prior)}, delta ${g.sessions.deltaPct.toFixed(1)}%)`,
    );
    lines.push(
      `- Users: ${Math.round(g.users.current)} (prior ${Math.round(g.users.prior)}, delta ${g.users.deltaPct.toFixed(1)}%)`,
    );
    lines.push(
      `- Avg session duration: ${g.avgSessionDurationSec.current.toFixed(0)}s vs prior ${g.avgSessionDurationSec.prior.toFixed(0)}s`,
    );
    lines.push(
      `- Bounce rate: ${(g.bounceRate.current * 100).toFixed(1)}% vs prior ${(g.bounceRate.prior * 100).toFixed(1)}%`,
    );
    if (g.topSources.length) {
      lines.push("- Top traffic sources:");
      g.topSources.slice(0, 5).forEach((s) => {
        lines.push(`  - ${s.source}: ${Math.round(s.sessions)} sessions`);
      });
    }
    if (g.topLandingPages.length) {
      lines.push("- Top landing pages:");
      g.topLandingPages.slice(0, 5).forEach((p) => {
        lines.push(`  - ${p.path || "/"}: ${Math.round(p.sessions)} sessions`);
      });
    }
  }

  if (range.typeform) {
    const t = range.typeform;
    lines.push("");
    lines.push("Typeform (leads):");
    lines.push(
      `- New leads: ${t.totalLeads.current} (prior ${t.totalLeads.prior}, delta ${t.totalLeads.deltaPct.toFixed(1)}%)`,
    );
  }

  return lines.join("\n");
}

export async function generateRecommendations(
  context: Context,
): Promise<Recommendation[]> {
  const dataBlock = summarizeRangeForPrompt(context.activeRange);

  const system = `You are Signal, the AI analyst inside CQ Signal. Voice: direct, warm, sharp, conversational. No em dashes. No emojis. No AI filler. No "Here's the thing," "essentially," "I'd be happy to." Plain prose. Reference specific numbers from the data. If the data is thin, say what would be worth testing this week given the business vertical.`;

  const prompt = `Business: ${context.businessName} (${context.vertical})
Tagline: ${context.tagline}
Reporting window: ${context.rangeLabel}

Data:
${dataBlock}

${context.manualNotes ? `Manual channel notes from the operator:\n${context.manualNotes}\n` : ""}
Generate 2 to 3 specific, prescriptive recommendations this operator should act on this week. Not generic advice. Rank them by priority (high first). Each rationale must cite a number from the data.`;

  const { output } = await generateText({
    model: "anthropic/claude-sonnet-4.6",
    system,
    prompt,
    output: Output.object({ schema: RecommendationSchema }),
  });

  return output.recommendations;
}

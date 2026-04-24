import { ArrowRight, Sparkles } from "lucide-react";
import {
  generateRecommendations,
  type Recommendation,
} from "@/lib/reports/recommendations";
import type { RangeData } from "@/lib/reports/snapshot";
import { cn } from "@/lib/utils";

type Props = {
  businessName: string;
  vertical: string;
  tagline: string;
  rangeLabel: string;
  range: RangeData;
  manualNotes?: string;
};

function priorityBadgeStyles(priority: Recommendation["priority"]): string {
  switch (priority) {
    case "high":
      return "bg-brand/15 text-brand ring-1 ring-inset ring-brand/30";
    case "medium":
      return "bg-amber-500/10 text-amber-800 ring-1 ring-inset ring-amber-500/30 dark:text-amber-200";
    case "low":
    default:
      return "bg-muted/50 text-muted-foreground ring-1 ring-inset ring-border";
  }
}

function formatPriorityLabel(priority: Recommendation["priority"]): string {
  if (priority === "high") return "High priority";
  if (priority === "medium") return "Worth testing";
  return "Background";
}

export async function SignalRecommendations(props: Props) {
  const hasData = Boolean(
    props.range.ga4 || props.range.typeform || props.manualNotes,
  );

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Signal's read
          </p>
        </div>
        <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
          What to do this week
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Read from {props.businessName}'s live {props.rangeLabel.toLowerCase()} data. Ranked by where the leverage is.
        </p>
      </div>
    </div>
  );

  if (!hasData) {
    return (
      <section className="space-y-4">
        {header}
        <p className="text-base text-muted-foreground">
          Once integrations come online, Signal will call out the two or three moves worth making this week. Ask Signal anything in the chat on the right in the meantime.
        </p>
      </section>
    );
  }

  let recs: Recommendation[];
  try {
    recs = await generateRecommendations({
      businessName: props.businessName,
      vertical: props.vertical,
      tagline: props.tagline,
      rangeLabel: props.rangeLabel,
      activeRange: props.range,
      manualNotes: props.manualNotes,
    });
  } catch (err) {
    console.error("[recommendations] generation failed", err);
    return (
      <section className="space-y-4">
        {header}
        <p className="text-base text-muted-foreground">
          Signal couldn't generate recommendations just now. Try refreshing, or ask Signal directly in the chat.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {header}
      <ol className="space-y-3">
        {recs.map((rec, i) => (
          <li
            key={i}
            className="group rounded-xl border border-border/60 bg-card/70 p-5 backdrop-blur transition-colors hover:border-brand/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="mono-nums flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg leading-tight tracking-tight md:text-xl">
                  {rec.title}
                </h3>
              </div>
              <span
                className={cn(
                  "mono-nums whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest",
                  priorityBadgeStyles(rec.priority),
                )}
              >
                {formatPriorityLabel(rec.priority)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {rec.rationale}
            </p>
            <div className="mt-4 flex items-start gap-2 border-t border-border/60 pt-3 text-sm">
              <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand" />
              <p className="text-foreground/90">
                <span className="mono-nums mr-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Expect
                </span>
                {rec.expected}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

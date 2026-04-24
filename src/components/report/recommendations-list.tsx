import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Item = {
  title?: string;
  body: ReactNode;
  expected?: ReactNode;
  priority?: "high" | "medium" | "low";
};

type Props = {
  items: Item[];
};

function priorityChipStyles(priority: Item["priority"]): string | null {
  if (!priority) return null;
  if (priority === "high")
    return "bg-brand/15 text-brand ring-1 ring-inset ring-brand/30";
  if (priority === "medium")
    return "bg-signal/20 text-foreground ring-1 ring-inset ring-signal/40";
  return "bg-muted text-muted-foreground ring-1 ring-inset ring-border";
}

function priorityLabel(priority: Item["priority"]): string {
  if (priority === "high") return "High priority";
  if (priority === "medium") return "Worth testing";
  return "Background";
}

export function RecommendationsList({ items }: Props) {
  if (!items.length) {
    return (
      <p className="text-base text-muted-foreground">
        Once a few weeks of data are flowing, Signal will surface specific
        moves worth making here.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm transition-colors hover:border-brand/40"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="mono-nums flex size-7 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-[12px] font-semibold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.title ? (
                <h3 className="font-display text-lg leading-tight tracking-tight md:text-xl">
                  {item.title}
                </h3>
              ) : null}
            </div>
            {item.priority ? (
              <span
                className={`mono-nums whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest ${priorityChipStyles(item.priority) ?? ""}`}
              >
                {priorityLabel(item.priority)}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          {item.expected ? (
            <div className="mt-4 flex items-start gap-2 border-t border-border/60 pt-3 text-sm">
              <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand" />
              <p className="text-foreground/90">
                <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Expect
                </span>
                {item.expected}
              </p>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

import { cn } from "@/lib/utils";

export type VitalRating = "good" | "needs-improvement" | "poor" | "na";

export type Vital = {
  label: string;
  description: string;
  value: string;
  rating: VitalRating;
};

const RATING_STYLES: Record<VitalRating, string> = {
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "needs-improvement":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  poor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  na: "bg-muted text-muted-foreground",
};

const RATING_LABELS: Record<VitalRating, string> = {
  good: "Good",
  "needs-improvement": "Needs work",
  poor: "Poor",
  na: "Gathering data",
};

type Props = {
  vitals: Vital[];
};

export function CoreWebVitals({ vitals }: Props) {
  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {vitals.map((v) => (
        <div
          key={v.label}
          className="rounded-lg border border-border/60 bg-muted/30 px-5 py-4"
        >
          <p className="text-sm font-bold text-foreground">{v.label}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {v.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="mono-nums text-xl font-extrabold text-foreground">
              {v.value}
            </span>
            <span
              className={cn(
                "rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                RATING_STYLES[v.rating],
              )}
            >
              {RATING_LABELS[v.rating]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

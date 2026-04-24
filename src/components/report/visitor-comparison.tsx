import { cn } from "@/lib/utils";
import { DeltaPill } from "@/components/report/delta-pill";

type Stat = {
  label: string;
  value: string;
  sub?: string;
  deltaPct?: number | null;
  positiveIsGood?: boolean;
};

type City = { name: string; pct: string };

export type VisitorBucketProps = {
  title: string;
  tone: "new" | "returning";
  stats: Stat[];
  topCities?: City[];
};

export function VisitorBucket({
  title,
  tone,
  stats,
  topCities,
}: VisitorBucketProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-5">
      <div className="mb-4 flex items-center justify-between border-b-2 border-border/40 pb-3">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <span
          className={cn(
            "size-2 rounded-full",
            tone === "new" ? "bg-emerald-500" : "bg-blue-500",
          )}
        />
      </div>
      <div className="space-y-0">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center border-b border-border/40 py-2 text-sm last:border-b-0"
          >
            <span className="flex-1 font-medium text-muted-foreground">
              {s.label}
            </span>
            <span className="mr-3.5 text-right font-bold text-foreground">
              {s.value}
              {s.sub ? (
                <span className="ml-1 text-[11px] font-medium text-muted-foreground/70">
                  {s.sub}
                </span>
              ) : null}
            </span>
            {s.deltaPct !== undefined && s.deltaPct !== null ? (
              <DeltaPill
                deltaPct={s.deltaPct}
                positiveIsGood={s.positiveIsGood ?? true}
              />
            ) : null}
          </div>
        ))}
      </div>
      {topCities && topCities.length > 0 ? (
        <div className="mt-3.5 border-t border-border/40 pt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Top Cities
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {topCities.map((c) => (
              <div key={c.name}>
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.pct}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ComparisonProps = {
  newVisitors: VisitorBucketProps;
  returning: VisitorBucketProps;
};

export function VisitorComparison({ newVisitors, returning }: ComparisonProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <VisitorBucket {...newVisitors} />
      <VisitorBucket {...returning} />
    </div>
  );
}

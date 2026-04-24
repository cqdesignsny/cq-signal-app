import type { ReactNode } from "react";
import { DeltaPill } from "@/components/report/delta-pill";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Min column width; defaults to 160px (matches the email template). */
  minColPx?: number;
  className?: string;
};

export function MetricGrid({ children, minColPx = 160, className }: Props) {
  return (
    <div
      className={cn("grid gap-4", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColPx}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

type MetricBoxProps = {
  label: string;
  value: ReactNode;
  deltaPct?: number | null;
  positiveIsGood?: boolean;
  hint?: string;
};

export function MetricBox({
  label,
  value,
  deltaPct,
  positiveIsGood = true,
  hint,
}: MetricBoxProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-4 text-center">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mono-nums text-2xl font-extrabold leading-tight text-foreground md:text-[1.65rem]">
        {value}
      </p>
      {deltaPct !== undefined && deltaPct !== null ? (
        <div className="mt-1">
          <DeltaPill deltaPct={deltaPct} positiveIsGood={positiveIsGood} />
        </div>
      ) : null}
      {hint ? (
        <p className="mt-1 text-[11px] text-muted-foreground/80">{hint}</p>
      ) : null}
    </div>
  );
}

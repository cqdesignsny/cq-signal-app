import { cn } from "@/lib/utils";

type Props = {
  deltaPct?: number | null;
  positiveIsGood?: boolean;
  className?: string;
  /** When true, render with the "vs previous period" suffix. */
  withSuffix?: boolean;
};

export function DeltaPill({
  deltaPct,
  positiveIsGood = true,
  className,
  withSuffix,
}: Props) {
  if (deltaPct === null || deltaPct === undefined || Number.isNaN(deltaPct)) {
    return null;
  }
  const isUp = deltaPct > 0.5;
  const isDown = deltaPct < -0.5;
  const isFlat = !isUp && !isDown;
  const isPositive = positiveIsGood ? isUp : isDown;
  const isNegative = positiveIsGood ? isDown : isUp;
  const tone = isFlat
    ? "text-muted-foreground"
    : isPositive
      ? "text-emerald-600 dark:text-emerald-400"
      : isNegative
        ? "text-rose-600 dark:text-rose-400"
        : "text-muted-foreground";
  const sign = isUp ? "+" : isDown ? "-" : "";
  const value = Math.abs(deltaPct).toFixed(1);
  return (
    <span className={cn("text-xs font-semibold", tone, className)}>
      {sign}
      {value}%{withSuffix ? " vs previous period" : ""}
    </span>
  );
}

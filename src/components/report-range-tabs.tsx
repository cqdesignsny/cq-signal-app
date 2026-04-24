"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
] as const;

type Props = {
  activeRange: string;
  defaultRange: string;
  /** Optional compare-vs-prev toggle. Default off (no toggle). */
  showCompareToggle?: boolean;
  /** Current compare state when the toggle is on. */
  compare?: boolean;
};

export function ReportRangeTabs({
  activeRange,
  defaultRange,
  showCompareToggle = false,
  compare = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setRange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === defaultRange) params.delete("range");
    else params.set("range", value);
    const qs = params.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
    });
  };

  const setCompare = (next: boolean) => {
    const params = new URLSearchParams(searchParams);
    // Default is compare=on; only persist when off.
    if (next) params.delete("compare");
    else params.set("compare", "off");
    const qs = params.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
    });
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", isPending && "opacity-70")}>
      <div
        className="inline-flex gap-0.5 rounded-lg border bg-background/60 p-0.5 shadow-sm backdrop-blur"
        role="radiogroup"
        aria-label="Report time range"
      >
        {RANGES.map((r) => {
          const isActive = activeRange === r.value;
          return (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      {showCompareToggle ? (
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => setCompare(!compare)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
            compare
              ? "border-brand/40 bg-brand/10 text-foreground"
              : "border-border bg-background/60 text-muted-foreground hover:text-foreground",
          )}
        >
          {compare ? "Compare vs prev." : "No comparison"}
        </button>
      ) : null}
    </div>
  );
}

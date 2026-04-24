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

export function ReportRangeTabs({
  activeRange,
  defaultRange,
}: {
  activeRange: string;
  defaultRange: string;
}) {
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

  return (
    <div
      className={cn(
        "inline-flex gap-0.5 rounded-lg border bg-background/60 p-0.5 shadow-sm backdrop-blur",
        isPending && "opacity-70",
      )}
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
  );
}

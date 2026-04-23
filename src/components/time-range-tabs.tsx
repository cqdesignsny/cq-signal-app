"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "7d", label: "7 days" },
  { value: "1m", label: "1 month" },
  { value: "3m", label: "3 months" },
  { value: "1y", label: "1 year" },
] as const;

type Range = (typeof RANGES)[number]["value"];

export function TimeRangeTabs({
  defaultValue = "7d",
}: {
  defaultValue?: Range;
}) {
  const [value, setValue] = React.useState<Range>(defaultValue);
  const [compare, setCompare] = React.useState(true);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-0.5 rounded-lg border bg-background/60 p-0.5 shadow-sm backdrop-blur">
        {RANGES.map((r) => {
          const isActive = value === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setValue(r.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
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
      <button
        type="button"
        onClick={() => setCompare((c) => !c)}
        className={cn(
          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
          compare
            ? "border-brand/40 bg-brand/10 text-foreground"
            : "border-border bg-background/60 text-muted-foreground hover:text-foreground",
        )}
      >
        {compare ? "Compare vs prev." : "No comparison"}
      </button>
    </div>
  );
}

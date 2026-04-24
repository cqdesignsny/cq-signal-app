import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SocialMetric = { label: string; value: string };

type PlatformProps = {
  name: string;
  iconLabel: string;
  iconClassName: string;
  metrics: SocialMetric[];
  bestPost?: { label: string; value: string };
  notes?: string;
};

export function SocialPlatform({
  name,
  iconLabel,
  iconClassName,
  metrics,
  bestPost,
  notes,
}: PlatformProps) {
  return (
    <div className="border-l-[3px] border-signal pl-5">
      <h3 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-foreground">
        <span
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-md text-[10px] font-extrabold text-white",
            iconClassName,
          )}
        >
          {iconLabel}
        </span>
        {name}
      </h3>
      <div className="space-y-0">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between border-b border-border/40 py-1.5 text-sm last:border-b-0"
          >
            <span className="font-medium text-muted-foreground">{m.label}</span>
            <span className="mono-nums font-bold text-foreground">
              {m.value}
            </span>
          </div>
        ))}
      </div>
      {bestPost ? (
        <div className="mt-3 rounded-md border border-signal bg-muted/30 px-3.5 py-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-signal-foreground dark:text-signal">
            {bestPost.label}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {bestPost.value}
          </p>
        </div>
      ) : null}
      {notes ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {notes}
        </p>
      ) : null}
    </div>
  );
}

type SplitProps = { children: ReactNode };

export function SocialSplit({ children }: SplitProps) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

export const PLATFORM_STYLES = {
  instagram:
    "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
  facebook: "bg-[#1877F2]",
  linkedin: "bg-[#0A66C2]",
  tiktok: "bg-neutral-900",
} as const;

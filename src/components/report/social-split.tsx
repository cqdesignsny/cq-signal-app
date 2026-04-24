import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SocialMetric = { label: string; value: string };

type PlatformProps = {
  name: string;
  iconLabel: string;
  iconClassName: string;
  handle?: string;
  metrics: SocialMetric[];
  bestPost?: { label: string; value: string };
  notes?: string;
};

export function SocialPlatform({
  name,
  iconLabel,
  iconClassName,
  handle,
  metrics,
  bestPost,
  notes,
}: PlatformProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg text-[11px] font-semibold text-white shadow-sm",
            iconClassName,
          )}
        >
          {iconLabel}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight tracking-tight">
            {name}
          </h3>
          {handle ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              {handle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-0">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between border-b border-border/40 py-2 text-sm last:border-b-0"
          >
            <span className="text-muted-foreground">{m.label}</span>
            <span className="mono-nums font-semibold text-foreground">
              {m.value}
            </span>
          </div>
        ))}
      </div>
      {bestPost ? (
        <div className="mt-4 rounded-lg border border-signal/40 bg-signal/10 px-3.5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {bestPost.label}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {bestPost.value}
          </p>
        </div>
      ) : null}
      {notes ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {notes}
        </p>
      ) : null}
    </div>
  );
}

type SplitProps = { children: ReactNode };

export function SocialSplit({ children }: SplitProps) {
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export const PLATFORM_STYLES = {
  instagram:
    "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
  facebook: "bg-[#1877F2]",
  linkedin: "bg-[#0A66C2]",
  tiktok: "bg-neutral-900",
} as const;

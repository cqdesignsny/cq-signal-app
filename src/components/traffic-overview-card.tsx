import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChannelDonut, paletteFor } from "@/components/report/channel-donut";
import { TrendChart } from "@/components/report/trend-chart";
import { DeltaPill } from "@/components/report/delta-pill";
import type { GA4Snapshot } from "@/lib/integrations/ga4";

type Props = {
  businessSlug: string;
  ga4: GA4Snapshot | undefined;
  rangeLabel: string;
};

const CHANNEL_COLOR_MAP: Record<string, string> = {
  Direct: "#F59E0B",
  "Organic Search": "#22C55E",
  "Paid Search": "#8B5CF6",
  "Cross-network": "#8B5CF6",
  Email: "#EC4899",
  "Organic Social": "#3B82F6",
  "Paid Social": "#0EA5E9",
  Referral: "#14B8A6",
  Display: "#A855F7",
  "Paid Shopping": "#F97316",
  "Organic Shopping": "#10B981",
  "Organic Video": "#EF4444",
  Other: "#94A3B8",
};

function colorForChannel(name: string, index: number): string {
  return CHANNEL_COLOR_MAP[name] ?? paletteFor(index);
}

function formatNumberCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return Math.round(n).toString();
}

export function TrafficOverviewCard({ businessSlug, ga4, rangeLabel }: Props) {
  if (!ga4) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 shadow-sm backdrop-blur md:p-9">
        <div className="absolute inset-0 -z-10 bg-mesh-brand opacity-40" aria-hidden />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              All Visitors · Google Analytics
            </p>
            <p className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
              No GA4 data yet
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Once GA4 is connected for this business, the traffic total, channel
          mix, and a sparkline trend will appear here.
        </p>
      </section>
    );
  }

  const channelSegments = (ga4.channelBreakdown ?? [])
    .slice(0, 6)
    .map((c, i) => ({
      label: c.channel,
      pct: c.pct,
      color: colorForChannel(c.channel, i),
    }));

  const dailySeries = (ga4.dailySessions ?? []).map((d) => d.sessions);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 shadow-sm backdrop-blur md:p-9">
      <div className="absolute inset-0 -z-10 bg-mesh-brand opacity-40" aria-hidden />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Find out how your audience is growing
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
            Traffic over the last {rangeLabel.toLowerCase()}
          </h2>
        </div>
        <Link
          href={`/app/businesses/${businessSlug}/ga4`}
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Open Google Analytics
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <p className="mono-nums text-5xl font-extrabold leading-none text-foreground md:text-6xl">
              {formatNumberCompact(ga4.sessions.current)}
            </p>
            <p className="text-sm text-muted-foreground">All Visitors</p>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <DeltaPill deltaPct={ga4.sessions.deltaPct} withSuffix />
          </div>
          {dailySeries.length > 1 ? (
            <div className="mt-5 overflow-hidden">
              <TrendChart data={dailySeries} color="#22C55E" height={160} />
            </div>
          ) : null}
        </div>

        {channelSegments.length > 0 ? (
          <div className="lg:flex lg:justify-end">
            <ChannelDonut segments={channelSegments} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

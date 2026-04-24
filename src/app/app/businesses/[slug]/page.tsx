import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Settings2 } from "lucide-react";
import {
  channelCards,
  getBusiness,
  type Integration,
} from "@/lib/businesses";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatPanel } from "@/components/chat-panel";
import { ExportForAiMenu } from "@/components/export-for-ai-menu";
import { ShareReportMenu } from "@/components/share-report-menu";
import { ReportRangeTabs } from "@/components/report-range-tabs";
import { SignalRecommendations } from "@/components/signal-recommendations";
import {
  fetchRangeData,
  RANGES,
  type RangeData,
  type RangeKey,
} from "@/lib/reports/snapshot";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const RANGE_KEYS: RangeKey[] = RANGES.map((r) => r.key);
const DEFAULT_RANGE: RangeKey = "30d";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business?.name ?? "Business",
  };
}

type LiveCardValues = {
  primary?: { label: string; value: string };
  secondary?: Array<{ label: string; value: string }>;
  note?: string;
};

function formatDelta(deltaPct: number): string {
  if (!Number.isFinite(deltaPct) || deltaPct === 0) return "flat";
  const sign = deltaPct > 0 ? "+" : "";
  return `${sign}${deltaPct.toFixed(0)}%`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function liveValuesFor(
  key: Integration,
  range: RangeData,
): LiveCardValues | null {
  if (key === "ga4" && range.ga4) {
    const g = range.ga4;
    const topSource = g.topSources[0];
    const topLanding = g.topLandingPages[0]?.path || "/";
    return {
      primary: {
        label: "Sessions",
        value: Math.round(g.sessions.current).toLocaleString(),
      },
      secondary: [
        {
          label: `vs prior (${formatDelta(g.sessions.deltaPct)})`,
          value: Math.round(g.sessions.prior).toLocaleString(),
        },
        {
          label: "Top source",
          value: topSource?.source ?? "—",
        },
        {
          label: "Top landing",
          value: topLanding.length > 18 ? topLanding.slice(0, 16) + "…" : topLanding,
        },
      ],
      note: `Avg session ${formatDuration(g.avgSessionDurationSec.current)}`,
    };
  }

  if (key === "typeform" && range.typeform) {
    const t = range.typeform;
    return {
      primary: {
        label: "New leads",
        value: String(t.totalLeads.current),
      },
      secondary: [
        {
          label: `vs prior (${formatDelta(t.totalLeads.deltaPct)})`,
          value: String(t.totalLeads.prior),
        },
        {
          label: "Latest",
          value: t.leads[0]?.name ?? t.leads[0]?.email ?? "—",
        },
      ],
    };
  }

  return null;
}

function resolveRangeKey(value: unknown): RangeKey {
  if (typeof value === "string" && RANGE_KEYS.includes(value as RangeKey)) {
    return value as RangeKey;
  }
  return DEFAULT_RANGE;
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const business = getBusiness(slug);
  if (!business) notFound();

  const activeRange = resolveRangeKey(sp.range);
  const rangeCfg = RANGES.find((r) => r.key === activeRange)!;
  const rangeData = await fetchRangeData(slug, activeRange);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-10 xl:grid-cols-[1fr_400px]">
      <div className="min-w-0 space-y-12">
        <header className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Business · {business.vertical}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/app/businesses/${business.slug}/profile`}>
                  <Settings2 className="size-3.5" />
                  Edit profile
                </Link>
              </Button>
              <ExportForAiMenu
                businessSlug={business.slug}
                businessName={business.name}
              />
              <ShareReportMenu businessName={business.name} />
            </div>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {business.tagline}
          </p>
        </header>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">
                {rangeCfg.label} at a glance
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {rangeData.range.startDate} to {rangeData.range.endDate}
                <span className="mx-2 opacity-40">·</span>
                vs {rangeData.priorRange.startDate} to {rangeData.priorRange.endDate}
              </p>
            </div>
            <ReportRangeTabs activeRange={activeRange} defaultRange={DEFAULT_RANGE} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.integrations.map((key) => {
              const config = channelCards[key];
              if (!config) return null;
              const live = liveValuesFor(key, rangeData);
              const primary = live?.primary ?? config.primary;
              const secondary = live?.secondary ?? config.secondary;
              const isLive = Boolean(live);
              return (
                <Link
                  key={key}
                  href={`/app/businesses/${business.slug}/${key}`}
                  className="group"
                >
                  <Card className="card-lift relative h-full group-hover:ring-2 group-hover:ring-brand/45">
                    {isLive ? (
                      <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-brand ring-1 ring-inset ring-brand/30">
                        <span className="size-1.5 rounded-full bg-brand" />
                        Live
                      </span>
                    ) : null}
                    <CardHeader className="gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-0.5">
                          <CardDescription className="font-mono text-[11px] uppercase tracking-widest transition-colors group-hover:text-brand">
                            {config.source}
                          </CardDescription>
                          {config.sourceDescription ? (
                            <p className="text-[11px] leading-tight text-muted-foreground/75">
                              {config.sourceDescription}
                            </p>
                          ) : null}
                        </div>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand group-hover:opacity-100" />
                      </div>
                      <CardTitle className="font-sans text-base font-normal text-muted-foreground">
                        {primary.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="mono-nums text-5xl leading-none text-foreground md:text-6xl">
                        {primary.value}
                      </p>
                      <div className="flex gap-4 border-t pt-3 text-xs text-muted-foreground">
                        {secondary.map((s) => (
                          <div key={s.label} className="min-w-0 flex-1">
                            <p className="mono-nums truncate text-sm text-foreground">
                              {s.value}
                            </p>
                            <p className="mt-0.5 truncate">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      {live?.note ? (
                        <p className="text-[11px] italic text-muted-foreground/80">
                          {live.note}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <SignalRecommendations
          businessName={business.name}
          vertical={business.vertical}
          tagline={business.tagline}
          rangeLabel={rangeCfg.label}
          range={rangeData}
        />
      </div>

      <aside className="xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
        <ChatPanel businessSlug={business.slug} businessName={business.name} />
      </aside>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import {
  channelCards,
  channelDetails,
  getBusiness,
  type Integration,
} from "@/lib/businesses";
import { getManualCard } from "@/lib/manual-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareReportMenu } from "@/components/share-report-menu";
import { ReportRangeTabs } from "@/components/report-range-tabs";
import { TrafficOverviewCard } from "@/components/traffic-overview-card";
import { TrendChart } from "@/components/report/trend-chart";
import { DataTable, type Column } from "@/components/report/data-table";
import { DeltaPill } from "@/components/report/delta-pill";
import { LeadStatusBadge } from "@/components/report/lead-status-badge";
import { EmptyState } from "@/components/report/empty-state";
import {
  fetchRangeData,
  RANGES,
  type RangeKey,
} from "@/lib/reports/snapshot";
import type { TypeformLead } from "@/lib/integrations/typeform";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; channel: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const KNOWN_CHANNELS = new Set<string>([
  "ga4",
  "google-ads",
  "google-lsa",
  "meta-ads",
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "shopify",
  "klaviyo",
  "omnisend",
  "typeform",
  "vagaro",
  "boulevard",
  "booksy",
  "housecall-pro",
]);

const RANGE_KEYS: RangeKey[] = RANGES.map((r) => r.key);
const DEFAULT_RANGE: RangeKey = "30d";

function resolveRangeKey(value: unknown): RangeKey {
  if (typeof value === "string" && RANGE_KEYS.includes(value as RangeKey)) {
    return value as RangeKey;
  }
  return DEFAULT_RANGE;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, channel } = await params;
  const business = getBusiness(slug);
  const detail = KNOWN_CHANNELS.has(channel)
    ? channelDetails[channel as Integration]
    : null;
  return {
    title:
      business && detail ? `${detail.title} · ${business.name}` : "Channel",
  };
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const r = Math.floor(seconds % 60);
  return m === 0 ? `${r}s` : `${m}m ${String(r).padStart(2, "0")}s`;
}

function titleFromPath(path: string): string {
  if (!path || path === "/") return "Home";
  const cleaned = path.replace(/^\//, "").replace(/\/$/, "").split(/[?#]/)[0];
  if (!cleaned) return "Home";
  const last = cleaned.split("/").filter(Boolean).pop() ?? cleaned;
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function ChannelPage({ params, searchParams }: Props) {
  const { slug, channel } = await params;
  const sp = await searchParams;
  const business = getBusiness(slug);

  if (!business || !KNOWN_CHANNELS.has(channel)) notFound();
  const ch = channel as Integration;
  if (!business.integrations.includes(ch)) notFound();

  const card = channelCards[ch];
  const detail = channelDetails[ch];
  const activeRange = resolveRangeKey(sp.range);
  const rangeCfg = RANGES.find((r) => r.key === activeRange)!;
  const rangeData = await fetchRangeData(slug, activeRange);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
        >
          <Link href={`/app/businesses/${business.slug}`}>
            <ArrowLeft className="size-3.5" />
            {business.name}
          </Link>
        </Button>
      </div>

      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {card.source} · {business.name}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl tracking-tight md:text-6xl">
            {detail.title}
          </h1>
          <ShareReportMenu businessName={`${business.name} ${card.source}`} />
        </div>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          {detail.description}
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl tracking-tight md:text-2xl">
          {rangeCfg.label} of data
        </h2>
        <ReportRangeTabs
          activeRange={activeRange}
          defaultRange={DEFAULT_RANGE}
        />
      </div>

      {ch === "ga4" ? (
        <GA4ChannelView
          slug={business.slug}
          rangeData={rangeData}
          rangeLabel={rangeCfg.label}
        />
      ) : ch === "typeform" ? (
        <TypeformChannelView rangeData={rangeData} rangeLabel={rangeCfg.label} />
      ) : (
        <ManualChannelView
          slug={business.slug}
          integration={ch}
          source={card.source}
          fallbackPrimary={card.primary}
          fallbackSecondary={card.secondary}
          detailSections={detail.sections}
        />
      )}
    </div>
  );
}

function GA4ChannelView({
  slug,
  rangeData,
  rangeLabel,
}: {
  slug: string;
  rangeData: Awaited<ReturnType<typeof fetchRangeData>>;
  rangeLabel: string;
}) {
  const ga4 = rangeData.ga4;

  if (!ga4) {
    return (
      <EmptyState
        title="GA4 not connected for this business"
        body="Connect Google Analytics to see sessions, channel mix, top content, and audience trends."
      />
    );
  }

  const dailySeries = ga4.dailySessions.map((d) => d.sessions);

  type ContentRow = {
    path: string;
    title: string;
    sessions: number;
    pageviews: number;
  };
  const contentRows: ContentRow[] = ga4.topLandingPages
    .slice(0, 10)
    .map((p) => ({
      path: p.path || "/",
      title: titleFromPath(p.path),
      sessions: p.sessions,
      pageviews: p.pageviews ?? p.sessions,
    }));

  const contentColumns: Column<ContentRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.title}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            {row.path}
          </p>
        </div>
      ),
    },
    {
      key: "pageviews",
      header: "Pageviews",
      align: "right",
      render: (row) => (
        <span className="mono-nums">{formatNumber(row.pageviews)}</span>
      ),
    },
    {
      key: "sessions",
      header: "Sessions",
      align: "right",
      render: (row) => (
        <span className="mono-nums">{formatNumber(row.sessions)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-7">
      <TrafficOverviewCard
        businessSlug={slug}
        ga4={ga4}
        rangeLabel={rangeLabel}
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Sessions"
          value={formatNumber(ga4.sessions.current)}
          deltaPct={ga4.sessions.deltaPct}
        />
        <KPICard
          label="Users"
          value={formatNumber(ga4.users.current)}
          deltaPct={ga4.users.deltaPct}
        />
        <KPICard
          label="Avg session"
          value={formatDuration(ga4.avgSessionDurationSec.current)}
          deltaPct={null}
          subtitle={`vs ${formatDuration(ga4.avgSessionDurationSec.prior)} prior`}
        />
        <KPICard
          label="Bounce rate"
          value={`${(ga4.bounceRate.current * 100).toFixed(1)}%`}
          deltaPct={null}
          positiveIsGood={false}
          subtitle={`vs ${(ga4.bounceRate.prior * 100).toFixed(1)}% prior`}
        />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/70 p-7 shadow-sm backdrop-blur md:p-8">
        <h3 className="font-display text-xl tracking-tight">
          Top content over the last {rangeLabel.toLowerCase()}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Source: Google Analytics
        </p>
        <div className="mt-5">
          <DataTable columns={contentColumns} rows={contentRows} />
        </div>
      </section>

      {dailySeries.length > 1 ? (
        <section className="rounded-2xl border border-border/60 bg-card/70 p-7 shadow-sm backdrop-blur md:p-8">
          <h3 className="font-display text-xl tracking-tight">
            Sessions trend
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Daily sessions across the active range
          </p>
          <div className="mt-5 overflow-hidden">
            <TrendChart data={dailySeries} color="#22C55E" height={220} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TypeformChannelView({
  rangeData,
  rangeLabel,
}: {
  rangeData: Awaited<ReturnType<typeof fetchRangeData>>;
  rangeLabel: string;
}) {
  const t = rangeData.typeform;
  if (!t) {
    return (
      <EmptyState
        title="Typeform not connected for this business"
        body="Connect Typeform (or another form provider) to capture every submission with name, contact, and any custom answers."
      />
    );
  }

  type LeadRow = TypeformLead & { firstAnswer?: string };
  const rows: LeadRow[] = t.leads.slice(0, 25).map((l) => {
    const answers = Object.values(l.fields ?? {});
    const firstAnswer = answers.find((v) => v && v.length > 0 && v.length < 280);
    return { ...l, firstAnswer };
  });

  const columns: Column<LeadRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => row.name ?? "—",
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (
        <span className="font-mono text-[12px]">
          {row.email ?? row.phone ?? "—"}
        </span>
      ),
    },
    {
      key: "answer",
      header: "What they said",
      render: (row) => (
        <span className="block max-w-[340px] truncate text-muted-foreground">
          {row.firstAnswer ?? "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Submitted",
      align: "right",
      render: (row) => (
        <span className="mono-nums text-xs">
          {new Date(row.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: () => <LeadStatusBadge status="new" />,
    },
  ];

  return (
    <div className="space-y-7">
      <section className="grid gap-4 md:grid-cols-3">
        <KPICard
          label="New leads"
          value={String(t.totalLeads.current)}
          deltaPct={t.totalLeads.deltaPct}
        />
        <KPICard
          label="Previous period"
          value={String(t.totalLeads.prior)}
          deltaPct={null}
        />
        <KPICard
          label="Latest submission"
          value={
            t.leads[0]
              ? new Date(t.leads[0].submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          deltaPct={null}
        />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/70 p-7 shadow-sm backdrop-blur md:p-8">
        <h3 className="font-display text-xl tracking-tight">
          Lead submissions ({rangeLabel.toLowerCase()})
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Names, contact info, and the first text answer captured by the form.
        </p>
        <div className="mt-5">
          <DataTable
            columns={columns}
            rows={rows}
            emptyState={
              <p className="mt-5 text-sm text-muted-foreground">
                No form submissions in this period.
              </p>
            }
          />
        </div>
      </section>
    </div>
  );
}

function ManualChannelView({
  slug,
  integration,
  source,
  fallbackPrimary,
  fallbackSecondary,
  detailSections,
}: {
  slug: string;
  integration: Integration;
  source: string;
  fallbackPrimary: { label: string; value: string; note?: string };
  fallbackSecondary: { label: string; value: string }[];
  detailSections: { title: string; description: string }[];
}) {
  const m = getManualCard(slug, integration);
  const primary = m?.primary ?? fallbackPrimary;
  const secondary = m?.secondary ?? fallbackSecondary;
  const note = m?.notes;

  return (
    <div className="space-y-7">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-start gap-3 px-8 py-10 md:px-10 md:py-14">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {primary.label}
          </p>
          <p className="mono-nums text-6xl leading-none text-foreground md:text-8xl">
            {primary.value}
          </p>
          {primary.note ? (
            <p className="text-sm text-muted-foreground">{primary.note}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t pt-5 text-sm">
            {secondary.slice(0, 4).map((s) => (
              <div key={s.label}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <p className="mono-nums mt-1 text-lg text-foreground">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {note ? (
        <section className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Notes from {source}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {note}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-lg tracking-tight text-muted-foreground md:text-xl">
          What you'll see here once {source} is fully wired
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {detailSections.map((s) => (
            <Card key={s.title}>
              <CardHeader className="gap-1">
                <CardTitle className="font-display text-lg leading-tight">
                  {s.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {s.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function KPICard({
  label,
  value,
  deltaPct,
  positiveIsGood = true,
  subtitle,
}: {
  label: string;
  value: string;
  deltaPct?: number | null;
  positiveIsGood?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mono-nums mt-2 text-3xl font-semibold text-foreground md:text-4xl">
        {value}
      </p>
      {deltaPct !== undefined && deltaPct !== null ? (
        <div className="mt-1.5">
          <DeltaPill deltaPct={deltaPct} positiveIsGood={positiveIsGood} />
        </div>
      ) : subtitle ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

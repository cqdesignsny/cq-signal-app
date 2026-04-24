import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getReportByShareToken,
  REPORT_RANGES,
  type ManualChannelData,
  type ReportRangeKey,
  type ReportSnapshot,
} from "@/lib/reports/generate";
import {
  generateRecommendations,
  type Recommendation,
} from "@/lib/reports/recommendations";
import { ReportRangeTabs } from "@/components/report-range-tabs";
import { ReportHeader } from "@/components/report/report-header";
import { PrintOnLoad } from "@/components/report/print-on-load";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionNav, type SectionNavItem } from "@/components/report/section-nav";
import { SectionCard } from "@/components/report/section-card";
import { SectionGroup, SubCard } from "@/components/report/section-group";
import { ExecSummary } from "@/components/report/exec-summary";
import { MetricGrid, MetricBox } from "@/components/report/metric-grid";
import { HeroMetric } from "@/components/report/hero-metric";
import {
  ChannelDonut,
  paletteFor,
} from "@/components/report/channel-donut";
import { TrendChart } from "@/components/report/trend-chart";
import { DataTable, type Column } from "@/components/report/data-table";
import {
  LeadStatusBadge,
  type LeadStatus,
} from "@/components/report/lead-status-badge";
import { CampaignHighlight } from "@/components/report/campaign-highlight";
import {
  SocialSplit,
  SocialPlatform,
  PLATFORM_STYLES,
} from "@/components/report/social-split";
import { CoreWebVitals } from "@/components/report/core-web-vitals";
import { RecommendationsList } from "@/components/report/recommendations-list";
import { ReportFooter } from "@/components/report/report-footer";
import { EmptyState } from "@/components/report/empty-state";
import { PrintButton } from "@/components/report/print-button";
import type { TypeformLead } from "@/lib/integrations/typeform";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ range?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const snapshot = await getReportByShareToken(token);
  if (!snapshot) return { title: "Report not found" };
  return {
    title: `${snapshot.business.name} marketing report`,
    description: `Marketing performance report for ${snapshot.business.name}.`,
  };
}

function isValidRange(value: string | undefined): value is ReportRangeKey {
  return REPORT_RANGES.some((r) => r.key === value);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function formatNumberCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return Math.round(n).toString();
}

function formatDuration(seconds: number): string {
  if (!seconds || Number.isNaN(seconds)) return "—";
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m === 0 ? `${r}s` : `${m}m ${r.toString().padStart(2, "0")}s`;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const sameMonth =
    s.getUTCMonth() === e.getUTCMonth() &&
    s.getUTCFullYear() === e.getUTCFullYear();
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const monthLong = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const monthShort = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  if (sameMonth) {
    return `${monthLong(s)} ${s.getUTCDate()} to ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  if (sameYear) {
    return `${monthShort(s)} ${s.getUTCDate()} to ${monthShort(e)} ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  return `${monthShort(s)} ${s.getUTCDate()}, ${s.getUTCFullYear()} to ${monthShort(e)} ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
}

function periodBadge(rangeKey: ReportRangeKey, end: string): string {
  const e = new Date(end + "T00:00:00Z");
  const monthLong = e.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = e.getUTCFullYear();
  const isMonthToDate = rangeKey === "30d";
  if (isMonthToDate) return `${monthLong} ${year} — Month to Date`;
  const labelMap: Record<ReportRangeKey, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "1y": "Last 12 months",
  };
  return `${labelMap[rangeKey]}, ${year}`;
}

function pickLeadStatus(_lead: TypeformLead): LeadStatus {
  // No status field on raw Typeform leads yet; default to "New" until we
  // wire a CRM status loop.
  return "new";
}

function manualChannel(
  channels: ManualChannelData[],
  key: ManualChannelData["channel"],
): ManualChannelData | undefined {
  return channels.find((c) => c.channel === key);
}

function manualSecondary(
  channel: ManualChannelData | undefined,
  label: RegExp,
): string | undefined {
  if (!channel) return undefined;
  const hit = channel.secondary.find((s) => label.test(s.label));
  return hit?.value;
}

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

export default async function ReportPage({ params, searchParams }: Props) {
  const { token } = await params;
  const sp = await searchParams;
  const snapshot = await getReportByShareToken(token);
  if (!snapshot) notFound();

  const activeRange: ReportRangeKey = isValidRange(sp.range)
    ? sp.range
    : snapshot.primaryRange;

  return <ReportView snapshot={snapshot} activeRange={activeRange} />;
}

async function ReportView({
  snapshot,
  activeRange,
}: {
  snapshot: ReportSnapshot;
  activeRange: ReportRangeKey;
}) {
  const { business, manualChannels, narrative } = snapshot;
  const rangeData = snapshot.ranges[activeRange];

  const navItems: SectionNavItem[] = [
    { id: "summary", label: "Summary" },
    { id: "traffic", label: "Traffic" },
    { id: "leads", label: "Leads" },
    { id: "email", label: "Email" },
    { id: "ads", label: "Ads" },
    { id: "social", label: "Social" },
    { id: "recommendations", label: "Recommendations" },
  ];

  let recommendations: Recommendation[] = [];
  let recommendationsErrored = false;
  try {
    recommendations = await generateRecommendations({
      businessName: business.name,
      vertical: business.vertical ?? "",
      tagline: business.tagline ?? "",
      rangeLabel:
        REPORT_RANGES.find((r) => r.key === activeRange)?.label ?? activeRange,
      activeRange: rangeData,
      manualNotes: manualChannels
        .map((c) => `${c.source}: ${c.notes ?? ""}`)
        .filter((s) => s.length > 5)
        .join("\n\n"),
    });
  } catch (err) {
    console.error("[report] recommendations failed", err);
    recommendationsErrored = true;
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <ReportHeader
        business={{
          name: business.name,
          logoUrl: business.logoUrl,
          shortName: business.shortName ?? business.name,
          tagline: business.tagline,
          vertical: business.vertical,
        }}
        periodLabel={periodBadge(activeRange, rangeData.range.endDate)}
        reportTitle="Marketing report"
      />

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3 px-1 print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-widest">View range</span>
          <ReportRangeTabs
            activeRange={activeRange}
            defaultRange={snapshot.primaryRange}
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <PrintButton />
        </div>
      </div>
      <PrintOnLoad />

      <SectionNav items={navItems} />

        {/* 1. Executive Summary */}
        <SectionCard
          id="summary"
          number={1}
          title="Executive Summary"
          tone="gold"
        >
          <ExecSummary
            body={narrative ?? "Live data is flowing. Once a few periods stack up, this section will summarize what changed and why."}
          />
          <div className="mt-5 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider">
                Period
              </p>
              <p className="mt-0.5 text-foreground">
                {formatDateRange(rangeData.range.startDate, rangeData.range.endDate)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider">
                Compared to
              </p>
              <p className="mt-0.5 text-foreground">
                {formatDateRange(
                  rangeData.priorRange.startDate,
                  rangeData.priorRange.endDate,
                )}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider">
                Generated
              </p>
              <p className="mt-0.5 text-foreground">
                {new Date(snapshot.generatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* 2. Website Traffic (group) */}
        <SectionGroup
          id="traffic"
          number={2}
          title="Website Traffic"
          badge={activeRange === "30d" ? "Month to Date" : undefined}
        >
          <TrafficSection rangeData={rangeData} />
        </SectionGroup>

        {/* 3. Leads */}
        <SectionCard id="leads" number={3} title="Leads" tone="gold">
          {rangeData.typeform ? (
            <>
              <MetricGrid>
                <MetricBox
                  label="Total Leads"
                  value={formatNumber(rangeData.typeform.totalLeads.current)}
                />
                <MetricBox
                  label="vs Previous Period"
                  value={formatNumber(rangeData.typeform.totalLeads.prior)}
                  deltaPct={rangeData.typeform.totalLeads.deltaPct}
                />
              </MetricGrid>
              <LeadsTable leads={rangeData.typeform.leads.slice(0, 10)} />
            </>
          ) : (
            <EmptyState
              title="Lead form not connected yet"
              body="Connect Typeform (or another form provider) to capture every submission with name, contact, and timestamp."
            />
          )}
        </SectionCard>

        {/* 4. Email Marketing */}
        <SectionCard id="email" number={4} title="Email Marketing" tone="red">
          <EmailSection channel={manualChannel(manualChannels, "omnisend")} />
        </SectionCard>

        {/* 5. Ads */}
        <SectionCard id="ads" number={5} title="Paid Ads" tone="gold">
          <AdsSection channel={manualChannel(manualChannels, "meta-ads")} />
        </SectionCard>

        {/* 6. Organic Social */}
        <SectionCard id="social" number={6} title="Organic Social" tone="red">
          <OrganicSocialSection
            instagram={manualChannel(manualChannels, "instagram")}
            facebook={manualChannel(manualChannels, "facebook")}
            linkedin={manualChannel(manualChannels, "linkedin")}
          />
        </SectionCard>

        {/* 7. Recommendations */}
        <SectionCard
          id="recommendations"
          number={7}
          title="Recommendations & Next Steps"
          tone="gold"
        >
          {recommendationsErrored ? (
            <EmptyState
              title="Signal couldn't generate recommendations"
              body="The AI Gateway returned an error. Refresh the page or check the gateway billing status."
            />
          ) : (
            <RecommendationsList
              items={recommendations.map((r) => ({
                title: r.title,
                body: r.rationale,
                expected: r.expected,
                priority: r.priority,
              }))}
            />
          )}
        </SectionCard>

      <ReportFooter
        businessName={business.name}
        generatedAt={snapshot.generatedAt}
      />
    </main>
  );
}

function TrafficSection({ rangeData }: { rangeData: ReportSnapshot["ranges"][ReportRangeKey] }) {
  const ga4 = rangeData.ga4;

  if (!ga4) {
    return (
      <SubCard title="Website analytics" source="Google Analytics">
        <EmptyState
          title="GA4 not connected for this business"
          body="Once connected, you'll see sessions, top pages, traffic sources, and a daily trend here."
        />
      </SubCard>
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
    <>
      {/* 2A. All Visitors + Donut + Trend */}
      <SubCard title="All Visitors" source="Google Analytics">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <HeroMetric
            value={formatNumber(ga4.sessions.current)}
            deltaPct={ga4.sessions.deltaPct}
            chart={
              dailySeries.length > 1 ? (
                <TrendChart data={dailySeries} color="#22C55E" height={180} />
              ) : null
            }
          />
          {channelSegments.length > 0 ? (
            <div className="lg:max-w-[320px] lg:flex-shrink-0">
              <ChannelDonut segments={channelSegments} />
            </div>
          ) : null}
        </div>
      </SubCard>

      {/* 2B. Search Performance (Search Console — empty state for now) */}
      <SubCard title="Search Performance" source="Search Console">
        <EmptyState
          title="Search Console not yet connected"
          body="Once wired, you'll see total impressions, clicks, top queries, and a daily trend with prior-period overlay."
        />
      </SubCard>

      {/* 2C. Audience: New vs Returning + Cities — empty state for now */}
      <SubCard title="Audience" source="Google Analytics">
        <div className="grid gap-4 md:grid-cols-2">
          <AudienceQuickCard
            label="Avg session duration"
            value={formatDuration(ga4.avgSessionDurationSec.current)}
            prior={formatDuration(ga4.avgSessionDurationSec.prior)}
          />
          <AudienceQuickCard
            label="Bounce rate"
            value={`${(ga4.bounceRate.current * 100).toFixed(1)}%`}
            prior={`${(ga4.bounceRate.prior * 100).toFixed(1)}%`}
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          New vs returning visitor breakdowns and top-cities data will land here once we extend the GA4 query to pull `firstUserDefaultChannelGroup` and `city` dimensions.
        </p>
      </SubCard>

      {/* 2D. Top Search Queries (empty state) */}
      <SubCard title="Top Search Queries" source="Search Console">
        <EmptyState
          title="Connect Google Search Console"
          body="Once authorized, the top 10 queries this period will appear here ranked by clicks, with impression counts."
        />
      </SubCard>

      {/* 2E. Top Content */}
      <SubCard title="Top Content" source="Google Analytics">
        <TopContentTable pages={ga4.topLandingPages.slice(0, 10)} />
      </SubCard>

      {/* 2F. Core Web Vitals */}
      <SubCard
        title="Core Web Vitals"
        source="PageSpeed Insights — Field Data"
      >
        <CoreWebVitals
          vitals={[
            {
              label: "Largest Contentful Paint",
              description: "How fast the main content loads",
              value: "—",
              rating: "na",
            },
            {
              label: "Cumulative Layout Shift",
              description: "How stable the page is while loading",
              value: "—",
              rating: "na",
            },
            {
              label: "Interaction to Next Paint",
              description: "How fast the page responds to taps and clicks",
              value: "—",
              rating: "na",
            },
          ]}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Field data appears once the PageSpeed Insights API integration is wired up. Lab data is also possible if you want a quick proxy in the meantime.
        </p>
      </SubCard>
    </>
  );
}

function AudienceQuickCard({
  label,
  value,
  prior,
}: {
  label: string;
  value: string;
  prior: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mono-nums mt-1 text-2xl font-extrabold text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">vs {prior} prior</p>
    </div>
  );
}

function TopContentTable({
  pages,
}: {
  pages: Array<{ path: string; sessions: number; pageviews?: number }>;
}) {
  type PageRow = {
    path: string;
    title: string;
    sessions: number;
    pageviews: number;
  };

  const rows: PageRow[] = pages.map((p) => ({
    path: p.path || "/",
    title: titleFromPath(p.path),
    sessions: p.sessions,
    pageviews: p.pageviews ?? p.sessions,
  }));

  const columns: Column<PageRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">{row.title}</p>
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
      render: (row) => formatNumber(row.pageviews),
    },
    {
      key: "sessions",
      header: "Sessions",
      align: "right",
      render: (row) => formatNumber(row.sessions),
    },
  ];

  return <DataTable columns={columns} rows={rows} />;
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

function LeadsTable({ leads }: { leads: TypeformLead[] }) {
  const columns: Column<TypeformLead>[] = [
    {
      key: "date",
      header: "Date",
      width: "92px",
      render: (lead) => (
        <span className="mono-nums text-xs">
          {new Date(lead.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (lead) => lead.name ?? "Lead",
    },
    {
      key: "company",
      header: "Company",
      render: (lead) => (
        <span className="text-muted-foreground">{lead.company ?? "—"}</span>
      ),
    },
    {
      key: "message",
      header: "What they need",
      render: (lead) => (
        <span className="block max-w-[420px] truncate text-muted-foreground">
          {lead.message ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (lead) => <LeadStatusBadge status={pickLeadStatus(lead)} />,
    },
  ];
  return (
    <div className="mt-5">
      <DataTable
        columns={columns}
        rows={leads}
        emptyState={
          <p className="mt-5 text-sm text-muted-foreground">
            No form submissions in this period.
          </p>
        }
      />
    </div>
  );
}

function EmailSection({ channel }: { channel?: ManualChannelData }) {
  if (!channel) {
    return (
      <EmptyState
        title="Email channel not configured"
        body="Add an Omnisend or Klaviyo manual entry to the report (or wire the API integration) to surface open rates, CTR, and best-performing campaign here."
      />
    );
  }
  const sent = manualSecondary(channel, /sent|emails sent/i) ?? "—";
  const ctr = manualSecondary(channel, /click|ctr/i) ?? "—";
  const campaigns = manualSecondary(channel, /campaigns?/i);

  return (
    <>
      <MetricGrid>
        <MetricBox label="Emails Sent" value={sent} />
        <MetricBox label="Avg Open Rate" value={channel.primary.value} />
        <MetricBox label="Avg Click-through" value={ctr} />
        {campaigns ? (
          <MetricBox label="Campaigns" value={campaigns} />
        ) : null}
      </MetricGrid>
      {channel.notes ? (
        <CampaignHighlight label="What we learned" value={channel.notes} />
      ) : null}
    </>
  );
}

function AdsSection({ channel }: { channel?: ManualChannelData }) {
  if (!channel) {
    return (
      <EmptyState
        title="No paid ads channel data"
        body="Add a Meta Ads or Google Ads manual entry (or wire the API) to surface spend, leads, CPL, and campaign breakdown here."
      />
    );
  }
  const isOff =
    channel.primary.value === "$0" ||
    /not running/i.test(channel.notes ?? "") ||
    /paused/i.test(channel.primary.note ?? "");

  if (isOff) {
    return (
      <>
        <EmptyState
          title="Not running paid ads this period"
          body={channel.notes ?? "When ads resume, spend, leads, and cost-per-lead will populate here."}
        />
      </>
    );
  }

  return (
    <>
      <MetricGrid>
        <MetricBox label={channel.primary.label} value={channel.primary.value} />
        {channel.secondary.map((s) => (
          <MetricBox key={s.label} label={s.label} value={s.value} />
        ))}
      </MetricGrid>
      {channel.notes ? (
        <CampaignHighlight label="Notes" value={channel.notes} />
      ) : null}
    </>
  );
}

function OrganicSocialSection({
  instagram,
  facebook,
  linkedin,
}: {
  instagram?: ManualChannelData;
  facebook?: ManualChannelData;
  linkedin?: ManualChannelData;
}) {
  type Platform = {
    name: string;
    iconLabel: string;
    iconClassName: string;
    metrics: Array<{ label: string; value: string }>;
    notes?: string;
  };

  const platforms: Platform[] = [];
  if (instagram) {
    platforms.push({
      name: "Instagram",
      iconLabel: "IG",
      iconClassName: PLATFORM_STYLES.instagram,
      metrics: [
        { label: "Followers", value: instagram.primary.value },
        ...instagram.secondary.map((s) => ({ label: s.label, value: s.value })),
      ],
      notes: instagram.notes,
    });
  }
  if (facebook) {
    platforms.push({
      name: "Facebook",
      iconLabel: "FB",
      iconClassName: PLATFORM_STYLES.facebook,
      metrics: [
        { label: "Page followers", value: facebook.primary.value },
        ...facebook.secondary.map((s) => ({ label: s.label, value: s.value })),
      ],
      notes: facebook.notes,
    });
  }
  if (linkedin) {
    platforms.push({
      name: "LinkedIn",
      iconLabel: "in",
      iconClassName: PLATFORM_STYLES.linkedin,
      metrics: [
        { label: "Page followers", value: linkedin.primary.value },
        ...linkedin.secondary.map((s) => ({ label: s.label, value: s.value })),
      ],
      notes: linkedin.notes,
    });
  }

  if (platforms.length === 0) {
    return (
      <EmptyState
        title="No organic social channels configured"
        body="Add Instagram, Facebook, LinkedIn, or TikTok manual entries (or wire the APIs) to surface posts, reach, engagement, and best-performing content here."
      />
    );
  }

  // Render up to 2 per row; if 3 platforms, fall back to vertical stack on mobile.
  return (
    <SocialSplit>
      {platforms.map((p) => (
        <SocialPlatform
          key={p.name}
          name={p.name}
          iconLabel={p.iconLabel}
          iconClassName={p.iconClassName}
          metrics={p.metrics}
          notes={p.notes}
        />
      ))}
    </SocialSplit>
  );
}

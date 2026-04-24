import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportByShareToken, type ReportSnapshot } from "@/lib/reports/generate";
import type { GA4Snapshot } from "@/lib/integrations/ga4";
import type { TypeformSnapshot } from "@/lib/integrations/typeform";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const snapshot = await getReportByShareToken(token);
  if (!snapshot) return { title: "Report not found" };
  return {
    title: `${snapshot.business.name} · Marketing Report`,
    description: `Marketing performance report for ${snapshot.business.name}. ${snapshot.dateRange.label}.`,
  };
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params;
  const snapshot = await getReportByShareToken(token);
  if (!snapshot) notFound();

  return <ReportView snapshot={snapshot} />;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function formatDuration(seconds: number): string {
  if (!seconds || Number.isNaN(seconds)) return "—";
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}

function formatPercent(value: number, digits = 1): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const sameMonth =
    s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  const monthLong = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const monthShort = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  if (sameMonth) {
    return `${monthLong(s)} ${s.getUTCDate()} to ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  return `${monthShort(s)} ${s.getUTCDate()} to ${monthShort(e)} ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
}

function Delta({ deltaPct, positiveIsGood = true }: { deltaPct: number | null; positiveIsGood?: boolean }) {
  if (deltaPct === null || deltaPct === undefined || Number.isNaN(deltaPct)) {
    return null;
  }
  const isUp = deltaPct > 0.5;
  const isDown = deltaPct < -0.5;
  const tone = positiveIsGood
    ? isUp
      ? "text-emerald-600 dark:text-emerald-400"
      : isDown
        ? "text-brand"
        : "text-muted-foreground"
    : isUp
      ? "text-brand"
      : isDown
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground";
  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-mono text-xs font-medium", tone)}>
      <Icon className="size-3" />
      {Math.abs(deltaPct).toFixed(1)}%
    </span>
  );
}

function ReportView({ snapshot }: { snapshot: ReportSnapshot }) {
  const { business, dateRange, priorRange, ga4, typeform, manualChannels } = snapshot;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:py-16 print:py-6">
      <nav className="mb-10 flex items-center justify-between print:hidden">
        <Image
          src="/cq-signal-logo.png"
          alt="CQ Signal"
          width={140}
          height={40}
          className="block h-7 w-auto dark:hidden"
        />
        <Image
          src="/cq-signal-logo-dark.png"
          alt="CQ Signal"
          width={140}
          height={40}
          className="hidden h-7 w-auto dark:block"
        />
        <PrintButton />
      </nav>

      <header className="border-b pb-10 md:pb-14">
        {business.logoUrl ? (
          <Image
            src={business.logoUrl}
            alt={business.name}
            width={280}
            height={80}
            className="mb-8 h-16 w-auto max-w-[280px] object-contain object-left"
          />
        ) : null}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Marketing report · {dateRange.label}
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">
          {business.name}
        </h1>
        {business.tagline ? (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            {business.tagline}
          </p>
        ) : null}
        <div className="mt-8 grid gap-6 text-sm md:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Period
            </p>
            <p className="mt-1 font-display text-base text-foreground">
              {formatDateRange(dateRange.startDate, dateRange.endDate)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Compared to
            </p>
            <p className="mt-1 font-display text-base text-foreground">
              {formatDateRange(priorRange.startDate, priorRange.endDate)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Generated
            </p>
            <p className="mt-1 font-display text-base text-foreground">
              {new Date(snapshot.generatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {snapshot.narrative ? (
        <section className="relative mt-12 overflow-hidden rounded-2xl border border-border/60 p-8 md:p-10 print:break-inside-avoid">
          <div className="absolute inset-0 bg-mesh-brand" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Signal read
              </p>
            </div>
            <p className="mt-4 font-display text-2xl leading-snug md:text-3xl">
              {snapshot.narrative}
            </p>
          </div>
        </section>
      ) : null}

      {ga4 ? <GA4Section snapshot={ga4} /> : null}

      {typeform ? <TypeformSection snapshot={typeform} /> : null}

      {manualChannels.map((channel) => (
        <ManualSection key={channel.channel} data={channel} />
      ))}

      <footer className="mt-20 border-t pt-8 text-sm text-muted-foreground print:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>
            Generated by{" "}
            <Image
              src="/cq-signal-logo.png"
              alt="CQ Signal"
              width={100}
              height={28}
              className="inline-block h-4 w-auto align-middle dark:hidden"
            />
            <Image
              src="/cq-signal-logo-dark.png"
              alt="CQ Signal"
              width={100}
              height={28}
              className="hidden h-4 w-auto align-middle dark:inline-block"
            />{" "}
            for{" "}
            <a
              href="https://creativequalitymarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Creative Quality Marketing
            </a>
          </span>
          <span className="font-mono text-xs">
            {new Date(snapshot.generatedAt).toISOString()}
          </span>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({
  source,
  sourceDescription,
  title,
  context,
}: {
  source: string;
  sourceDescription?: string;
  title: string;
  context?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {source}
          {sourceDescription ? (
            <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">
              · {sourceDescription}
            </span>
          ) : null}
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>
      {context ? (
        <p className="text-sm text-muted-foreground">{context}</p>
      ) : null}
    </div>
  );
}

function MetricRow({
  label,
  value,
  prior,
  deltaPct,
  positiveIsGood = true,
}: {
  label: string;
  value: string;
  prior?: string;
  deltaPct?: number | null;
  positiveIsGood?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-5 print:border-border">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mono-nums text-4xl leading-tight text-foreground md:text-5xl">
        {value}
      </p>
      {(prior || deltaPct !== undefined) && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {deltaPct !== undefined && deltaPct !== null ? (
            <Delta deltaPct={deltaPct} positiveIsGood={positiveIsGood} />
          ) : null}
          {prior ? <span>vs {prior}</span> : null}
        </div>
      )}
    </div>
  );
}

function GA4Section({ snapshot }: { snapshot: GA4Snapshot }) {
  const bouncePct = snapshot.bounceRate.current * 100;
  const priorBouncePct = snapshot.bounceRate.prior * 100;
  const bounceDeltaPts = bouncePct - priorBouncePct;

  return (
    <section className="mt-16 print:break-inside-avoid md:mt-20">
      <SectionHeader
        source="Google Analytics"
        sourceDescription="Website analytics (GA4)"
        title="Website"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricRow
          label="Sessions"
          value={formatNumber(snapshot.sessions.current)}
          prior={formatNumber(snapshot.sessions.prior)}
          deltaPct={snapshot.sessions.deltaPct}
        />
        <MetricRow
          label="Users"
          value={formatNumber(snapshot.users.current)}
          prior={formatNumber(snapshot.users.prior)}
          deltaPct={snapshot.users.deltaPct}
        />
        <MetricRow
          label="Avg. session"
          value={formatDuration(snapshot.avgSessionDurationSec.current)}
          prior={formatDuration(snapshot.avgSessionDurationSec.prior)}
          deltaPct={
            snapshot.avgSessionDurationSec.prior
              ? ((snapshot.avgSessionDurationSec.current -
                  snapshot.avgSessionDurationSec.prior) /
                  snapshot.avgSessionDurationSec.prior) *
                100
              : null
          }
        />
        <MetricRow
          label="Bounce rate"
          value={formatPercent(bouncePct)}
          prior={formatPercent(priorBouncePct)}
          deltaPct={priorBouncePct ? (bounceDeltaPts / priorBouncePct) * 100 : null}
          positiveIsGood={false}
        />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg">Top landing pages</h3>
          <ul className="mt-4 divide-y rounded-xl border bg-card">
            {snapshot.topLandingPages.slice(0, 5).map((page, i) => (
              <li
                key={`${page.path}-${i}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-mono text-foreground">
                    {page.path || "(none)"}
                  </span>
                </div>
                <span className="mono-nums shrink-0 text-muted-foreground">
                  {formatNumber(page.sessions)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg">Top traffic sources</h3>
          <ul className="mt-4 divide-y rounded-xl border bg-card">
            {snapshot.topSources.slice(0, 5).map((src, i) => {
              const total = snapshot.sessions.current || 1;
              const share = (src.sessions / total) * 100;
              return (
                <li
                  key={`${src.source}-${i}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-foreground">{src.source || "(direct)"}</span>
                  </div>
                  <span className="mono-nums shrink-0 text-muted-foreground">
                    {formatNumber(src.sessions)}{" "}
                    <span className="text-muted-foreground/70">
                      · {share.toFixed(0)}%
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TypeformSection({ snapshot }: { snapshot: TypeformSnapshot }) {
  const recent = snapshot.leads.slice(0, 10);
  return (
    <section className="mt-16 print:break-inside-avoid md:mt-20">
      <SectionHeader
        source="Typeform"
        sourceDescription="Form builder + responses"
        title="Leads"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <MetricRow
          label="New leads"
          value={formatNumber(snapshot.totalLeads.current)}
          prior={formatNumber(snapshot.totalLeads.prior)}
          deltaPct={snapshot.totalLeads.deltaPct}
        />
        <div className="flex flex-col justify-center rounded-xl border bg-card p-5 text-sm text-muted-foreground">
          <p className="font-display text-base text-foreground">
            {snapshot.totalLeads.delta > 0
              ? `${snapshot.totalLeads.delta} more lead${snapshot.totalLeads.delta === 1 ? "" : "s"} than last period.`
              : snapshot.totalLeads.delta < 0
                ? `${Math.abs(snapshot.totalLeads.delta)} fewer lead${Math.abs(snapshot.totalLeads.delta) === 1 ? "" : "s"} than last period.`
                : "Same lead volume as last period."}
          </p>
          <p className="mt-1">
            Form submissions captured via Typeform, pulled directly from the form's live
            response feed.
          </p>
        </div>
      </div>
      {recent.length > 0 ? (
        <div className="mt-10">
          <h3 className="font-display text-lg">Recent submissions</h3>
          <ul className="mt-4 divide-y rounded-xl border bg-card">
            {recent.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="mono-nums w-24 shrink-0 text-xs text-muted-foreground">
                  {new Date(lead.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {lead.name ?? "Lead"}
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {lead.email ?? "(no email)"}
                </span>
                {lead.phone ? (
                  <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                    {lead.phone}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function ManualSection({
  data,
}: {
  data: ReportSnapshot["manualChannels"][number];
}) {
  return (
    <section className="mt-16 print:break-inside-avoid md:mt-20">
      <SectionHeader
        source={data.source}
        sourceDescription={data.sourceDescription}
        title={data.primary.label}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricRow
          label={data.primary.label}
          value={data.primary.value}
          deltaPct={
            data.primary.delta ? parseFloat(data.primary.delta) : undefined
          }
        />
        {data.secondary.map((s) => (
          <MetricRow
            key={s.label}
            label={s.label}
            value={s.value}
            deltaPct={s.delta ? parseFloat(s.delta) : undefined}
          />
        ))}
      </div>
      {data.notes ? (
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {data.notes}
        </p>
      ) : null}
    </section>
  );
}

function PrintButton() {
  // Client-side print trigger. Kept small to avoid a separate file for v1.
  return (
    <form
      action={async () => {
        "use server";
        // noop server action; real print happens client-side below
      }}
    >
      <a
        href="javascript:window.print()"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Printer className="size-3.5" />
        Print or save as PDF
      </a>
    </form>
  );
}

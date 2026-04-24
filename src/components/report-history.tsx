import Link from "next/link";
import { ArrowUpRight, ClockIcon } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, reports, workspaces } from "@/lib/db/schema";

type Props = {
  slug: string;
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(d: Date): string {
  const ms = Date.now() - d.getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

export async function ReportHistory({ slug }: Props) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  if (!workspace) return null;

  const business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.workspaceId, workspace.id),
      eq(businesses.slug, slug),
    ),
  });
  if (!business) return null;

  const rows = await db
    .select({
      id: reports.id,
      shareToken: reports.shareToken,
      range: reports.range,
      periodStart: reports.periodStart,
      periodEnd: reports.periodEnd,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .where(eq(reports.businessId, business.id))
    .orderBy(desc(reports.createdAt))
    .limit(10);

  if (!rows.length) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <h2 className="font-display text-xl tracking-tight">Report history</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          No reports generated yet. Hit Create report above to capture the first one.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <h2 className="font-display text-xl tracking-tight">Report history</h2>
        </div>
        <p className="text-xs text-muted-foreground">Last {rows.length}</p>
      </div>
      <ul className="mt-4 divide-y divide-border/60">
        {rows.map((r) => {
          const created = new Date(r.createdAt as unknown as string);
          const periodEnd = new Date(r.periodEnd as unknown as string);
          return (
            <li key={r.id}>
              <Link
                href={`/reports/${r.shareToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md px-2 py-3 transition-colors hover:bg-muted/40"
              >
                <span className="mono-nums w-[88px] text-sm font-medium text-foreground">
                  {formatDate(created)}
                </span>
                <span className="rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand">
                  {r.range}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Period through {formatDate(periodEnd)}
                </span>
                <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  {formatRelative(created)}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-brand" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

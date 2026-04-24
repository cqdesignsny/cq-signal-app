import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, reports, workspaces } from "@/lib/db/schema";
import {
  businesses as seededBusinesses,
  type Business as SeededBusiness,
} from "@/lib/businesses";
import {
  fetchAllRanges,
  RANGES,
  type RangeData,
  type RangeKey,
} from "@/lib/reports/snapshot";
import type { GA4Snapshot } from "@/lib/integrations/ga4";
import type { TypeformSnapshot } from "@/lib/integrations/typeform";

export type ReportRangeKey = RangeKey;
export type ReportRangeData = RangeData;

export const REPORT_RANGES = RANGES.map((r) => ({
  key: r.key,
  label: r.label,
  days: r.days,
}));

export type ManualMetric = {
  label: string;
  value: string;
  delta?: string;
  note?: string;
};

export type ManualChannelData = {
  channel:
    | "meta-ads"
    | "facebook"
    | "instagram"
    | "linkedin"
    | "omnisend"
    | "klaviyo";
  source: string;
  sourceDescription?: string;
  primary: ManualMetric;
  secondary: ManualMetric[];
  notes?: string;
};

export type ReportSnapshot = {
  version: 2;
  business: {
    slug: string;
    name: string;
    shortName?: string | null;
    tagline?: string | null;
    vertical?: string | null;
    logoUrl?: string | null;
    brandColor?: string | null;
  };
  primaryRange: ReportRangeKey;
  ranges: Record<ReportRangeKey, ReportRangeData>;
  narrative?: string;
  manualChannels: ManualChannelData[];
  generatedAt: string;
};

export type GenerateReportInput = {
  businessSlug: string;
  primaryRange?: ReportRangeKey;
  referenceDate?: Date;
  narrative?: string;
  manualChannels?: ManualChannelData[];
  businessProfile?: {
    logoUrl?: string;
    brandColor?: string;
    tagline?: string;
    vertical?: string;
  };
};

export type GenerateReportResult = {
  reportId: string;
  shareToken: string;
  shareUrl: string;
  snapshot: ReportSnapshot;
};

function findSeed(slug: string): SeededBusiness {
  const seed = seededBusinesses.find((b) => b.slug === slug);
  if (!seed) throw new Error(`No seed data for business slug: ${slug}`);
  return seed;
}

async function ensureWorkspaceAndBusiness(slug: string) {
  let workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  if (!workspace) {
    const [created] = await db
      .insert(workspaces)
      .values({ slug: "cq", name: "Creative Quality Marketing" })
      .returning();
    workspace = created;
  }

  let business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.workspaceId, workspace.id),
      eq(businesses.slug, slug),
    ),
  });

  if (!business) {
    const seed = findSeed(slug);
    const [created] = await db
      .insert(businesses)
      .values({
        workspaceId: workspace.id,
        slug: seed.slug,
        name: seed.name,
        shortName: seed.shortName,
        tagline: seed.tagline,
        vertical: seed.vertical,
      })
      .returning();
    business = created;
  }

  return { workspace, business };
}

function generateShareToken(): string {
  return randomBytes(16).toString("hex");
}

export async function generateReport(
  input: GenerateReportInput,
): Promise<GenerateReportResult> {
  const { business: initialBusiness } = await ensureWorkspaceAndBusiness(
    input.businessSlug,
  );

  let business = initialBusiness;
  if (input.businessProfile) {
    const patch: Record<string, string> = {};
    if (input.businessProfile.logoUrl !== undefined)
      patch.logoUrl = input.businessProfile.logoUrl;
    if (input.businessProfile.brandColor !== undefined)
      patch.brandColor = input.businessProfile.brandColor;
    if (input.businessProfile.tagline !== undefined)
      patch.tagline = input.businessProfile.tagline;
    if (input.businessProfile.vertical !== undefined)
      patch.vertical = input.businessProfile.vertical;
    if (Object.keys(patch).length > 0) {
      const [updated] = await db
        .update(businesses)
        .set(patch)
        .where(eq(businesses.id, initialBusiness.id))
        .returning();
      business = updated;
    }
  }

  const referenceDate = input.referenceDate ?? new Date();
  const primaryRange: ReportRangeKey = input.primaryRange ?? "30d";
  const ranges = await fetchAllRanges(input.businessSlug, referenceDate);

  const snapshot: ReportSnapshot = {
    version: 2,
    business: {
      slug: business.slug,
      name: business.name,
      shortName: business.shortName,
      tagline: business.tagline,
      vertical: business.vertical,
      logoUrl: business.logoUrl,
      brandColor: business.brandColor,
    },
    primaryRange,
    ranges,
    narrative: input.narrative,
    manualChannels: input.manualChannels ?? [],
    generatedAt: referenceDate.toISOString(),
  };

  const shareToken = generateShareToken();
  const primary = ranges[primaryRange];

  const [inserted] = await db
    .insert(reports)
    .values({
      businessId: business.id,
      title: `${business.name} marketing report`,
      range: primaryRange,
      periodStart: new Date(primary.range.startDate),
      periodEnd: new Date(primary.range.endDate),
      snapshot,
      shareToken,
    })
    .returning();

  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://cq-signal-app.vercel.app";
  const shareUrl = `${base}/reports/${shareToken}`;

  return {
    reportId: inserted.id,
    shareToken,
    shareUrl,
    snapshot,
  };
}

export async function getReportByShareToken(
  shareToken: string,
): Promise<ReportSnapshot | null> {
  const record = await db.query.reports.findFirst({
    where: eq(reports.shareToken, shareToken),
  });
  if (!record) return null;
  return record.snapshot as ReportSnapshot;
}

export type { GA4Snapshot, TypeformSnapshot };

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, reports, workspaces } from "@/lib/db/schema";
import {
  businesses as seededBusinesses,
  type Business as SeededBusiness,
} from "@/lib/businesses";
import { fetchGA4Snapshot, type GA4Snapshot } from "@/lib/integrations/ga4";
import {
  fetchTypeformSnapshot,
  type TypeformSnapshot,
} from "@/lib/integrations/typeform";

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
  version: 1;
  business: {
    slug: string;
    name: string;
    shortName?: string | null;
    tagline?: string | null;
    vertical?: string | null;
    logoUrl?: string | null;
    brandColor?: string | null;
  };
  dateRange: {
    label: string;
    startDate: string;
    endDate: string;
  };
  priorRange: {
    startDate: string;
    endDate: string;
  };
  narrative?: string;
  ga4?: GA4Snapshot;
  typeform?: TypeformSnapshot;
  manualChannels: ManualChannelData[];
  generatedAt: string;
};

export type GenerateReportInput = {
  businessSlug: string;
  startDate: string;
  endDate: string;
  rangeLabel?: string;
  narrative?: string;
  manualChannels?: ManualChannelData[];
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

async function fetchLiveIntegrationData(
  businessSlug: string,
  startDate: string,
  endDate: string,
): Promise<{ ga4?: GA4Snapshot; typeform?: TypeformSnapshot }> {
  const data: { ga4?: GA4Snapshot; typeform?: TypeformSnapshot } = {};

  if (businessSlug === "hudson-valley-office-furniture") {
    const ga4PropertyId = process.env.HVOF_GA4_PROPERTY_ID;
    const typeformFormId = process.env.HVOF_TYPEFORM_FORM_ID;

    const tasks: Array<Promise<void>> = [];
    if (ga4PropertyId) {
      tasks.push(
        fetchGA4Snapshot(ga4PropertyId, startDate, endDate)
          .then((snap) => {
            data.ga4 = snap;
          })
          .catch((err) => {
            console.error("[generate] GA4 fetch failed", err);
          }),
      );
    }
    if (typeformFormId) {
      tasks.push(
        fetchTypeformSnapshot(typeformFormId, startDate, endDate)
          .then((snap) => {
            data.typeform = snap;
          })
          .catch((err) => {
            console.error("[generate] Typeform fetch failed", err);
          }),
      );
    }
    await Promise.all(tasks);
  }

  return data;
}

function generateShareToken(): string {
  return randomBytes(16).toString("hex");
}

export async function generateReport(
  input: GenerateReportInput,
): Promise<GenerateReportResult> {
  const { business } = await ensureWorkspaceAndBusiness(input.businessSlug);

  const live = await fetchLiveIntegrationData(
    input.businessSlug,
    input.startDate,
    input.endDate,
  );

  const snapshot: ReportSnapshot = {
    version: 1,
    business: {
      slug: business.slug,
      name: business.name,
      shortName: business.shortName,
      tagline: business.tagline,
      vertical: business.vertical,
      logoUrl: business.logoUrl,
      brandColor: business.brandColor,
    },
    dateRange: {
      label: input.rangeLabel ?? "Last 7 days",
      startDate: input.startDate,
      endDate: input.endDate,
    },
    priorRange: live.ga4?.priorRange ??
      live.typeform?.priorRange ?? {
        startDate: input.startDate,
        endDate: input.endDate,
      },
    narrative: input.narrative,
    ga4: live.ga4,
    typeform: live.typeform,
    manualChannels: input.manualChannels ?? [],
    generatedAt: new Date().toISOString(),
  };

  const shareToken = generateShareToken();
  const periodStart = new Date(input.startDate);
  const periodEnd = new Date(input.endDate);

  const [inserted] = await db
    .insert(reports)
    .values({
      businessId: business.id,
      title: `${business.name} — Marketing report`,
      range: "7d",
      periodStart,
      periodEnd,
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

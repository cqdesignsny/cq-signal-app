// Per-business manual channel data, used to populate dashboard cards before
// the corresponding API integration is wired. Each entry overrides the generic
// `channelCards[integration]` placeholder for that business.
//
// Lookup order: DB (`manual_channel_data` table) → seed map below → undefined.
//
// As real integrations come online, delete the matching seed entry here and
// rely on the live snapshot helpers.

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, manualChannelData, workspaces } from "@/lib/db/schema";
import type { Integration } from "@/lib/businesses";

export type ManualCardData = {
  primary: { label: string; value: string; note?: string };
  secondary: Array<{ label: string; value: string; delta?: string }>;
  notes?: string;
};

const HVOF_MANUAL: Partial<Record<Integration, ManualCardData>> = {
  "google-ads": {
    primary: { label: "Ad spend (period)", value: "$1,047" },
    secondary: [
      { label: "Clicks", value: "312" },
      { label: "Conversions", value: "8" },
    ],
    notes:
      "Most recent month of record. Live API integration coming. ~17% of HVOF traffic comes from Paid Search; the 'office furniture near me' query mix has high impressions and room to convert better.",
  },
  "meta-ads": {
    primary: {
      label: "Ad spend (period)",
      value: "$0",
      note: "Not running paid Meta ads",
    },
    secondary: [
      { label: "Leads from ads", value: "0" },
      { label: "Cost per lead", value: "—" },
    ],
    notes:
      "HVOF paused paid Meta ads through April. All leads this month came from organic channels (website form plus direct and organic search traffic).",
  },
  facebook: {
    primary: { label: "Page followers", value: "462" },
    secondary: [
      { label: "Page reviews", value: "2" },
      { label: "Recent post", value: "Office Chair Buying Guide" },
    ],
    notes:
      "Latest post is a multi-page Office Chair Buying Guide carousel. Full post-level reach, engagement rates, and audience demographics land once the Meta Business Page API is connected.",
  },
  instagram: {
    primary: { label: "Followers", value: "299" },
    secondary: [
      { label: "Posts (lifetime)", value: "133" },
      { label: "Following", value: "17" },
      { label: "Handle", value: "@hv_office_furniture" },
    ],
    notes:
      "Recent post engagement is in single digits. Deeper post reach, story completion, and audience demographics land once the Instagram Business API is connected.",
  },
  linkedin: {
    primary: { label: "Page followers", value: "51" },
    secondary: [
      { label: "Post impressions (7d)", value: "6", delta: "-40" },
      { label: "Page visitors (7d)", value: "4", delta: "300" },
      { label: "Search appearances (7d)", value: "12", delta: "200" },
    ],
    notes:
      "No new posts published during April. Page is still accruing small organic visibility (rolling 7-day window) without active posting. The single biggest lever on LinkedIn is resuming a posting cadence.",
  },
  omnisend: {
    primary: {
      label: "Avg open rate",
      value: "12.3%",
      note: "Weighted across 2 campaigns · 9,102 sends",
    },
    secondary: [
      { label: "Avg click-through", value: "3.0%" },
      { label: "Emails sent", value: "9,102" },
      { label: "Campaigns", value: "2" },
    ],
    notes:
      "Two campaigns sent in April. April Email 2 (Apr 14, 5,092 sent) landed at 18% open and 5.1% CTR. The Booster resend (Apr 16, 4,010 sent) collapsed to 4.8% open and 0.14% CTR. Worth understanding what made the first send work so the pattern is repeatable.",
  },
};

const SEED_REGISTRY: Record<
  string,
  Partial<Record<Integration, ManualCardData>>
> = {
  "hudson-valley-office-furniture": HVOF_MANUAL,
};

async function loadDbOverlay(
  businessSlug: string,
): Promise<Partial<Record<Integration, ManualCardData>>> {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  if (!workspace) return {};
  const business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.workspaceId, workspace.id),
      eq(businesses.slug, businessSlug),
    ),
  });
  if (!business) return {};

  const rows = await db
    .select({
      integration: manualChannelData.integration,
      data: manualChannelData.data,
    })
    .from(manualChannelData)
    .where(eq(manualChannelData.businessId, business.id));

  const out: Partial<Record<Integration, ManualCardData>> = {};
  for (const row of rows) {
    out[row.integration as Integration] = row.data as ManualCardData;
  }
  return out;
}

export async function getManualCard(
  businessSlug: string,
  integration: Integration,
): Promise<ManualCardData | undefined> {
  const dbOverlay = await loadDbOverlay(businessSlug);
  if (dbOverlay[integration]) return dbOverlay[integration];
  return SEED_REGISTRY[businessSlug]?.[integration];
}

export async function getManualOverlay(
  businessSlug: string,
): Promise<Partial<Record<Integration, ManualCardData>>> {
  const seed = SEED_REGISTRY[businessSlug] ?? {};
  const dbOverlay = await loadDbOverlay(businessSlug);
  return { ...seed, ...dbOverlay };
}

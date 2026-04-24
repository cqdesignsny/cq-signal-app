// Per-business manual channel data, used to populate dashboard cards before
// the corresponding API integration is wired. Each entry overrides the generic
// `channelCards[integration]` placeholder for that business.
//
// As real integrations come online, delete the matching entry here and let the
// live snapshot helpers do the work.

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

const REGISTRY: Record<string, Partial<Record<Integration, ManualCardData>>> = {
  "hudson-valley-office-furniture": HVOF_MANUAL,
};

export function getManualCard(
  businessSlug: string,
  integration: Integration,
): ManualCardData | undefined {
  return REGISTRY[businessSlug]?.[integration];
}

export function getManualOverlay(
  businessSlug: string,
): Partial<Record<Integration, ManualCardData>> {
  return REGISTRY[businessSlug] ?? {};
}

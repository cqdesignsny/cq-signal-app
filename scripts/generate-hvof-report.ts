import { generateReport, type ManualChannelData } from "../src/lib/reports/generate";

const manualChannels: ManualChannelData[] = [
  {
    channel: "meta-ads",
    source: "Meta Ads",
    sourceDescription: "Facebook + Instagram paid ads",
    primary: {
      label: "Ad spend this period",
      value: "$0",
      note: "Not running paid ads",
    },
    secondary: [
      { label: "Leads from ads", value: "0" },
      { label: "Cost per lead", value: "—" },
    ],
    notes:
      "HVOF paused paid ads throughout April. All leads this month came from organic channels (website form plus direct and organic search traffic).",
  },
  {
    channel: "facebook",
    source: "Facebook",
    sourceDescription: "Organic Page posts",
    primary: { label: "Page followers", value: "462" },
    secondary: [
      { label: "Page reviews", value: "2" },
      { label: "Recent post", value: "Office Chair Buying Guide" },
    ],
    notes:
      "Latest post is a multi-page Office Chair Buying Guide carousel. Full post-level reach, engagement rates, and audience demographics land once the Meta Business Page API is connected.",
  },
  {
    channel: "instagram",
    source: "Instagram",
    sourceDescription: "Organic posts + reels",
    primary: { label: "Followers", value: "299" },
    secondary: [
      { label: "Posts (lifetime)", value: "133" },
      { label: "Following", value: "17" },
      { label: "Handle", value: "@hv_office_furniture" },
    ],
    notes:
      "Recent post engagement is in single digits. Deeper post reach, story completion, and audience demographics land once the Instagram Business API is connected.",
  },
  {
    channel: "linkedin",
    source: "LinkedIn",
    sourceDescription: "Organic company page",
    primary: { label: "Page followers", value: "51" },
    secondary: [
      { label: "Post impressions (last 7d)", value: "6", delta: "-40" },
      { label: "Page visitors (last 7d)", value: "4", delta: "300" },
      { label: "Search appearances (last 7d)", value: "12", delta: "200" },
      { label: "New followers (last 7d)", value: "0" },
    ],
    notes:
      "No new posts published during April. Most recent content is about two months old. The page is still accruing small amounts of organic visibility without active posting (+300% page visitors, +200% search appearances from a small base, rolling 7-day window). The single biggest lever on LinkedIn is resuming a posting cadence.",
  },
  {
    channel: "omnisend",
    source: "Omnisend",
    sourceDescription: "Email marketing",
    primary: {
      label: "Avg open rate",
      value: "12.3%",
      note: "Weighted across 2 campaigns · 9,102 total sends",
    },
    secondary: [
      { label: "Avg click-through", value: "3.0%" },
      { label: "Emails sent", value: "9,102" },
      { label: "Campaigns", value: "2" },
    ],
    notes:
      "Two campaigns sent in April. April Email 2 (Apr 14, 5,092 sent) landed at 18% open and 5.1% CTR, a genuinely strong performance. The Booster resend one day later (Apr 16, 4,010 sent) collapsed to 4.8% open and 0.14% CTR. Worth understanding what made the first send work so the pattern is repeatable, and probably worth rethinking how and when boosters are sent.",
  },
];

const narrative =
  "April month-to-date for Hudson Valley Office Furniture. Traffic is flowing, leads are coming through the website, one email campaign delivered strongly and its follow-up did not. Paid ads are off. LinkedIn has been quiet through the month. Most interesting signal: ChatGPT.com now shows up as a traffic source on the site, an early sign HVOF is being surfaced by AI tools. Three moves that'd matter going into May: study what made April Email 2 open at 18% so the next send mirrors that pattern, resume the LinkedIn posting cadence (the page is still accruing small amounts of organic visibility even without new posts), and look at what's keeping visitors on the site longer even when total traffic dips.";

async function main() {
  console.log("Generating HVOF April month-to-date report...");
  console.log("  Live fetch: GA4 + Typeform (Apr 1 to Apr 24)");
  console.log("  Manual: Meta Ads, Facebook, Instagram, LinkedIn, Omnisend");
  console.log("");

  const result = await generateReport({
    businessSlug: "hudson-valley-office-furniture",
    primaryRange: "30d",
    narrative,
    manualChannels,
    businessProfile: {
      logoUrl: "/HVOF-2025-logo.svg",
      brandColor: "#F4B400",
    },
  });

  console.log("✓ Report generated");
  console.log("");
  console.log(`  Report ID:    ${result.reportId}`);
  console.log(`  Share Token:  ${result.shareToken}`);
  console.log(`  Share URL:    ${result.shareUrl}`);
  console.log(`  Local URL:    http://localhost:3000/reports/${result.shareToken}`);
  console.log("");
  console.log("Quick peek at live data pulled:");
  console.log(
    `  GA4 sessions:      ${result.snapshot.ga4?.sessions.current ?? "—"} (vs ${result.snapshot.ga4?.sessions.prior ?? "—"} prior)`,
  );
  console.log(
    `  GA4 top source:    ${result.snapshot.ga4?.topSources[0]?.source ?? "—"} (${result.snapshot.ga4?.topSources[0]?.sessions ?? "—"} sessions)`,
  );
  console.log(
    `  Typeform leads:    ${result.snapshot.typeform?.totalLeads.current ?? "—"} (vs ${result.snapshot.typeform?.totalLeads.prior ?? "—"} prior)`,
  );
  console.log("");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

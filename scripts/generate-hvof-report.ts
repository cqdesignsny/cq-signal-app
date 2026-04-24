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
      "HVOF paused paid ads during this period. All leads this week came from organic channels (website form, plus direct and organic search traffic).",
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
      { label: "Post impressions", value: "6", delta: "-40" },
      { label: "Page visitors", value: "4", delta: "300" },
      { label: "Search appearances", value: "12", delta: "200" },
      { label: "New followers", value: "0" },
    ],
    notes:
      "No new posts this period. Most recent content is about two months old. The page is still accruing small amounts of organic visibility without active posting (+300% page visitors, +200% search appearances from a small base). Biggest single lever on LinkedIn right now: resume a posting cadence.",
  },
  {
    channel: "omnisend",
    source: "Omnisend",
    sourceDescription: "Email marketing",
    primary: {
      label: "Campaigns sent this period",
      value: "0",
      note: "No sends during Apr 17 to 24",
    },
    secondary: [
      {
        label: "Last send open rate",
        value: "4.8%",
        note: "Booster · Apr 16 · 4,010 sent",
      },
      {
        label: "Prior send open rate",
        value: "18%",
        note: "April Email 2 · Apr 14 · 5,092 sent · 5.1% CTR",
      },
      { label: "Total reach of last 2 sends", value: "9,102" },
    ],
    notes:
      "No campaigns sent during the report window. The two most recent sends (April 14 and April 16) show a big gap: April Email 2 hit 18% open and 5.1% CTR, but its booster one day later only hit 4.8% open and 0.14% CTR. Worth understanding what made April Email 2 work before the next send.",
  },
];

const narrative =
  "HVOF's week tells a story of deeper engagement on less traffic. Website sessions dipped 12% from the prior week, but visitors who came stayed 26% longer and bounced less. Typeform leads doubled from one to two. Paid ads, email, and LinkedIn posting all sat idle this week. The most interesting signal: a ChatGPT.com referral appeared in the traffic mix for the first time, an early sign the site is being surfaced by AI tools. Three moves worth making next week: resume LinkedIn posting (small but climbing page-visitor and search-appearance numbers suggest the audience is still there), study what made April Email 2 open at 18% so the next send matches or beats it, and double down on whatever content held those longer sessions and lower bounce.";

async function main() {
  console.log("Generating HVOF report...");
  console.log("  Live fetch: GA4 + Typeform");
  console.log("  Manual: Meta Ads, Facebook, Instagram, LinkedIn, Omnisend");
  console.log("");

  const result = await generateReport({
    businessSlug: "hudson-valley-office-furniture",
    startDate: "2026-04-17",
    endDate: "2026-04-24",
    rangeLabel: "April 17 to April 24, 2026",
    narrative,
    manualChannels,
  });

  console.log("✓ Report generated");
  console.log("");
  console.log(`  Report ID:    ${result.reportId}`);
  console.log(`  Share Token:  ${result.shareToken}`);
  console.log(`  Share URL:    ${result.shareUrl}`);
  console.log(`  Local URL:    http://localhost:3000/reports/${result.shareToken}`);
  console.log("");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

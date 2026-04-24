import { generateRecommendations } from "../src/lib/reports/recommendations";
import { fetchRangeData } from "../src/lib/reports/snapshot";

async function main() {
  console.log("Fetching HVOF 30d data...");
  const range = await fetchRangeData("hudson-valley-office-furniture", "30d");

  console.log(
    `Got GA4: ${range.ga4 ? "yes" : "no"}, Typeform: ${range.typeform ? "yes" : "no"}`,
  );
  if (range.ga4) {
    console.log(
      `  Sessions: ${range.ga4.sessions.current} (${range.ga4.sessions.deltaPct.toFixed(1)}% vs prior)`,
    );
  }

  console.log("\nCalling Claude for recommendations...");
  const recs = await generateRecommendations({
    businessName: "Hudson Valley Office Furniture",
    vertical: "Commercial B2B",
    tagline: "Commercial office furniture, Hudson Valley NY",
    rangeLabel: "30 days",
    activeRange: range,
    manualNotes:
      "Meta Ads: not running in April. Omnisend: April Email 2 (Apr 14, 5,092 sent) landed at 18% open 5.1% CTR; Booster resend Apr 16 4,010 sent collapsed to 4.8% open 0.14% CTR. LinkedIn: 51 followers, no new posts during April.",
  });

  console.log(`\nGot ${recs.length} recommendations:\n`);
  recs.forEach((rec, i) => {
    console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
    console.log(`   ${rec.rationale}`);
    console.log(`   Expect: ${rec.expected}`);
    console.log("");
  });
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

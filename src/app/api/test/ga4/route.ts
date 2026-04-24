import { NextResponse } from "next/server";
import { fetchGA4Snapshot } from "@/lib/integrations/ga4";

// Temporary test endpoint. Remove once GA4 integration is plumbed into the
// proper integration framework and report generator.
export const maxDuration = 60;

function toIso(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(req: Request) {
  const startedAt = Date.now();
  const url = new URL(req.url);
  const property = url.searchParams.get("property") ?? process.env.HVOF_GA4_PROPERTY_ID;
  if (!property) {
    console.warn("[ga4-test] missing property id");
    return NextResponse.json(
      { error: "Missing property id. Pass ?property= or set HVOF_GA4_PROPERTY_ID." },
      { status: 400 },
    );
  }

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  console.log(
    `[ga4-test] GET property=${property} range=${toIso(startDate)}..${toIso(endDate)}`,
  );

  try {
    const snapshot = await fetchGA4Snapshot(
      property,
      toIso(startDate),
      toIso(endDate),
    );
    console.log(
      `[ga4-test] OK property=${property} sessions=${snapshot.sessions.current} ms=${Date.now() - startedAt}`,
    );
    return NextResponse.json({ ok: true, snapshot });
  } catch (err) {
    console.error(
      `[ga4-test] ERROR property=${property} ms=${Date.now() - startedAt}`,
      err,
    );
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

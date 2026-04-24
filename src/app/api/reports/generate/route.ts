import { NextResponse } from "next/server";
import { generateReport } from "@/lib/reports/generate";

export const maxDuration = 60;

type Body = {
  businessSlug: string;
  startDate: string;
  endDate: string;
  rangeLabel?: string;
  narrative?: string;
  manualChannels?: Array<{
    channel:
      | "meta-ads"
      | "facebook"
      | "instagram"
      | "linkedin"
      | "omnisend"
      | "klaviyo";
    source: string;
    sourceDescription?: string;
    primary: { label: string; value: string; delta?: string; note?: string };
    secondary: Array<{
      label: string;
      value: string;
      delta?: string;
      note?: string;
    }>;
    notes?: string;
  }>;
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  const body = (await req.json()) as Body;

  if (!body.businessSlug || !body.startDate || !body.endDate) {
    return NextResponse.json(
      { error: "businessSlug, startDate, endDate required" },
      { status: 400 },
    );
  }

  console.log(
    `[reports.generate] business=${body.businessSlug} range=${body.startDate}..${body.endDate}`,
  );

  try {
    const result = await generateReport(body);
    console.log(
      `[reports.generate] OK reportId=${result.reportId} token=${result.shareToken} ms=${Date.now() - startedAt}`,
    );
    return NextResponse.json({
      ok: true,
      reportId: result.reportId,
      shareToken: result.shareToken,
      shareUrl: result.shareUrl,
    });
  } catch (err) {
    console.error(
      `[reports.generate] ERROR business=${body.businessSlug} ms=${Date.now() - startedAt}`,
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

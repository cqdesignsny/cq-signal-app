import { NextResponse } from "next/server";
import { getBusiness } from "@/lib/businesses";
import { generateBrief, type ExportRange } from "@/lib/md-export";

type Props = { params: Promise<{ slug: string }> };

const VALID_RANGES: ExportRange[] = ["7d", "1m", "3m", "1y"];

export async function GET(req: Request, { params }: Props) {
  const startedAt = Date.now();
  const { slug } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "md";
  const rangeParam = url.searchParams.get("range") ?? "7d";
  const download = url.searchParams.get("download") === "1";

  const range: ExportRange = VALID_RANGES.includes(rangeParam as ExportRange)
    ? (rangeParam as ExportRange)
    : "7d";

  console.log(
    `[export] GET business=${slug} format=${format} range=${range} download=${download}`,
  );

  const business = getBusiness(slug);
  if (!business) {
    console.warn(`[export] 404 business=${slug} ms=${Date.now() - startedAt}`);
    return new NextResponse("Business not found", { status: 404 });
  }

  if (format === "json") {
    return NextResponse.json({
      business,
      range,
      note: "JSON export preview. Real metrics arrive once the data layer is wired. Schema is stable.",
    });
  }

  const md = generateBrief(business, { range });
  const filename = `${business.slug}-signal-brief-${new Date().toISOString().split("T")[0]}.md`;

  const headers: Record<string, string> = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "no-store",
  };
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }

  return new NextResponse(md, { headers });
}

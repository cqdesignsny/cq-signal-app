import { NextResponse } from "next/server";
import { fetchTypeformSnapshot } from "@/lib/integrations/typeform";

export const maxDuration = 60;

function toIso(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(req: Request) {
  const startedAt = Date.now();
  const url = new URL(req.url);
  const formId =
    url.searchParams.get("form") ?? process.env.HVOF_TYPEFORM_FORM_ID;
  if (!formId) {
    return NextResponse.json(
      { error: "Missing form id. Pass ?form= or set HVOF_TYPEFORM_FORM_ID." },
      { status: 400 },
    );
  }

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  console.log(
    `[typeform-test] GET form=${formId} range=${toIso(startDate)}..${toIso(endDate)}`,
  );

  try {
    const snapshot = await fetchTypeformSnapshot(
      formId,
      toIso(startDate),
      toIso(endDate),
    );
    console.log(
      `[typeform-test] OK form=${formId} current=${snapshot.totalLeads.current} ms=${Date.now() - startedAt}`,
    );
    return NextResponse.json({ ok: true, snapshot });
  } catch (err) {
    console.error(
      `[typeform-test] ERROR form=${formId} ms=${Date.now() - startedAt}`,
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

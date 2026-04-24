"use server";

import { auth } from "@clerk/nextjs/server";
import { generateReport } from "@/lib/reports/generate";
import { getBusiness } from "@/lib/businesses";
import { getManualOverlay } from "@/lib/manual-data";
import type { ManualChannelData } from "@/lib/reports/generate";

const NARRATIVE_FALLBACK =
  "Live data captured at the moment this report was generated. The numbers below reflect what was happening that day. Range toggle on the report page lets the recipient see the same business across 7-day, 30-day, 90-day, and 1-year windows.";

async function manualChannelsFor(slug: string): Promise<ManualChannelData[]> {
  const overlay = await getManualOverlay(slug);
  const out: ManualChannelData[] = [];

  type Allowed = ManualChannelData["channel"];
  const allowed: Allowed[] = [
    "meta-ads",
    "facebook",
    "instagram",
    "linkedin",
    "omnisend",
    "klaviyo",
  ];

  const sourceLabels: Record<Allowed, { source: string; description: string }> = {
    "meta-ads": { source: "Meta Ads", description: "Facebook + Instagram paid ads" },
    facebook: { source: "Facebook", description: "Organic Page posts" },
    instagram: { source: "Instagram", description: "Organic posts + reels" },
    linkedin: { source: "LinkedIn", description: "Organic company page" },
    omnisend: { source: "Omnisend", description: "Email marketing" },
    klaviyo: { source: "Klaviyo", description: "Email marketing" },
  };

  for (const key of allowed) {
    const data = overlay[key];
    if (!data) continue;
    out.push({
      channel: key,
      source: sourceLabels[key].source,
      sourceDescription: sourceLabels[key].description,
      primary: data.primary,
      secondary: data.secondary,
      notes: data.notes,
    });
  }

  return out;
}

export type CreateReportResult = { shareToken: string; shareUrl: string };

export async function createReportForBusiness(
  formData: FormData,
): Promise<CreateReportResult> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authorized");

  const slug = String(formData.get("slug") ?? "");
  if (!slug) throw new Error("Missing business slug");

  const business = getBusiness(slug);
  if (!business) throw new Error(`Unknown business: ${slug}`);

  const result = await generateReport({
    businessSlug: slug,
    primaryRange: "30d",
    narrative: NARRATIVE_FALLBACK,
    manualChannels: await manualChannelsFor(slug),
    businessProfile:
      slug === "hudson-valley-office-furniture"
        ? { logoUrl: "/HVOF-2025-logo.svg", brandColor: "#F4B400" }
        : undefined,
  });

  return { shareToken: result.shareToken, shareUrl: result.shareUrl };
}

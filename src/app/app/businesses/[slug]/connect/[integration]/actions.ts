"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  businesses,
  manualChannelData,
  workspaces,
} from "@/lib/db/schema";
import {
  businesses as seededBusinesses,
  type Business as SeededBusiness,
  type Integration,
} from "@/lib/businesses";
import type { ManualCardData } from "@/lib/manual-data";

function findSeed(slug: string): SeededBusiness {
  const seed = seededBusinesses.find((b) => b.slug === slug);
  if (!seed) throw new Error(`No seed data for business slug: ${slug}`);
  return seed;
}

async function ensureWorkspaceAndBusiness(slug: string) {
  let workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  if (!workspace) {
    const [created] = await db
      .insert(workspaces)
      .values({ slug: "cq", name: "Creative Quality Marketing" })
      .returning();
    workspace = created;
  }

  let business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.workspaceId, workspace.id),
      eq(businesses.slug, slug),
    ),
  });

  if (!business) {
    const seed = findSeed(slug);
    const [created] = await db
      .insert(businesses)
      .values({
        workspaceId: workspace.id,
        slug: seed.slug,
        name: seed.name,
        shortName: seed.shortName,
        tagline: seed.tagline,
        vertical: seed.vertical,
      })
      .returning();
    business = created;
  }

  return { workspace, business };
}

export type ManualFormState = {
  ok: boolean;
  message?: string;
};

const MAX_SECONDARY = 4;

export async function saveManualChannelData(
  _prevState: ManualFormState,
  formData: FormData,
): Promise<ManualFormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const slug = String(formData.get("slug") ?? "");
  const integration = String(formData.get("integration") ?? "") as Integration;
  if (!slug || !integration) {
    return { ok: false, message: "Missing slug or integration" };
  }

  const primaryLabel = String(formData.get("primaryLabel") ?? "").trim();
  const primaryValue = String(formData.get("primaryValue") ?? "").trim();
  const primaryNote = String(formData.get("primaryNote") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!primaryLabel || !primaryValue) {
    return {
      ok: false,
      message: "Primary label and value are required.",
    };
  }

  const secondary: ManualCardData["secondary"] = [];
  for (let i = 0; i < MAX_SECONDARY; i++) {
    const label = String(formData.get(`secondaryLabel${i}`) ?? "").trim();
    const value = String(formData.get(`secondaryValue${i}`) ?? "").trim();
    if (label && value) secondary.push({ label, value });
  }

  const data: ManualCardData = {
    primary: {
      label: primaryLabel,
      value: primaryValue,
      ...(primaryNote ? { note: primaryNote } : {}),
    },
    secondary,
    ...(notes ? { notes } : {}),
  };

  const { business } = await ensureWorkspaceAndBusiness(slug);

  const existing = await db.query.manualChannelData.findFirst({
    where: and(
      eq(manualChannelData.businessId, business.id),
      eq(manualChannelData.integration, integration),
    ),
  });

  if (existing) {
    await db
      .update(manualChannelData)
      .set({ data, updatedAt: new Date() })
      .where(eq(manualChannelData.id, existing.id));
  } else {
    await db.insert(manualChannelData).values({
      businessId: business.id,
      integration,
      data,
    });
  }

  revalidatePath(`/app/businesses/${slug}`);
  revalidatePath(`/app/businesses/${slug}/${integration}`);
  revalidatePath(`/app/businesses/${slug}/connect/${integration}`);

  return { ok: true, message: "Manual data saved." };
}

export async function clearManualChannelData(
  _prevState: ManualFormState,
  formData: FormData,
): Promise<ManualFormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const slug = String(formData.get("slug") ?? "");
  const integration = String(formData.get("integration") ?? "") as Integration;
  if (!slug || !integration) {
    return { ok: false, message: "Missing slug or integration" };
  }

  const { business } = await ensureWorkspaceAndBusiness(slug);

  await db
    .delete(manualChannelData)
    .where(
      and(
        eq(manualChannelData.businessId, business.id),
        eq(manualChannelData.integration, integration),
      ),
    );

  revalidatePath(`/app/businesses/${slug}`);
  revalidatePath(`/app/businesses/${slug}/${integration}`);
  revalidatePath(`/app/businesses/${slug}/connect/${integration}`);

  return { ok: true, message: "Manual data cleared." };
}

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, workspaces } from "@/lib/db/schema";
import {
  businesses as seededBusinesses,
  type Business as SeededBusiness,
} from "@/lib/businesses";

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

export type ProfileFormState = {
  ok: boolean;
  message?: string;
};

export async function saveBusinessProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, message: "Missing business slug" };

  const name = String(formData.get("name") ?? "").trim();
  const shortName = String(formData.get("shortName") ?? "").trim() || null;
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const vertical = String(formData.get("vertical") ?? "").trim() || null;
  const brandColor = String(formData.get("brandColor") ?? "").trim() || null;
  const logoUrl = String(formData.get("logoUrl") ?? "").trim() || null;

  if (!name) return { ok: false, message: "Business name is required" };

  const { business } = await ensureWorkspaceAndBusiness(slug);

  await db
    .update(businesses)
    .set({
      name,
      shortName,
      tagline,
      vertical,
      brandColor,
      logoUrl,
    })
    .where(eq(businesses.id, business.id));

  revalidatePath(`/app/businesses/${slug}`);
  revalidatePath(`/app/businesses/${slug}/profile`);

  return { ok: true, message: "Profile saved." };
}

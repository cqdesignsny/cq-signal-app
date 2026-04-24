"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { businesses, reports, workspaces } from "@/lib/db/schema";

/** Look up the most recently generated report's share token for this business. */
export async function latestShareTokenForBusiness(
  slug: string,
): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authorized");

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  if (!workspace) return null;

  const business = await db.query.businesses.findFirst({
    where: and(
      eq(businesses.workspaceId, workspace.id),
      eq(businesses.slug, slug),
    ),
  });
  if (!business) return null;

  const [latest] = await db
    .select({ shareToken: reports.shareToken })
    .from(reports)
    .where(eq(reports.businessId, business.id))
    .orderBy(desc(reports.createdAt))
    .limit(1);

  return latest?.shareToken ?? null;
}

import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { users, workspaces, type User } from "./db/schema";

// Single-workspace mode for internal CQ use. First sign-in creates the
// workspace; every subsequent sign-in joins it. When we open the product up
// to external workspaces, this logic changes to a proper onboarding flow.
const DEFAULT_WORKSPACE = {
  slug: "cq",
  name: "Creative Quality Marketing",
} as const;

export async function getOrCreateUser(): Promise<User | null> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    null;

  let workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, DEFAULT_WORKSPACE.slug),
  });

  if (!workspace) {
    const [created] = await db
      .insert(workspaces)
      .values(DEFAULT_WORKSPACE)
      .returning();
    workspace = created;
  }

  // Role rule for internal mode: first user in a workspace is owner,
  // everyone else is member. We can replace this with invite-based role
  // assignment when multi-tenant lands.
  const existingInWorkspace = await db.query.users.findFirst({
    where: eq(users.workspaceId, workspace.id),
  });
  const role = existingInWorkspace ? "member" : "owner";

  const [created] = await db
    .insert(users)
    .values({
      clerkId: clerkUserId,
      workspaceId: workspace.id,
      email,
      name,
      role,
    })
    .returning();

  return created;
}

export async function requireUser(): Promise<User> {
  const user = await getOrCreateUser();
  if (!user) {
    throw new Error("Unauthenticated");
  }
  return user;
}

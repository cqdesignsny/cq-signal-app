import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/lib/businesses";
import { db } from "@/lib/db/client";
import { businesses, workspaces } from "@/lib/db/schema";
import { BusinessProfileForm } from "@/components/business-profile-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business ? `Profile · ${business.name}` : "Profile",
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params;
  const seed = getBusiness(slug);
  if (!seed) notFound();

  // Pull persisted profile values from the DB so saved edits show on next render.
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, "cq"),
  });
  const dbBusiness = workspace
    ? await db.query.businesses.findFirst({
        where: and(
          eq(businesses.workspaceId, workspace.id),
          eq(businesses.slug, slug),
        ),
      })
    : null;

  const initial = {
    name: dbBusiness?.name ?? seed.name,
    shortName: dbBusiness?.shortName ?? seed.shortName ?? null,
    tagline: dbBusiness?.tagline ?? seed.tagline ?? null,
    vertical: dbBusiness?.vertical ?? seed.vertical ?? null,
    brandColor: dbBusiness?.brandColor ?? null,
    logoUrl: dbBusiness?.logoUrl ?? null,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
        >
          <Link href={`/app/businesses/${seed.slug}`}>
            <ArrowLeft className="size-3.5" />
            {seed.name}
          </Link>
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Edit profile
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          {initial.name}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground md:text-lg">
          Name, tagline, vertical, logo, brand color. These values are used on
          the dashboard and on every white-label report you generate for this
          business.
        </p>
      </header>

      <BusinessProfileForm slug={seed.slug} initial={initial} />
    </div>
  );
}

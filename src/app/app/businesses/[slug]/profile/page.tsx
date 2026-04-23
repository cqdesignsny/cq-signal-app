import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/lib/businesses";
import { BusinessProfileForm } from "@/components/business-profile-form";

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
  const business = getBusiness(slug);
  if (!business) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href={`/app/businesses/${business.slug}`}>
            <ArrowLeft className="size-3.5" />
            {business.name}
          </Link>
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Edit profile
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          {business.name}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground md:text-lg">
          Update name, tagline, vertical, logo, and brand color. This is a preview of the editor. Changes don't persist yet — the proper data layer ships next.
        </p>
      </header>

      <BusinessProfileForm business={business} />
    </div>
  );
}

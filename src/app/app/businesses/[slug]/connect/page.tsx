import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ChevronRight, Plug } from "lucide-react";
import {
  channelCards,
  getBusiness,
  integrationLabels,
  type Integration,
} from "@/lib/businesses";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business ? `Add a feed · ${business.name}` : "Add a feed",
  };
}

const ALL_INTEGRATIONS: Integration[] = [
  "ga4",
  "google-ads",
  "google-lsa",
  "meta-ads",
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "shopify",
  "klaviyo",
  "omnisend",
  "typeform",
  "vagaro",
  "boulevard",
  "booksy",
  "housecall-pro",
];

export default async function ConnectPickerPage({ params }: Props) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();

  const connectedSet = new Set(business.integrations);
  const ordered = [
    ...ALL_INTEGRATIONS.filter((i) => connectedSet.has(i)),
    ...ALL_INTEGRATIONS.filter((i) => !connectedSet.has(i)),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
        >
          <Link href={`/app/businesses/${business.slug}`}>
            <ArrowLeft className="size-3.5" />
            {business.name}
          </Link>
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Add a feed
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          Pick a connector
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Connect a live API feed for {business.name}, or paste in manual data
          if you don't have credentials handy. Both work in reports the same
          way; manual cards just get a "Manual" pill instead of "Live."
        </p>
      </header>

      <ul className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card/60 backdrop-blur">
        {ordered.map((key) => {
          const card = channelCards[key];
          const connected = connectedSet.has(key);
          return (
            <li key={key}>
              <Link
                href={`/app/businesses/${business.slug}/connect/${key}`}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {integrationLabels[key]}
                  </p>
                  {card?.sourceDescription ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {card.sourceDescription}
                    </p>
                  ) : null}
                </div>
                {connected ? (
                  <span className="rounded-full bg-muted/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Already added
                  </span>
                ) : null}
                <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-brand" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground">
        <Plug className="mr-2 inline size-4 align-text-bottom" />
        Live OAuth flows for Meta, LinkedIn, TikTok, Omnisend, and Klaviyo are
        coming. For now Signal supports manual data entry per channel. GA4 and
        Typeform already pull live for HVOF.
      </p>
    </div>
  );
}

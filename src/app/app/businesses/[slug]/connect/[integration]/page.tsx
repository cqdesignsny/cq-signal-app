import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Plug } from "lucide-react";
import {
  channelCards,
  channelDetails,
  getBusiness,
  integrationLabels,
  type Integration,
} from "@/lib/businesses";
import { getManualCard } from "@/lib/manual-data";
import { Button } from "@/components/ui/button";
import { ManualChannelForm } from "@/components/manual-channel-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; integration: string }>;
};

const KNOWN_INTEGRATIONS: Integration[] = [
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

const LIVE_READY: Integration[] = ["ga4", "typeform"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, integration } = await params;
  const business = getBusiness(slug);
  return {
    title:
      business && KNOWN_INTEGRATIONS.includes(integration as Integration)
        ? `Connect ${integrationLabels[integration as Integration]} · ${business.name}`
        : "Connect",
  };
}

export default async function ConnectIntegrationPage({ params }: Props) {
  const { slug, integration } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();
  if (!KNOWN_INTEGRATIONS.includes(integration as Integration)) notFound();

  const ch = integration as Integration;
  const label = integrationLabels[ch];
  const card = channelCards[ch];
  const detail = channelDetails[ch];
  const liveReady = LIVE_READY.includes(ch);
  const manual = await getManualCard(slug, ch);

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
          Connect
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          {label}
        </h1>
        {card?.sourceDescription ? (
          <p className="max-w-xl text-base text-muted-foreground">
            {card.sourceDescription}. {detail.description}
          </p>
        ) : null}
      </header>

      <section className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex items-center gap-2">
          <Plug className="size-4 text-brand" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Live API feed
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl tracking-tight">
          {liveReady
            ? "Already pulling live"
            : "Live API for this channel is on the way"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {liveReady
            ? "This integration uses the workspace-level credentials. OAuth-per-business lands in the next wave; until then no action is needed here."
            : "OAuth credentials for this channel haven't shipped yet. Use the manual form below to keep this card up to date in the meantime — reports treat manual values exactly like live ones."}
        </p>
        <Button size="sm" disabled className="mt-5 gap-1.5">
          <Plug className="size-3.5" />
          {liveReady ? "Re-authorize (coming)" : "Connect API (coming)"}
        </Button>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Manual data
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl tracking-tight">
          {manual ? "Edit manual data" : "Add manual data"}
        </h2>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          Type in the headline number, a few secondary stats, and a short note.
          The card on the dashboard and the matching section on every generated
          report pick up these values immediately.
        </p>
        <ManualChannelForm
          slug={business.slug}
          integration={ch}
          source={card.source}
          initial={manual}
        />
      </section>
    </div>
  );
}

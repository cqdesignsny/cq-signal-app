import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ImagePlus, Plug, Sparkles } from "lucide-react";
import {
  channelCards,
  channelDetails,
  getBusiness,
  integrationLabels,
  type Integration,
} from "@/lib/businesses";
import { getManualCard } from "@/lib/manual-data";
import { Button } from "@/components/ui/button";

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
  const manual = getManualCard(slug, ch);

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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <Plug className="size-4 text-brand" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Live API feed
            </p>
          </div>
          <h2 className="mt-2 font-display text-xl tracking-tight">
            {liveReady ? "Authorize the live feed" : "Live API coming soon"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {liveReady
              ? "OAuth flow lands in the next wave. Until then, this card auto-pulls live from the existing service-level credentials."
              : "OAuth + API credentials for this channel haven't shipped yet. Pick the manual option for now and Signal will treat the data the same way in reports."}
          </p>
          <Button size="sm" disabled className="mt-5 gap-1.5">
            <Plug className="size-3.5" />
            {liveReady ? "Re-authorize (coming)" : "Connect (coming)"}
          </Button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Manual data
            </p>
          </div>
          <h2 className="mt-2 font-display text-xl tracking-tight">
            {manual ? "Manual data is wired up" : "Add manual data"}
          </h2>
          {manual ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {manual.notes ??
                  "This channel is currently displaying manually-entered values. Edit them by updating `src/lib/manual-data.ts` for now; a UI editor lands in the next wave."}
              </p>
              <div className="mt-4 rounded-md border border-border/60 bg-muted/20 p-3 text-xs">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Currently showing
                </p>
                <p className="mt-1 text-foreground">
                  <strong>{manual.primary.label}:</strong> {manual.primary.value}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Don't have credentials handy? Drop in numbers manually and they
                show up on the dashboard with a "Manual" badge. Reports treat
                manual values exactly like live ones.
              </p>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ImagePlus className="size-3.5 text-brand" />
                  Coming next: paste a screenshot from any reporting dashboard
                  and Signal extracts the values into this card automatically.
                </p>
              </div>
              <Button size="sm" disabled className="mt-5 gap-1.5">
                <Sparkles className="size-3.5" />
                Enter values (coming)
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground">
        Want to wire this up tonight? Edit{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          src/lib/manual-data.ts
        </code>{" "}
        and add an entry under{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {business.slug}
        </code>{" "}
        for{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {ch}
        </code>
        . Card and report will pick it up on the next render.
      </div>
    </div>
  );
}

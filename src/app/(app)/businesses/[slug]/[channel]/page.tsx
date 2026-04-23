import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { channelCards, channelDetails, getBusiness, type Integration } from "@/lib/businesses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareReportMenu } from "@/components/share-report-menu";
import { TimeRangeTabs } from "@/components/time-range-tabs";

type Props = { params: Promise<{ slug: string; channel: string }> };

const KNOWN_CHANNELS = new Set<string>([
  "ga4",
  "google-ads",
  "meta-ads",
  "facebook",
  "instagram",
  "shopify",
  "klaviyo",
  "omnisend",
  "typeform",
  "vagaro",
  "boulevard",
  "booksy",
  "housecall-pro",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, channel } = await params;
  const business = getBusiness(slug);
  const detail = KNOWN_CHANNELS.has(channel)
    ? channelDetails[channel as Integration]
    : null;
  return {
    title: business && detail ? `${detail.title} · ${business.name}` : "Channel",
  };
}

export default async function ChannelPage({ params }: Props) {
  const { slug, channel } = await params;
  const business = getBusiness(slug);

  if (!business || !KNOWN_CHANNELS.has(channel)) notFound();

  const ch = channel as Integration;
  const card = channelCards[ch];
  const detail = channelDetails[ch];

  if (!business.integrations.includes(ch)) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href={`/businesses/${business.slug}`}>
            <ArrowLeft className="size-3.5" />
            {business.name}
          </Link>
        </Button>
      </div>

      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {card.source} · {business.name}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl tracking-tight md:text-6xl">
            {detail.title}
          </h1>
          <ShareReportMenu businessName={`${business.name} — ${card.source}`} />
        </div>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          {detail.description}
        </p>
      </header>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-muted-foreground md:text-2xl">
          {card.primary.label}
        </h2>
        <TimeRangeTabs />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-start gap-2 px-8 py-10 md:px-10 md:py-14">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {card.primary.label}
          </p>
          <p className="mono-nums text-6xl leading-none text-foreground md:text-8xl">
            {card.primary.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Awaiting live data from {card.source}. The charts, tables, and breakdowns below will populate once this integration is connected.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-muted-foreground md:text-2xl">
          What you'll see here
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {detail.sections.map((s) => (
            <Card key={s.title}>
              <CardHeader className="gap-1">
                <CardTitle className="font-display text-lg leading-tight">
                  {s.title}
                </CardTitle>
                <CardDescription className="text-sm">{s.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

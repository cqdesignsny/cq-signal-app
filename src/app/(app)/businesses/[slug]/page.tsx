import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Settings2, Sparkles } from "lucide-react";
import { channelCards, getBusiness } from "@/lib/businesses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatPanel } from "@/components/chat-panel";
import { ShareReportMenu } from "@/components/share-report-menu";
import { TimeRangeTabs } from "@/components/time-range-tabs";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business?.name ?? "Business",
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();

  return (
    <div className="mx-auto grid max-w-[1600px] gap-10 xl:grid-cols-[1fr_400px]">
      <div className="min-w-0 space-y-12">
        <header className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Business · {business.vertical}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">
              {business.name}
            </h1>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/businesses/${business.slug}/profile`}>
                  <Settings2 className="size-3.5" />
                  Edit profile
                </Link>
              </Button>
              <ShareReportMenu businessName={business.name} />
            </div>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {business.tagline}
          </p>
        </header>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              This week at a glance
            </h2>
            <TimeRangeTabs />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.integrations.map((key) => {
              const config = channelCards[key];
              if (!config) return null;
              return (
                <Link
                  key={key}
                  href={`/businesses/${business.slug}/${key}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:ring-foreground/30">
                    <CardHeader className="gap-1">
                      <div className="flex items-center justify-between">
                        <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
                          {config.source}
                        </CardDescription>
                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-foreground" />
                      </div>
                      <CardTitle className="font-sans text-base font-normal text-muted-foreground">
                        {config.primary.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="mono-nums text-5xl leading-none text-foreground md:text-6xl">
                        {config.primary.value}
                      </p>
                      <div className="flex gap-4 border-t pt-3 text-xs text-muted-foreground">
                        {config.secondary.map((s) => (
                          <div key={s.label} className="min-w-0 flex-1">
                            <p className="mono-nums truncate text-sm text-foreground">
                              {s.value}
                            </p>
                            <p className="mt-0.5 truncate">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-border/60">
          <div className="absolute inset-0 bg-mesh-brand" aria-hidden />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-brand" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                This week's Signal
              </p>
            </div>
            <p className="mt-4 font-display text-2xl leading-snug tracking-tight md:text-3xl">
              Once integrations come online, Signal will call out the two or three moves worth making this week. In the meantime, ask Signal anything in the chat on the right.
            </p>
          </div>
        </section>
      </div>

      <aside className="xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
        <ChatPanel businessSlug={business.slug} businessName={business.name} />
      </aside>
    </div>
  );
}

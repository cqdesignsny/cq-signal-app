import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { businesses } from "@/lib/businesses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-brand" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Insights
          </p>
        </div>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Signal's weekly read on your portfolio.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          One place for every proactive signal across your businesses. Weekly briefs, anomaly alerts, and the two or three moves worth making. Populates automatically once integrations are connected.
        </p>
      </header>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight text-muted-foreground md:text-3xl">
            This week's signals
          </h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:block">
            Placeholder · Live after integrations land
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardHeader className="gap-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="size-4 text-brand" />
                <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-brand">
                  Needs attention
                </CardDescription>
              </div>
              <CardTitle className="font-display text-xl leading-tight">
                Which business is trending down this week
              </CardTitle>
              <CardDescription className="text-sm">
                Signal will flag the single business whose marketing performance slipped most week-over-week, with the specific channel driving the drop.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="size-4 text-signal" />
                <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-signal">
                  Moving up
                </CardDescription>
              </div>
              <CardTitle className="font-display text-xl leading-tight">
                Which business is surging and why
              </CardTitle>
              <CardDescription className="text-sm">
                The biggest positive mover across the portfolio, with a plain-English explanation of what's working so you can double down or clone to other clients.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="gap-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-foreground" />
                <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
                  The two or three moves
                </CardDescription>
              </div>
              <CardTitle className="font-display text-xl leading-tight">
                What you'd do with another two hours this week
              </CardTitle>
              <CardDescription className="text-sm">
                Signal surfaces the highest-leverage actions across your entire portfolio, ranked by expected impact, with which business they apply to.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="gap-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-foreground" />
                <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
                  Weekly brief archive
                </CardDescription>
              </div>
              <CardTitle className="font-display text-xl leading-tight">
                Every brief Signal has written
              </CardTitle>
              <CardDescription className="text-sm">
                Auto-generated weekly briefs per business, searchable, exportable as markdown for your own agents.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-2xl tracking-tight text-muted-foreground md:text-3xl">
          Businesses Signal watches
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <Link key={b.slug} href={`/businesses/${b.slug}`} className="group">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:ring-foreground/25">
                <CardHeader className="gap-1">
                  <div className="flex items-start justify-between">
                    <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
                      {b.vertical}
                    </CardDescription>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardTitle className="font-display text-lg leading-tight">
                    {b.name}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {b.integrations.slice(0, 3).map((i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wide"
                      >
                        {i}
                      </Badge>
                    ))}
                    {b.integrations.length > 3 ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wide"
                      >
                        +{b.integrations.length - 3}
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-border/60">
        <div className="absolute inset-0 bg-mesh-brand" aria-hidden />
        <div className="relative p-8 md:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            What lands here next
          </p>
          <p className="mt-3 font-display text-2xl leading-snug tracking-tight md:text-3xl">
            Scheduled weekly briefs per business, cross-portfolio anomaly detection, and the option to subscribe to a weekly email digest. Ships alongside the real integration layer.
          </p>
        </div>
      </section>
    </div>
  );
}

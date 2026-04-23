import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { businesses, integrationLabels } from "@/lib/businesses";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          01 · Overview
        </p>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          This week, across every business.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          One view of the marketing health of your portfolio. Open any business to dig in. Ask Signal anything, anywhere.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b, i) => (
          <Link key={b.slug} href={`/businesses/${b.slug}`} className="group">
            <Card className="card-lift h-full group-hover:ring-brand/45 group-hover:ring-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                </div>
                <CardTitle className="font-display text-2xl leading-tight">
                  {b.name}
                </CardTitle>
                <CardDescription className="text-sm">{b.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {b.integrations.slice(0, 4).map((i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="font-mono text-[11px] uppercase tracking-wide"
                    >
                      {integrationLabels[i]?.split(" ")[0] ?? i}
                    </Badge>
                  ))}
                  {b.integrations.length > 4 ? (
                    <Badge
                      variant="outline"
                      className="font-mono text-[11px] uppercase tracking-wide"
                    >
                      +{b.integrations.length - 4}
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed px-8 py-12 text-center">
        <Sparkles className="mx-auto mb-4 size-6 text-brand" />
        <p className="font-display text-3xl tracking-tight md:text-4xl">
          Signal is learning your businesses.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Once integrations are connected, this space becomes your weekly brief: what's working, what needs attention, and the two or three moves worth making.
        </p>
      </section>
    </div>
  );
}

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
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          01 · Overview
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          This week, across every business.
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          One view of the marketing health of your portfolio. Open any business to dig in. Ask Signal anything, anywhere.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b, i) => (
          <Link key={b.slug} href={`/businesses/${b.slug}`} className="group">
            <Card className="h-full transition-shadow group-hover:ring-foreground/25">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <CardTitle className="font-display text-xl leading-tight">
                  {b.name}
                </CardTitle>
                <CardDescription>{b.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {b.integrations.slice(0, 4).map((i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wide"
                    >
                      {integrationLabels[i]?.split(" ")[0] ?? i}
                    </Badge>
                  ))}
                  {b.integrations.length > 4 ? (
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide">
                      +{b.integrations.length - 4}
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed px-8 py-10 text-center">
        <Sparkles className="mx-auto mb-3 size-5 text-brand" />
        <p className="font-display text-2xl tracking-tight">
          Signal is learning your businesses.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Once integrations are connected, this space becomes your weekly brief: what's working, what needs attention, and the two or three moves worth making.
        </p>
      </section>
    </div>
  );
}

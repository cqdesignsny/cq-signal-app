import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBusiness, integrationLabels } from "@/lib/businesses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatPanel } from "@/components/chat-panel";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  return {
    title: business?.name ?? "Business",
  };
}

const placeholderMetrics = [
  { label: "Website sessions", value: "—", source: "GA4" },
  { label: "New leads", value: "—", source: "Typeform" },
  { label: "Email revenue", value: "$—", source: "Omnisend" },
  { label: "Ad spend", value: "$—", source: "Meta" },
  { label: "Instagram followers", value: "—", source: "Instagram" },
  { label: "Engagement rate", value: "—%", source: "Meta" },
];

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();

  return (
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-12">
        <header className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Business · {business.vertical}
          </p>
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">
            {business.name}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">{business.tagline}</p>
        </header>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl text-muted-foreground">
              This week at a glance
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Placeholder · Connect data to populate
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderMetrics.map((m) => (
              <Card key={m.label} size="sm">
                <CardHeader className="gap-1">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
                    {m.source}
                  </CardDescription>
                  <CardTitle className="font-sans text-sm font-normal text-muted-foreground">
                    {m.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mono-nums text-3xl text-foreground">{m.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Awaiting data</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-muted-foreground">
            Connected integrations
          </h2>
          <div className="flex flex-wrap gap-2">
            {business.integrations.map((key) => (
              <Badge
                key={key}
                variant="outline"
                className="font-mono text-[10px] uppercase tracking-wide"
              >
                {integrationLabels[key] ?? key}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Integration wiring lands next. Tomorrow's HVOF report uses manual or CSV input through the same dashboard shape.
          </p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
        <ChatPanel businessSlug={business.slug} businessName={business.name} />
      </aside>
    </div>
  );
}

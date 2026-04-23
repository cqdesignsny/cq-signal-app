import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { docsSections } from "@/lib/docs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Docs",
};

export default function DocsIndexPage() {
  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-brand" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Developer docs
          </p>
        </div>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          Everything you need to use, extend, and connect CQ Signal.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Run it locally, connect your AI, plug in integrations, use the REST API, or point your MCP-capable agent at the server. These are the same docs in the repo, rendered for easy in-app reading.
        </p>
      </header>

      <div className="space-y-10">
        {docsSections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {section.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link key={item.slug} href={`/docs/${item.slug}`} className="group">
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:ring-foreground/25">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="font-display text-lg">
                          {item.title}
                        </CardTitle>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

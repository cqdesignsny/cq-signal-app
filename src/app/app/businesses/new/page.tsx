import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewBusinessPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Add Business
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          Let's add a business to Signal.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground md:text-lg">
          Onboarding flow lands in the next build. For now, the seeded businesses in the sidebar cover CQ's current roster.
        </p>
      </header>

      <div className="rounded-xl border border-dashed px-8 py-10 text-base text-muted-foreground">
        <p>
          The flow will ask for: business name, vertical, logo, brand colors for
          white-label reports, and which integrations to connect.
        </p>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link href="/app">
          <ArrowLeft />
          Back to overview
        </Link>
      </Button>
    </div>
  );
}

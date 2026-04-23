import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewBusinessPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Add Business
        </p>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          Let's add a business to Signal.
        </h1>
        <p className="text-sm text-muted-foreground">
          Onboarding flow lands in the next build. For now, the seeded businesses in the sidebar cover CQ's current roster.
        </p>
      </header>

      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        <p>The flow will ask for: business name, vertical, logo, default brand colors for white-label reports, and which integrations to connect.</p>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link href="/">
          <ArrowLeft />
          Back to overview
        </Link>
      </Button>
    </div>
  );
}

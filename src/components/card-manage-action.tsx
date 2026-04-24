import Link from "next/link";
import { Plug, Sparkles } from "lucide-react";
import type { Integration } from "@/lib/businesses";

type Props = {
  slug: string;
  integration: Integration;
  /** Drives the verb. */
  state: "live" | "manual" | "empty";
};

/**
 * Persistent action chip rendered next to the status pill in the upper-right
 * of a channel card. Always visible (not just on hover). Sits above the card's
 * full-card click overlay.
 */
export function CardManageAction({ slug, integration, state }: Props) {
  const verb =
    state === "live"
      ? "Reconnect"
      : state === "manual"
        ? "Connect live"
        : "Connect";
  const Icon = state === "manual" ? Sparkles : Plug;

  return (
    <Link
      href={`/app/businesses/${slug}/connect/${integration}`}
      className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
    >
      <Icon className="size-3" />
      {verb}
    </Link>
  );
}

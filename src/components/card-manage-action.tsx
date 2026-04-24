import Link from "next/link";
import { Plug, Sparkles } from "lucide-react";
import type { Integration } from "@/lib/businesses";

type Props = {
  slug: string;
  integration: Integration;
  /** What state the card is in. Drives the verb. */
  state: "live" | "manual" | "empty";
};

/**
 * Sits in the lower-right of a channel card and links to the connect/manage
 * flow. Renders above the card's main click overlay via z-index so clicks on
 * it don't fall through to the parent navigation.
 */
export function CardManageAction({ slug, integration, state }: Props) {
  const verb =
    state === "live" ? "Reconnect" : state === "manual" ? "Connect live" : "Connect";
  const Icon = state === "manual" ? Sparkles : Plug;

  return (
    <Link
      href={`/app/businesses/${slug}/connect/${integration}`}
      className="pointer-events-auto absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/95 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 backdrop-blur transition-all hover:border-brand/40 hover:text-brand group-hover:opacity-100"
    >
      <Icon className="size-3" />
      {verb}
    </Link>
  );
}

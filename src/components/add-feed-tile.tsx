import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  slug: string;
};

export function AddFeedTile({ slug }: Props) {
  return (
    <Link
      href={`/app/businesses/${slug}/connect`}
      className="group flex h-full min-h-[170px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 px-5 py-8 text-center transition-colors hover:border-brand/40 hover:bg-muted/40"
    >
      <span className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors group-hover:border-brand/40 group-hover:text-brand">
        <Plus className="size-4" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">Add a feed</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a connector or paste data manually
        </p>
      </div>
    </Link>
  );
}

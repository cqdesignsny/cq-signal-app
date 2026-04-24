"use client";

import { useTransition } from "react";
import { FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  action: (formData: FormData) => Promise<void>;
  slug: string;
  className?: string;
};

export function CreateReportButton({ action, slug, className }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className={cn("contents", className)}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all",
          "hover:bg-brand/90 hover:shadow-md hover:-translate-y-px",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-wait disabled:opacity-80",
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        {isPending ? "Generating report..." : "Create report"}
      </button>
    </form>
  );
}

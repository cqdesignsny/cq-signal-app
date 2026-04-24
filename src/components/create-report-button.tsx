"use client";

import { useState, useTransition } from "react";
import { Check, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { CreateReportResult } from "@/app/app/businesses/[slug]/actions";

type Props = {
  action: (formData: FormData) => Promise<CreateReportResult>;
  slug: string;
  className?: string;
};

export function CreateReportButton({ action, slug, className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [opened, setOpened] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            const result = await action(formData);
            const win = window.open(
              `/reports/${result.shareToken}`,
              "_blank",
              "noopener,noreferrer",
            );
            if (!win) {
              // Popup blocker. Fall back to same-tab navigation.
              window.location.href = `/reports/${result.shareToken}`;
              return;
            }
            setOpened(true);
            // Refresh the dashboard so report history picks up the new entry.
            router.refresh();
            setTimeout(() => setOpened(false), 2400);
          } catch (err) {
            console.error("[create-report] failed", err);
          }
        });
      }}
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
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating report...
          </>
        ) : opened ? (
          <>
            <Check className="size-4" />
            Opened in new tab
          </>
        ) : (
          <>
            <FileText className="size-4" />
            Create report
          </>
        )}
      </button>
    </form>
  );
}

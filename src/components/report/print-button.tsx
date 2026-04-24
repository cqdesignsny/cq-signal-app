"use client";

import { Printer } from "lucide-react";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      }
    >
      <Printer className="size-3.5" />
      Print or save as PDF
    </button>
  );
}

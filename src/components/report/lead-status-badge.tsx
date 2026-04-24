import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "contacted" | "no-response";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-brand/10 text-brand ring-1 ring-inset ring-brand/30",
  contacted:
    "bg-emerald-100/70 text-emerald-800 ring-1 ring-inset ring-emerald-300/50 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-700/40",
  "no-response":
    "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
};

const LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "no-response": "No response",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}

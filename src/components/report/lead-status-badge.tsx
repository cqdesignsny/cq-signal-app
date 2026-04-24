import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "contacted" | "no-response";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-signal text-neutral-900",
  contacted:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "no-response":
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};

const LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "no-response": "No Response",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}

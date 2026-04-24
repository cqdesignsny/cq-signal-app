import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
};

export function CampaignHighlight({ label, value }: Props) {
  return (
    <div className="mt-4 rounded-md border border-border/60 border-l-4 border-l-signal bg-muted/30 px-5 py-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

import type { ReactNode } from "react";
import { SectionIcon } from "@/components/report/section-card";

type Props = {
  id?: string;
  number: number;
  title: string;
  badge?: string;
  children: ReactNode;
};

export function SectionGroup({ id, number, title, badge, children }: Props) {
  return (
    <div id={id} className="mb-2">
      <div className="mb-4 flex items-center gap-3 px-1">
        <SectionIcon tone="red" number={number} />
        <h2 className="text-base font-bold tracking-tight text-foreground md:text-lg">
          {title}
        </h2>
        {badge ? (
          <span className="ml-auto rounded-xl bg-brand/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

type SubCardProps = {
  title: string;
  source?: string;
  children: ReactNode;
};

export function SubCard({ title, source, children }: SubCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card p-7 shadow-sm md:p-8 print:break-inside-avoid">
      <h3 className="mb-4 flex items-center gap-2.5 text-sm font-bold text-foreground">
        {title}
        {source ? (
          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {source}
          </span>
        ) : null}
      </h3>
      {children}
    </div>
  );
}

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
    <div id={id} className="mb-7 scroll-mt-20">
      <div className="mb-4 flex items-center gap-4 px-1">
        <SectionIcon tone="red" number={number} />
        <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
        {badge ? (
          <span className="ml-auto rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-brand">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="space-y-5">{children}</div>
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
    <div className="rounded-2xl border border-border/60 bg-card/80 p-7 shadow-sm backdrop-blur md:p-8 print:break-inside-avoid">
      <h3 className="mb-5 flex items-center gap-3 font-display text-lg tracking-tight text-foreground md:text-xl">
        {title}
        {source ? (
          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {source}
          </span>
        ) : null}
      </h3>
      {children}
    </div>
  );
}

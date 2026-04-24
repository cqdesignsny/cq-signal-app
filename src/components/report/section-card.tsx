import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "red" | "gold";

type Props = {
  id?: string;
  number: number;
  title: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  id,
  number,
  title,
  tone = "red",
  children,
  className,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "mb-6 overflow-hidden rounded-lg border border-border/60 bg-card p-7 shadow-sm md:p-8 print:break-inside-avoid",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3 border-b-2 border-muted pb-3.5">
        <SectionIcon tone={tone} number={number} />
        <h2 className="text-base font-bold tracking-tight text-foreground md:text-lg">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function SectionIcon({
  tone,
  number,
}: {
  tone: Tone;
  number: number;
}) {
  const toneStyle =
    tone === "red"
      ? "bg-brand/10 text-brand"
      : "bg-signal/15 text-signal-foreground dark:text-signal";
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md",
        toneStyle,
      )}
    >
      <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-brand text-[11px] font-bold leading-none text-white">
        {number}
      </span>
    </div>
  );
}

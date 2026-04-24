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
  /** Optional small label rendered above the title (e.g. "Section · Email") */
  eyebrow?: string;
};

export function SectionCard({
  id,
  number,
  title,
  tone = "red",
  children,
  className,
  eyebrow,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "mb-7 scroll-mt-20 rounded-2xl border border-border/60 bg-card/80 p-7 shadow-sm backdrop-blur md:p-9 print:break-inside-avoid",
        className,
      )}
    >
      <SectionHeader number={number} title={title} tone={tone} eyebrow={eyebrow} />
      {children}
    </section>
  );
}

export function SectionHeader({
  number,
  title,
  tone,
  eyebrow,
}: {
  number: number;
  title: string;
  tone: Tone;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <SectionIcon tone={tone} number={number} />
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
    </div>
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
      ? "bg-brand/10 text-brand ring-1 ring-inset ring-brand/20"
      : "bg-signal/15 text-foreground ring-1 ring-inset ring-signal/30";
  return (
    <div
      className={cn(
        "mono-nums flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
        toneStyle,
      )}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
}

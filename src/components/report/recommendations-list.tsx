import type { ReactNode } from "react";

type Item = {
  title?: string;
  body: ReactNode;
  expected?: ReactNode;
};

type Props = {
  items: Item[];
};

export function RecommendationsList({ items }: Props) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Once a few weeks of data are flowing, Signal will surface specific moves
        worth making here.
      </p>
    );
  }

  return (
    <ol className="space-y-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative border-b border-border/40 py-3.5 pl-[52px] pr-4 text-[15px] leading-relaxed text-muted-foreground last:border-b-0"
        >
          <span className="absolute left-3 top-3.5 inline-flex size-[26px] items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
            {i + 1}
          </span>
          {item.title ? (
            <p className="mb-1.5 text-[15px] font-bold text-foreground">
              {item.title}
            </p>
          ) : null}
          <p>{item.body}</p>
          {item.expected ? (
            <p className="mt-2 text-[13px] text-foreground/70">
              <span className="mr-1.5 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                Expect
              </span>
              {item.expected}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

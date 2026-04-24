type Props = {
  business: {
    name: string;
    logoUrl?: string | null;
    shortName?: string | null;
    tagline?: string | null;
    vertical?: string | null;
  };
  periodLabel: string;
  reportTitle?: string;
};

export function ReportHeader({
  business,
  periodLabel,
  reportTitle = "Marketing report",
}: Props) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border border-border/60 bg-card/60 px-7 pb-9 pt-9 shadow-sm backdrop-blur md:px-10 md:pt-11">
      <div className="absolute inset-0 -z-10 bg-mesh-brand opacity-60" aria-hidden />

      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {reportTitle}
            {business.vertical ? (
              <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
                · {business.vertical}
              </span>
            ) : null}
          </p>
          <h1 className="mt-3 break-words font-display text-4xl tracking-tight md:text-6xl">
            {business.name}
          </h1>
          {business.tagline ? (
            <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
              {business.tagline}
            </p>
          ) : null}
        </div>

        {business.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logoUrl}
            alt={business.name}
            className="h-14 w-auto max-w-[180px] shrink-0 object-contain object-right"
          />
        ) : null}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          <span className="size-1.5 rounded-full bg-brand" />
          {periodLabel}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">
          Prepared by Creative Quality Marketing
        </span>
      </div>
    </header>
  );
}

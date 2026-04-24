import Image from "next/image";

type Props = {
  business: {
    name: string;
    logoUrl?: string | null;
    shortName?: string | null;
  };
  periodLabel: string;
  reportTitle?: string;
};

export function ReportHeader({
  business,
  periodLabel,
  reportTitle = "Marketing Report",
}: Props) {
  return (
    <header className="relative mb-7 overflow-hidden rounded-b-xl bg-gradient-to-br from-neutral-900 to-neutral-800 px-9 pb-9 pt-8 shadow-lg dark:from-neutral-950 dark:to-neutral-900">
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand via-signal to-brand"
        aria-hidden
      />

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/cq-signal-logo-dark.png"
            alt="CQ Signal"
            width={140}
            height={36}
            className="h-9 w-auto opacity-95"
          />
        </div>
        <span className="rounded-full border border-brand/30 bg-brand/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
          {periodLabel}
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {reportTitle}
        </h1>
        <p className="mt-2 text-base font-medium text-signal">
          Prepared for {business.name}
        </p>
      </div>

      <div className="mt-5 text-center">
        {business.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logoUrl}
            alt={business.name}
            className="inline-block h-11 w-auto object-contain"
          />
        ) : (
          <span className="inline-block rounded-md border border-signal bg-neutral-900 px-5 py-2 text-sm font-bold tracking-wide text-signal">
            {business.shortName ?? business.name}
          </span>
        )}
      </div>
    </header>
  );
}

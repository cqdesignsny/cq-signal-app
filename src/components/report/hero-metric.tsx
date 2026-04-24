import type { ReactNode } from "react";
import { DeltaPill } from "@/components/report/delta-pill";

type Props = {
  value: ReactNode;
  deltaPct?: number | null;
  positiveIsGood?: boolean;
  /** Optional sparkline / chart rendered below the value. */
  chart?: ReactNode;
};

export function HeroMetric({
  value,
  deltaPct,
  positiveIsGood = true,
  chart,
}: Props) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mono-nums break-words text-4xl font-extrabold leading-tight text-foreground md:text-[2.8rem]">
        {value}
      </p>
      {deltaPct !== undefined && deltaPct !== null ? (
        <div className="mt-2">
          <DeltaPill
            deltaPct={deltaPct}
            positiveIsGood={positiveIsGood}
            withSuffix
            className="text-sm"
          />
        </div>
      ) : null}
      {chart ? <div className="mt-4 w-full overflow-hidden">{chart}</div> : null}
    </div>
  );
}

import { fetchGA4Snapshot, type GA4Snapshot } from "@/lib/integrations/ga4";
import {
  fetchTypeformSnapshot,
  type TypeformSnapshot,
} from "@/lib/integrations/typeform";

export type RangeKey = "7d" | "30d" | "90d" | "1y";

export const RANGES: Array<{ key: RangeKey; label: string; days: number }> = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "1y", label: "1 year", days: 365 },
];

export type RangeData = {
  key: RangeKey;
  label: string;
  range: { startDate: string; endDate: string };
  priorRange: { startDate: string; endDate: string };
  ga4?: GA4Snapshot;
  typeform?: TypeformSnapshot;
};

function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function computeRangeDates(rangeKey: RangeKey, referenceDate: Date) {
  const cfg = RANGES.find((r) => r.key === rangeKey);
  if (!cfg) throw new Error(`Unknown range: ${rangeKey}`);

  const endDate = new Date(referenceDate);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (cfg.days - 1));

  const priorEnd = new Date(startDate);
  priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setDate(priorStart.getDate() - (cfg.days - 1));

  return {
    range: { startDate: toIsoDate(startDate), endDate: toIsoDate(endDate) },
    priorRange: {
      startDate: toIsoDate(priorStart),
      endDate: toIsoDate(priorEnd),
    },
  };
}

/**
 * Resolves the integration credentials for a given business and fires the
 * right fetchers in parallel. For now credentials are read from env vars
 * scoped by slug; once per-business OAuth lands this moves to
 * integration_credentials.
 */
function resolveCreds(businessSlug: string) {
  if (businessSlug === "hudson-valley-office-furniture") {
    return {
      ga4PropertyId: process.env.HVOF_GA4_PROPERTY_ID,
      typeformFormId: process.env.HVOF_TYPEFORM_FORM_ID,
    };
  }
  return { ga4PropertyId: undefined, typeformFormId: undefined };
}

export async function fetchRangeData(
  businessSlug: string,
  rangeKey: RangeKey,
  referenceDate: Date = new Date(),
): Promise<RangeData> {
  const cfg = RANGES.find((r) => r.key === rangeKey)!;
  const { range, priorRange } = computeRangeDates(rangeKey, referenceDate);
  const { ga4PropertyId, typeformFormId } = resolveCreds(businessSlug);

  const data: RangeData = {
    key: rangeKey,
    label: cfg.label,
    range,
    priorRange,
  };

  const tasks: Array<Promise<void>> = [];

  if (ga4PropertyId) {
    tasks.push(
      fetchGA4Snapshot(ga4PropertyId, range.startDate, range.endDate)
        .then((snap) => {
          data.ga4 = snap;
        })
        .catch((err) => {
          console.error(`[snapshot] GA4 ${rangeKey} failed`, err);
        }),
    );
  }

  if (typeformFormId) {
    tasks.push(
      fetchTypeformSnapshot(typeformFormId, range.startDate, range.endDate)
        .then((snap) => {
          data.typeform = snap;
        })
        .catch((err) => {
          console.error(`[snapshot] Typeform ${rangeKey} failed`, err);
        }),
    );
  }

  await Promise.all(tasks);
  return data;
}

export async function fetchAllRanges(
  businessSlug: string,
  referenceDate: Date = new Date(),
): Promise<Record<RangeKey, RangeData>> {
  const keys = RANGES.map((r) => r.key);
  const results = await Promise.all(
    keys.map((key) => fetchRangeData(businessSlug, key, referenceDate)),
  );
  return keys.reduce(
    (acc, key, i) => {
      acc[key] = results[i];
      return acc;
    },
    {} as Record<RangeKey, RangeData>,
  );
}

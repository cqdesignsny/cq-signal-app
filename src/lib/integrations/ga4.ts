// GA4 Data API client using OAuth2 refresh token flow.
// For internal CQ use tonight, we reuse Cesar's OAuth client and refresh token
// stored as env vars. Future multi-tenant wiring will store per-business
// tokens encrypted in the integration_credentials table.

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type GA4Row = {
  dimensionValues?: Array<{ value: string }>;
  metricValues?: Array<{ value: string }>;
};

type GA4ReportResponse = {
  rows?: GA4Row[];
  totals?: GA4Row[];
  rowCount?: number;
};

export type GA4Snapshot = {
  property: string;
  range: { startDate: string; endDate: string };
  priorRange: { startDate: string; endDate: string };
  sessions: { current: number; prior: number; delta: number; deltaPct: number };
  users: { current: number; prior: number; delta: number; deltaPct: number };
  avgSessionDurationSec: { current: number; prior: number };
  bounceRate: { current: number; prior: number };
  topLandingPages: Array<{ path: string; sessions: number; pageviews?: number }>;
  topSources: Array<{ source: string; sessions: number }>;
  channelBreakdown: Array<{ channel: string; sessions: number; pct: number }>;
  dailySessions: Array<{ date: string; sessions: number }>;
  fetchedAt: string;
};

async function getGoogleAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Google OAuth env vars. Need GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN.",
    );
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token refresh failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as TokenResponse;
  return data.access_token;
}

async function runGA4Report(
  propertyId: string,
  body: unknown,
): Promise<GA4ReportResponse> {
  const token = await getGoogleAccessToken();
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GA4 API error ${res.status}: ${errText}`);
  }

  return res.json();
}

function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function computePriorRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days =
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const priorEnd = new Date(start);
  priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setDate(priorStart.getDate() - days + 1);
  return { startDate: toIsoDate(priorStart), endDate: toIsoDate(priorEnd) };
}

function parseMetric(row: GA4Row | undefined, index: number): number {
  const raw = row?.metricValues?.[index]?.value ?? "0";
  return parseFloat(raw);
}

function pct(current: number, prior: number): number {
  if (prior === 0) return current === 0 ? 0 : 100;
  return ((current - prior) / prior) * 100;
}

const CORE_METRICS = [
  { name: "sessions" },
  { name: "totalUsers" },
  { name: "averageSessionDuration" },
  { name: "bounceRate" },
];

export async function fetchGA4Snapshot(
  propertyId: string,
  startDate: string,
  endDate: string,
): Promise<GA4Snapshot> {
  const prior = computePriorRange(startDate, endDate);

  const [
    coreCurrent,
    corePrior,
    topPagesResult,
    topSourcesResult,
    channelGroupResult,
    dailyResult,
  ] = await Promise.all([
    runGA4Report(propertyId, {
      dateRanges: [{ startDate, endDate }],
      metrics: CORE_METRICS,
    }),
    runGA4Report(propertyId, {
      dateRanges: [{ startDate: prior.startDate, endDate: prior.endDate }],
      metrics: CORE_METRICS,
    }),
    runGA4Report(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [{ name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
    runGA4Report(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionSource" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
    runGA4Report(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
    runGA4Report(propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    }),
  ]);

  const currentRow = coreCurrent.rows?.[0];
  const priorRow = corePrior.rows?.[0];

  const sessionsCurrent = parseMetric(currentRow, 0);
  const sessionsPrior = parseMetric(priorRow, 0);
  const usersCurrent = parseMetric(currentRow, 1);
  const usersPrior = parseMetric(priorRow, 1);

  return {
    property: propertyId,
    range: { startDate, endDate },
    priorRange: prior,
    sessions: {
      current: sessionsCurrent,
      prior: sessionsPrior,
      delta: sessionsCurrent - sessionsPrior,
      deltaPct: pct(sessionsCurrent, sessionsPrior),
    },
    users: {
      current: usersCurrent,
      prior: usersPrior,
      delta: usersCurrent - usersPrior,
      deltaPct: pct(usersCurrent, usersPrior),
    },
    avgSessionDurationSec: {
      current: parseMetric(currentRow, 2),
      prior: parseMetric(priorRow, 2),
    },
    bounceRate: {
      current: parseMetric(currentRow, 3),
      prior: parseMetric(priorRow, 3),
    },
    topLandingPages: (topPagesResult.rows ?? []).map((r) => ({
      path: r.dimensionValues?.[0]?.value ?? "",
      sessions: parseFloat(r.metricValues?.[0]?.value ?? "0"),
      pageviews: parseFloat(r.metricValues?.[1]?.value ?? "0"),
    })),
    topSources: (topSourcesResult.rows ?? []).map((r) => ({
      source: r.dimensionValues?.[0]?.value ?? "",
      sessions: parseFloat(r.metricValues?.[0]?.value ?? "0"),
    })),
    channelBreakdown: buildChannelBreakdown(channelGroupResult, sessionsCurrent),
    dailySessions: (dailyResult.rows ?? []).map((r) => ({
      date: r.dimensionValues?.[0]?.value ?? "",
      sessions: parseFloat(r.metricValues?.[0]?.value ?? "0"),
    })),
    fetchedAt: new Date().toISOString(),
  };
}

function buildChannelBreakdown(
  result: GA4ReportResponse,
  totalSessions: number,
): Array<{ channel: string; sessions: number; pct: number }> {
  const total = totalSessions || 1;
  return (result.rows ?? []).map((r) => {
    const sessions = parseFloat(r.metricValues?.[0]?.value ?? "0");
    return {
      channel: r.dimensionValues?.[0]?.value ?? "(other)",
      sessions,
      pct: (sessions / total) * 100,
    };
  });
}

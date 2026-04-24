import "server-only";

// Typeform Responses API client.
// Reads a single form's submissions with period-over-period comparison.
// For tonight's internal use we read the PAT from TYPEFORM_PAT env var.
// Future multi-tenant: per-business encrypted PAT in integration_credentials.

type TypeformAnswer = {
  field?: { id?: string; type?: string; ref?: string };
  type: string;
  text?: string;
  email?: string;
  phone_number?: string;
  number?: number;
  boolean?: boolean;
  choice?: { label?: string };
  choices?: { labels?: string[] };
  date?: string;
  url?: string;
};

type TypeformRawResponse = {
  landing_id?: string;
  token: string;
  landed_at?: string;
  submitted_at: string;
  hidden?: Record<string, string>;
  answers?: TypeformAnswer[];
};

type TypeformResponsesResult = {
  total_items: number;
  page_count: number;
  items: TypeformRawResponse[];
};

export type TypeformLead = {
  id: string;
  submittedAt: string;
  name?: string;
  email?: string;
  phone?: string;
  fields: Record<string, string>;
};

export type TypeformSnapshot = {
  formId: string;
  range: { startDate: string; endDate: string };
  priorRange: { startDate: string; endDate: string };
  totalLeads: { current: number; prior: number; delta: number; deltaPct: number };
  leads: TypeformLead[];
  fetchedAt: string;
};

async function fetchResponsesPage(
  formId: string,
  startDate: string,
  endDate: string,
): Promise<TypeformResponsesResult> {
  const pat = process.env.TYPEFORM_PAT;
  if (!pat) throw new Error("TYPEFORM_PAT is not set");

  const since = `${startDate}T00:00:00Z`;
  const until = `${endDate}T23:59:59Z`;

  const url = new URL(`https://api.typeform.com/forms/${formId}/responses`);
  url.searchParams.set("page_size", "100");
  url.searchParams.set("since", since);
  url.searchParams.set("until", until);
  url.searchParams.set("completed", "true");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pat}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Typeform API error ${res.status}: ${await res.text()}`,
    );
  }

  return res.json();
}

function extractLead(r: TypeformRawResponse): TypeformLead {
  const fields: Record<string, string> = {};
  let name: string | undefined;
  let email: string | undefined;
  let phone: string | undefined;

  for (const answer of r.answers ?? []) {
    const key = answer.field?.ref || answer.field?.id || "unknown";
    let value: string | undefined;

    switch (answer.type) {
      case "text":
      case "short_text":
      case "long_text":
        value = answer.text;
        break;
      case "email":
        value = answer.email;
        break;
      case "phone_number":
        value = answer.phone_number;
        break;
      case "number":
        value = answer.number !== undefined ? String(answer.number) : undefined;
        break;
      case "boolean":
        value = answer.boolean ? "Yes" : "No";
        break;
      case "choice":
        value = answer.choice?.label;
        break;
      case "choices":
        value = (answer.choices?.labels ?? []).join(", ");
        break;
      case "date":
        value = answer.date;
        break;
      case "url":
        value = answer.url;
        break;
    }

    if (value != null && value !== "") {
      fields[key] = value;
      if (!name && /name|full.?name|first/i.test(key)) name = value;
      if (!email && (answer.type === "email" || /email/i.test(key))) email = value;
      if (!phone && (answer.type === "phone_number" || /phone/i.test(key))) phone = value;
    }
  }

  // Last-resort fallback: any @-looking string is our email.
  if (!email) {
    for (const v of Object.values(fields)) {
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        email = v;
        break;
      }
    }
  }

  return {
    id: r.token,
    submittedAt: r.submitted_at,
    name,
    email,
    phone,
    fields,
  };
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

function pct(current: number, prior: number): number {
  if (prior === 0) return current === 0 ? 0 : 100;
  return ((current - prior) / prior) * 100;
}

export async function fetchTypeformSnapshot(
  formId: string,
  startDate: string,
  endDate: string,
): Promise<TypeformSnapshot> {
  const prior = computePriorRange(startDate, endDate);

  const [currentResult, priorResult] = await Promise.all([
    fetchResponsesPage(formId, startDate, endDate),
    fetchResponsesPage(formId, prior.startDate, prior.endDate),
  ]);

  const leads = currentResult.items
    .slice()
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))
    .map(extractLead);

  return {
    formId,
    range: { startDate, endDate },
    priorRange: prior,
    totalLeads: {
      current: currentResult.total_items,
      prior: priorResult.total_items,
      delta: currentResult.total_items - priorResult.total_items,
      deltaPct: pct(currentResult.total_items, priorResult.total_items),
    },
    leads,
    fetchedAt: new Date().toISOString(),
  };
}

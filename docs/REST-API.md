# REST API

Programmatic access to Signal data. Use this when you want Signal wired into your own automation, dashboard, or agent.

## Current endpoints (internal phase)

```
GET  /api/businesses/{slug}/export        markdown or JSON brief
POST /api/chat                            streaming chat (Vercel AI SDK v6 protocol)
```

No authentication during internal phase. Authentication ships with the database layer.

## Coming soon (with per-workspace API keys)

```
GET   /api/businesses                     list workspace businesses
GET   /api/businesses/{slug}              business detail
POST  /api/businesses                     create business
PATCH /api/businesses/{slug}              update profile
GET   /api/businesses/{slug}/metrics      time-range metric snapshot
GET   /api/businesses/{slug}/leads        lead list (PII-gated)
POST  /api/integrations/{type}/connect    start OAuth flow
POST  /api/integrations/{id}/refresh      manual sync
POST  /api/agent-analysis                 submit external agent analysis (loopback)
```

## Authentication (planned)

```
Authorization: Bearer sigk_live_<your-key>
```

Keys are per-workspace with scopes:

- `read:businesses` — list and view businesses
- `read:metrics` — query metrics
- `read:leads` — access lead PII (requires explicit toggle)
- `write:businesses` — create and update business profiles
- `write:agent-analysis` — submit agent analysis for loopback

Keys are issued via Settings → Agents & AI. Stored hashed server-side, shown once at issuance.

## Rate limits (planned)

- Read endpoints: 60 requests per minute per workspace.
- Write endpoints: 10 requests per minute per workspace.
- Chat endpoint: 20 requests per minute per workspace. Token budgets applied on top.
- Export endpoint: 30 requests per minute per workspace.

Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

## Response format

Success:

```json
{
  "data": { },
  "meta": { "range": "7d", "generated_at": "2026-04-23T18:40:00Z" }
}
```

Error:

```json
{
  "error": {
    "code": "not_found",
    "message": "Business not found",
    "request_id": "req_abc123"
  }
}
```

## Webhooks (planned)

```
POST {your-callback-url}
```

Signed with HMAC-SHA256 using your webhook secret. Event types:

- `business.updated`
- `integration.connected` and `integration.disconnected`
- `metrics.synced`
- `anomaly.detected`
- `ai.weekly_brief_ready`
- `lead.created`

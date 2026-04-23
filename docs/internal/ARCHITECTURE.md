# Architecture

## Stack

### Runtime
- **Next.js 16 App Router** on Vercel Fluid Compute (300s default function timeout).
- **TypeScript** strict mode.
- **React Compiler** enabled (automatic memoization).
- **Turbopack** for dev server.

### UI
- **Tailwind CSS v4** with custom theme tokens (CQ Signal palette).
- **shadcn/ui** components on Radix primitives (required for AI Elements compatibility).
- **Geist Sans + Geist Mono + Instrument Serif** via `next/font`.
- **next-themes** for light / dark / system switching.

### AI
- **Vercel AI SDK v6** (`ai`, `@ai-sdk/react`).
- **Claude Sonnet 4.6** via Vercel AI Gateway using the model string `anthropic/claude-sonnet-4.6`.
- Model strings (not direct provider calls) so Gateway's failover and observability apply when deployed. Local fallback to `@ai-sdk/anthropic` with `ANTHROPIC_API_KEY`.

### Planned (not yet wired)
- **Neon Postgres** via Vercel Marketplace for persistence.
- **Clerk** for auth and multi-workspace.
- **Upstash Redis** for rate limiting and caching.
- **Vercel Blob** for logos and generated PDFs.
- **MCP server** at `/mcp` exposing data-access tools.

## Directory layout

See [README.md](../README.md#directory-layout).

## Data model (target)

Businesses currently live as seed data in `src/lib/businesses.ts`. Once Neon Postgres is wired, the schema lands as:

```
workspaces
  id, name, slug, created_at

users                         [Clerk-linked]
  id, clerk_id, workspace_id, role (owner|admin|member|read-only)

businesses
  id, workspace_id, slug, name, short_name, tagline, vertical,
  brand_color, logo_url, created_at, archived_at

integrations
  id, business_id, type, connected_at, last_synced_at, status,
  credential_ref (points to encrypted-secrets table)

integration_credentials       [encrypted at rest]
  id, integration_id, encrypted_payload, rotated_at

metrics_raw
  id, business_id, integration_type, metric_key, value,
  period_start, period_end, pulled_at

metrics_daily                 [rolled-up, query-friendly]
  business_id, date, channel, metric_key, value

leads                         [PII, per-business]
  id, business_id, source, submitted_at,
  encrypted_name, encrypted_email, encrypted_phone, fields_json

ai_sessions
  id, business_id, user_id, created_at, ended_at

ai_messages
  id, session_id, role, parts, created_at

agent_keys                    [per-workspace REST access]
  id, workspace_id, key_hash, name, scopes, created_at,
  last_used_at, revoked_at

audit_logs                    [append-only]
  id, workspace_id, actor_id, action, target, ip, user_agent, created_at
```

All tenant queries include `workspace_id` filtering. Postgres row-level security adds defense-in-depth.

## Key architectural decisions

### 1. Subdirectory for Next.js, not workspace root
`cq-signal/` inside the workspace folder. The workspace root is reserved for a future mobile app, docs, and design assets.

### 2. Radix over Base UI for shadcn primitives
AI Elements (Vercel's chat components) require Radix. Switching later is expensive.

### 3. AI Gateway model strings, not direct provider calls
Provider packages still work as fallback. Gateway brings failover, observability, and cost tracking on deploy.

### 4. "Business" language everywhere, not "client"
Future-proofs the product for both agency and direct-to-business-owner use. Schema uses `businesses` not `clients`.

### 5. Markdown-first export design
Every new data surface is designed to produce a markdown brief. Not retrofitted later.

### 6. Mobile-port readiness from day one
Clean API boundary between frontend and data so an Expo / React Native app is a weeks-long project, not a rewrite.

### 7. BYO API key pattern planned for AI features
Architecture supports user-provided Anthropic / OpenAI keys so future SaaS customers don't have their billing tied to ours.

### 8. Security posture baked into the schema
Credentials never stored in plaintext. PII columns encrypted. Audit log append-only. See [SECURITY.md](SECURITY.md).

## API surface

### Current

```
GET  /api/businesses/[slug]/export?format=md|json&range=7d|1m|3m|1y[&download=1]
POST /api/chat                          streaming chat (Vercel AI SDK v6 protocol)
```

### Planned

```
GET  /api/businesses                    list workspace businesses
GET  /api/businesses/[slug]             business detail
POST /api/businesses                    create business
PATCH /api/businesses/[slug]            update profile
GET  /api/businesses/[slug]/metrics     time-range metric snapshot
GET  /api/businesses/[slug]/leads       lead list (PII-gated)
POST /api/integrations/[type]/connect   start OAuth flow
POST /api/integrations/[id]/refresh     manual sync
GET  /mcp                               MCP server endpoint
```

## Deploy

GitHub main → auto-deploys to Vercel production. Preview deploys on PR. No manual build step.

Environment variables managed via `vercel env`:

- `AI_GATEWAY_API_KEY` (preferred) or `ANTHROPIC_API_KEY` (local fallback).
- Database URL, Clerk keys, encryption keys, webhook secrets land once those layers ship.

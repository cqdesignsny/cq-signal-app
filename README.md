# CQ Signal

> **If you are a new session or a different LLM (Codex, Gemini, another Claude) picking this up:** read [docs/HANDOFF.md](docs/HANDOFF.md) first. That doc is the single source of truth for current state, pending work, and the next step.

Marketing intelligence and actionable insights for the businesses you care about. Built AI-first: your data flows cleanly into your own agents, not just our dashboards.

## What this is

CQ Signal is a reporting and analytics platform for:

- Agencies managing a portfolio of client businesses.
- Business owners who want insights on their own companies (one or many).

It connects to the platforms your business uses (analytics, ads, email, social, booking, CRM), gives you a clean dashboard, and lets you drill into any metric. The differentiator: Signal exports your data as AI-ready markdown briefs and (coming) exposes it via an MCP server, so your own Claude, Gemini, or custom agent can analyze your business directly.

## Status

Internal tool for CQ (Creative Quality Marketing) while we ship features. Built by Daniel and Claude together. Private while we iterate.

**Live:** [cq-signal-app.vercel.app](https://cq-signal-app.vercel.app)
**Repo:** [github.com/cqdesignsny/cq-signal-app](https://github.com/cqdesignsny/cq-signal-app)

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 with custom CQ Signal theme
- shadcn/ui on Radix primitives
- Vercel Fluid Compute, AI Gateway routing
- Claude Sonnet 4.6 via the `anthropic/claude-sonnet-4.6` model string
- Planned: Neon Postgres, Vercel Blob, Clerk auth, Upstash Redis

Full architecture notes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Running locally

```bash
pnpm install
cp .env.local.example .env.local
# fill in AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY
pnpm dev
```

Opens at `http://localhost:3000`.

## Directory layout

```
cq-signal/
├── src/
│   ├── app/
│   │   ├── (app)/              logged-in shell (sidebar + topbar)
│   │   │   ├── page.tsx                       portfolio overview
│   │   │   ├── insights/                      portfolio insights (placeholder)
│   │   │   ├── docs/                          in-app developer docs
│   │   │   ├── businesses/[slug]/             business detail + drill-ins + profile
│   │   │   └── settings/                      preferences + agents docs
│   │   ├── api/
│   │   │   ├── chat/                          streaming chat endpoint
│   │   │   └── businesses/[slug]/export/      MD / JSON export
│   │   ├── layout.tsx                         root: fonts + providers
│   │   └── globals.css                        theme tokens + gradient + glass
│   ├── components/
│   │   ├── ui/                                shadcn primitives
│   │   ├── app-sidebar.tsx
│   │   ├── chat-panel.tsx
│   │   ├── export-for-ai-menu.tsx
│   │   ├── share-report-menu.tsx
│   │   ├── sidebar-theme-toggle.tsx
│   │   ├── time-range-tabs.tsx
│   │   ├── business-profile-form.tsx
│   │   ├── docs-nav.tsx
│   │   └── docs-content.tsx
│   └── lib/
│       ├── businesses.ts                      seed data + integration catalog
│       ├── md-export.ts                       markdown brief generator
│       ├── docs.ts                            client-safe docs registry
│       ├── docs-server.ts                     server-only fs loader
│       └── utils.ts                           cn helper
├── docs/                                       handoff, vision, architecture, security, dev refs
├── public/                                     logos + static
└── package.json
```

## Docs

Read in this order if you are new to the project:

1. [HANDOFF.md](docs/HANDOFF.md) — current state, pending tasks, next step. Read first.
2. [VISION.md](docs/VISION.md) — product vision and competitive positioning.
3. [ARCHITECTURE.md](docs/ARCHITECTURE.md) — stack, data model, trade-offs.
4. [SECURITY.md](docs/SECURITY.md) — threat model and practices.
5. [DECISIONS.md](docs/DECISIONS.md) — decision log (the project's memory).
6. [CHANGELOG.md](docs/CHANGELOG.md) — what shipped when.

Developer references: [GETTING-STARTED](docs/GETTING-STARTED.md), [MARKDOWN-EXPORTS](docs/MARKDOWN-EXPORTS.md), [REST-API](docs/REST-API.md), [MCP-SERVER](docs/MCP-SERVER.md), [CHAT-API](docs/CHAT-API.md), [INTEGRATIONS](docs/INTEGRATIONS.md).

## Contact

Daniel · CQ · `cqdesignsny@gmail.com`

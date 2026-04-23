# CQ Signal

> **If you are a new session or a different LLM (Codex, Gemini, another Claude) picking this up:** read [docs/internal/HANDOFF.md](docs/internal/HANDOFF.md) first. That doc is the single source of truth for current state, pending work, and the next step.

Marketing intelligence and actionable insights for the businesses you care about. Built AI-first: your data flows cleanly into your own agents, not just our dashboards.

## What this is

CQ Signal is a reporting and analytics platform for:

- Agencies managing a portfolio of client businesses.
- Business owners who want insights on their own companies (one or many).

It connects to the platforms your business uses (analytics, ads, email, social, booking, CRM), gives you a clean dashboard, and lets you drill into any metric. The differentiator: Signal exports your data as AI-ready markdown briefs and (coming) exposes it via an MCP server, so your own Claude, Gemini, or custom agent can analyze your business directly.

## Status

Internal tool for [Creative Quality Marketing](https://creativequalitymarketing.com) (CQ) while we ship features. Built by Cesar Augustus and Claude together. Private while we iterate.

**Live:** [cq-signal-app.vercel.app](https://cq-signal-app.vercel.app)
**Repo:** [github.com/cqdesignsny/cq-signal-app](https://github.com/cqdesignsny/cq-signal-app)

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 with custom CQ Signal theme
- shadcn/ui on Radix primitives
- Vercel Fluid Compute, AI Gateway routing
- Claude Sonnet 4.6 via the `anthropic/claude-sonnet-4.6` model string
- Planned: Neon Postgres, Vercel Blob, Clerk auth, Upstash Redis

## Running locally

```bash
pnpm install
cp .env.local.example .env.local
# fill in AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY
pnpm dev
```

Opens at `http://localhost:3000`.

## Public docs (rendered in-app at `/docs`)

- [Getting started](docs/GETTING-STARTED.md)
- [Vision](docs/VISION.md)
- [Markdown exports](docs/MARKDOWN-EXPORTS.md)
- [REST API](docs/REST-API.md)
- [MCP server](docs/MCP-SERVER.md)
- [Chat API](docs/CHAT-API.md)
- [Integration catalog](docs/INTEGRATIONS.md)
- [Security](docs/SECURITY.md)
- [Changelog](docs/CHANGELOG.md)

## Internal docs (not rendered in-app)

For Cesar Augustus and any LLM/session continuing the build:

- [HANDOFF.md](docs/internal/HANDOFF.md) — current state, pending work, next step. Read first.
- [ARCHITECTURE.md](docs/internal/ARCHITECTURE.md) — stack, data model, internal directory layout.
- [DECISIONS.md](docs/internal/DECISIONS.md) — chronological decision log.

## Contact

Cesar Augustus · [Creative Quality Marketing](https://creativequalitymarketing.com) · `cqdesignsny@gmail.com`

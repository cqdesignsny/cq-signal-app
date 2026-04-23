# Handoff

Read this first if you are a new session, a different LLM (Codex, Gemini, another Claude), or a human picking up this project after a break. Everything you need to continue is here or linked.

**This file is intentionally NOT rendered in the public `/docs` site.** It lives at `docs/internal/HANDOFF.md` along with ARCHITECTURE and DECISIONS. Only Daniel and contributors see it. Keep it that way.

## What this is

CQ Signal is a marketing reporting and analytics platform built AI-first. It gives business owners and agency operators a clean dashboard for their marketing performance, plus the ability to export every view as a Markdown brief or query it via a (coming) MCP server, so their own AI agents can analyze the data directly.

**Owner:** Daniel. Runs CQ (Creative Quality Marketing, creativequalitymarketing.com). Building this for his agency's internal use first, then SaaS later.

**Live:** [cq-signal-app.vercel.app](https://cq-signal-app.vercel.app)
**Repo:** [github.com/cqdesignsny/cq-signal-app](https://github.com/cqdesignsny/cq-signal-app)
**Local working directory:** `/Volumes/CQ-PRO-4TB/Admin/CQ Reporting App/cq-signal`

## Current state

**Version:** v0.5.4 (Getting Started: Why CQ Signal is different section)
**Last commit SHA:** update this when you commit
**Last updated:** 2026-04-23

The app is a Next.js 16 App Router site deployed to Vercel. Pushed to GitHub `main` auto-deploys. Local dev is `pnpm dev` from the `cq-signal/` directory. Dev server listens at `http://localhost:3000`.

All UI surfaces are built. Chat works (streams Claude via AI Gateway). Markdown export works (placeholders). No database yet. No authentication yet. No real integrations yet. Seed data in `src/lib/businesses.ts`.

## In progress

**Nothing actively coding in this commit.** This commit separated internal docs from public ones, bumped docs font sizes 30% for readability, added dramatic card-lift hover effects with brand-tinted shadows, themed scrollbars, and brand-colored focus rings and text selection.

## Immediate next task

Begin the real HVOF push. Plan locked in with Daniel.

**User-side (Daniel's work, parallel with coding):**

1. Provision Neon Postgres via Vercel Marketplace (5 min). Needs `DATABASE_URL`.
2. Provision Vercel Blob (2 min). Needs `BLOB_READ_WRITE_TOKEN`.
3. Set up Google Cloud OAuth app for GA4 (20 min). Redirect URI: `https://cq-signal-app.vercel.app/api/integrations/google/callback` + localhost.
4. Set up Meta Developer App with Facebook Login + Instagram Graph + Pages API (30 min). Same redirect shape.
5. Generate Typeform Personal Access Token (5 min). Scope: `responses:read`.
6. Generate Omnisend API key from HVOF's Omnisend account (5 min).

**Coding work (where a new session picks up):**

1. Install Drizzle ORM + Neon serverless driver + zod.
2. Schema and migrations for workspaces, businesses, integrations, integration_credentials (encrypted), metrics_raw, metrics_daily, leads, reports, audit_logs.
3. Clerk authentication shell before anything sensitive lands in the database.
4. Credential encryption layer (AES-GCM with master key from env).
5. Integration framework (shared OAuth callback, token refresh, connection UI pattern).
6. GA4 end-to-end (OAuth, property picker, 30-day pull).
7. Meta end-to-end (dev mode with test users since full review takes days).
8. Typeform end-to-end (PAT-based, responses pull with lead PII encrypted).
9. Omnisend end-to-end (API key-based, campaign stats).
10. HTML report template and `/reports/[id]` route (responsive, white-labeled with business logo).
11. Logo upload on business profile via Vercel Blob.
12. Deploy, verify, generate HVOF's first real report.

Target: HVOF report ready for client meeting 2026-04-24 afternoon. About 10 to 12 hours of focused code.

## Pending user actions

Until these are done, server-side integration work is blocked:

- [ ] Neon Postgres provisioned (need `DATABASE_URL` in project env)
- [ ] Vercel Blob provisioned (need `BLOB_READ_WRITE_TOKEN`)
- [ ] Google Cloud OAuth credentials (need `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)
- [ ] Meta Developer App credentials (need `META_APP_ID` and `META_APP_SECRET`)
- [ ] Typeform Personal Access Token (user pastes through app UI, not env)
- [ ] Omnisend API key (user pastes through app UI, not env)
- [ ] Vercel env pulled locally with `vercel env pull`

## What's shipped

Version history in [../CHANGELOG.md](../CHANGELOG.md). High level:

- **v0.1 (scaffold).** Next.js 16 + Tailwind v4 + shadcn on Radix, app shell, seeded businesses, streaming chat with Claude.
- **v0.2 (polish).** Tight-cropped logos, dark-mode variant, typography scale, HouseCall Pro for TZ.
- **v0.3 (app-like).** Gradient background, glass surfaces, theme toggle in sidebar, Meta split into Meta Ads / Facebook / Instagram, channel drill-in pages, time range tabs, Share Report menu, profile editor skeleton.
- **v0.4 (AI-ready).** Analyst-voice system prompt, markdown export endpoint, Export for AI dropdown, Agents & AI settings page, LinkedIn + TikTok integrations added.
- **v0.5 (docs foundation).** README + strategic docs, in-app `/docs` site rendering the markdown files, security headers, chat voice refined to Signal personality.
- **v0.5.1.** Handoff doc created, Insights page restored after accidental removal.
- **v0.5.2.** Public/internal docs split (public at `/docs`, internal at `docs/internal/`). Docs content + nav font sizes bumped 30% for readability. Main sidebar nav labels bumped. Dramatic card-lift hover with brand-tinted shadows. Themed scrollbars, brand-colored focus rings and selection, link underline animation utility.
- **v0.5.3.** Getting Started rewritten as welcoming entry point with sections: What CQ Signal is, How it works, Who it is for, Best use cases, and Our mission and why we built this (Daniel's story in first person). Vision gets Mission statement and Why this exists section at the top.
- **v0.5.4.** Getting Started gains "Why CQ Signal is different" section with seven concrete differentiators: AI-native architecture, data portability, prescriptive analysis, business-owner framing, white-label included, honesty about limitations, modern design.

## Key decisions and constraints

Short list. Full context in [DECISIONS.md](DECISIONS.md).

- **Stack:** Next.js 16 + TypeScript strict + Tailwind v4 + shadcn on Radix. Claude Sonnet 4.6 via AI Gateway model strings.
- **Language:** "business" throughout, never "client."
- **Project lives at `cq-signal/` subdirectory** of the workspace folder.
- **Markdown-first exports.** Every data surface must produce a markdown brief.
- **Mobile-port readiness from day one.** Clean API / data boundary so a future React Native app is a weeks-long project.
- **BYO API key pattern planned.** So future SaaS customers can bring their own keys.
- **Public vs internal docs split.** Public at `/docs`, internal at `docs/internal/`.

## Voice and style rules

Critical to apply at every AI-producing surface (chat, briefs, PDF narratives, email content):

- No em dashes. Ever.
- No emojis. Ever.
- No AI filler phrases.
- No "as an AI" hedging.
- Signal's voice is conversational, direct, witty, analytical. Uses analogies. Pushes back when users are making a bad call.
- Daniel speaks plainly and confidently. Match that.

Full detail: `src/app/api/chat/route.ts` system prompt, plus `feedback_chat_voice.md` memory.

## Developer orientation

### Clone and run

```bash
git clone https://github.com/cqdesignsny/cq-signal-app.git
cd cq-signal-app
pnpm install
cp .env.local.example .env.local
# fill in AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY at minimum
pnpm dev
```

### Directory to walk first

1. [../../README.md](../../README.md) — one-page intro.
2. This file. You are here.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — stack, data model, decisions.
4. [DECISIONS.md](DECISIONS.md) — chronological log of every major architectural call.
5. Public docs under `docs/`: GETTING-STARTED, VISION, SECURITY, CHANGELOG, developer refs.

### Key source files to understand

- `src/lib/businesses.ts` — business type, integration catalog, channel cards, seed data.
- `src/lib/md-export.ts` — markdown brief generator.
- `src/lib/docs.ts` — public docs registry (used for the in-app `/docs` site).
- `src/lib/docs-server.ts` — server-only fs loader for docs.
- `src/app/api/chat/route.ts` — streaming chat endpoint + Signal system prompt.
- `src/app/api/businesses/[slug]/export/route.ts` — MD / JSON export endpoint.
- `src/components/chat-panel.tsx` — chat UI embedded on every business page.
- `src/components/app-sidebar.tsx` — main nav.
- `src/app/globals.css` — theme tokens, gradient, glass, card-lift utility, scrollbar theme.
- `src/app/(app)/businesses/[slug]/page.tsx` — per-business dashboard.
- `src/app/(app)/businesses/[slug]/[channel]/page.tsx` — channel drill-in.
- `src/app/(app)/insights/page.tsx` — portfolio-level insights (placeholder shape).

## Rules for maintaining this file

Every session that commits code must update this file:

1. Update **Current state**: version, last commit SHA, timestamp.
2. Update **In progress** with what's actively being worked on or "Nothing active" if between tasks.
3. Update **Immediate next task** with the concrete next step.
4. Update **Pending user actions** if blocked on Daniel for setup.
5. Update **What's shipped** when a new version lands.

Keep it tight. Write so a cold reader can pick up without needing back-channel context.

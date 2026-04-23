# Handoff

Read this first if you are a new session, a different LLM (Codex, Gemini, another Claude), or a human picking up this project after a break. Everything you need to continue is here or linked.

## What this is

CQ Signal is a marketing reporting and analytics platform built AI-first. It gives business owners and agency operators a clean dashboard for their marketing performance, plus the ability to export every view as a Markdown brief or query it via a (coming) MCP server, so their own AI agents can analyze the data directly.

**Owner:** Daniel. Runs CQ (Creative Quality Marketing, creativequalitymarketing.com). Building this for his agency's internal use first, then SaaS later.

**Live:** [cq-signal-app.vercel.app](https://cq-signal-app.vercel.app)
**Repo:** [github.com/cqdesignsny/cq-signal-app](https://github.com/cqdesignsny/cq-signal-app)
**Local working directory:** `/Volumes/CQ-PRO-4TB/Admin/CQ Reporting App/cq-signal`

## Current state

**Version:** v0.5.1 (docs site + Insights restored + handoff doc)
**Last commit SHA:** update this when you commit
**Last updated:** 2026-04-23

The app is a Next.js 16 App Router site deployed to Vercel. Pushed to GitHub `main` auto-deploys. Local dev is `pnpm dev` from the `cq-signal/` directory. Dev server listens at `http://localhost:3000`.

Everything currently renders with placeholder data seeded in `src/lib/businesses.ts`. No database yet. No authentication yet. No real integrations yet. The chat works (streams from Claude via AI Gateway). Markdown export works (placeholders). All UI surfaces are built.

## In progress

**Nothing actively coding in this commit.** This commit added the handoff doc itself, restored the Insights nav page, and saved a memory rule to keep this doc updated.

## Immediate next task

Go real on HVOF. Plan locked in with Daniel:

1. **Provision Neon Postgres** via Vercel Marketplace dashboard (Daniel, 5 min).
2. **Provision Vercel Blob** (Daniel, 2 min).
3. **Set up Google Cloud OAuth app** for GA4 (Daniel, 20 min).
4. **Set up Meta Developer app** with Facebook Login + Instagram Graph + Pages API (Daniel, 30 min).
5. **Generate Typeform PAT** (Daniel, 5 min).
6. **Generate Omnisend API key** from HVOF's Omnisend account (Daniel, 5 min).

In parallel, coding work (this is where the new session picks up):

1. Install Drizzle + Neon serverless driver + zod.
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
- [ ] Vercel env pulled locally with `vercel env pull`

## What's shipped

Version history in [CHANGELOG.md](CHANGELOG.md). High level:

- **v0.1 (scaffold).** Next.js 16 + Tailwind v4 + shadcn on Radix, app shell, seeded businesses, streaming chat with Claude.
- **v0.2 (polish).** Tight-cropped logos, dark-mode variant, typography scale, HouseCall Pro for TZ.
- **v0.3 (app-like).** Gradient background, glass surfaces, theme toggle in sidebar, Meta split into Meta Ads / Facebook / Instagram, channel drill-in pages, time range tabs, Share Report menu, profile editor skeleton.
- **v0.4 (AI-ready).** Analyst-voice system prompt, markdown export endpoint, Export for AI dropdown, Agents & AI settings page, LinkedIn + TikTok integrations added.
- **v0.5 (docs foundation).** README + six strategic docs (VISION, ARCHITECTURE, SECURITY, DECISIONS, CHANGELOG plus developer-facing docs), in-app `/docs` site rendering the same markdown files, security headers in `next.config.ts`, chat voice refined to Signal personality.
- **v0.5.1 (handoff doc + Insights restored).** This commit. Handoff doc created, Insights page built as a real placeholder at `/insights` after it was accidentally removed in v0.5.

## Key decisions and constraints

Short list. Full context in [DECISIONS.md](DECISIONS.md).

- **Stack:** Next.js 16 + TypeScript strict + Tailwind v4 + shadcn on Radix. Claude Sonnet 4.6 via AI Gateway model strings (not direct provider).
- **Language:** "business" throughout, never "client." Tables are `businesses`, routes are `/businesses/[slug]`, UI copy is "Add Business."
- **Project lives at `cq-signal/` subdirectory** of the workspace folder, not the root, because npm rejects the folder name with spaces. Workspace root is reserved for future mobile and docs.
- **Markdown-first exports.** Every data surface must produce a markdown brief. Not retrofitted later.
- **Mobile-port readiness from day one.** Clean API / data boundary so a future React Native app is a weeks-long project, not a rewrite.
- **BYO API key pattern planned.** So future SaaS customers can bring their own Anthropic / OpenAI keys.

## Voice and style rules

Critical to apply at every AI-producing surface (chat, briefs, PDF narratives, email content):

- **No em dashes.** Ever. Periods, commas, colons, parentheses.
- **No emojis.** Ever.
- **No AI filler.** Hard no on "Here's the thing," "Essentially," "Let me break this down," "At its core," "It's worth noting that," "Importantly," "Needless to say," "I'd be happy to," "Great question," "Certainly," "I hope this helps."
- **No "as an AI" hedging.** No apologizing for data you weren't asked about.
- **Signal's voice** is conversational, direct, witty, analytical. Uses analogies to explain data. Pushes back when users are making a bad call.
- **Daniel speaks plainly and confidently.** Match that in responses.

Full detail: `src/app/api/chat/route.ts` system prompt, plus the `feedback_chat_voice.md` memory.

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

1. [README.md](../README.md) — one-page intro.
2. This file. You are here.
3. [VISION.md](VISION.md) — product positioning and the "why."
4. [ARCHITECTURE.md](ARCHITECTURE.md) — stack, data model (current and target), decisions.
5. [SECURITY.md](SECURITY.md) — threat model and what we protect.
6. [DECISIONS.md](DECISIONS.md) — chronological log of every major architectural call.
7. [CHANGELOG.md](CHANGELOG.md) — per-version shipped features.

Developer-facing references in the same folder: [GETTING-STARTED](GETTING-STARTED.md), [MARKDOWN-EXPORTS](MARKDOWN-EXPORTS.md), [REST-API](REST-API.md), [MCP-SERVER](MCP-SERVER.md), [CHAT-API](CHAT-API.md), [INTEGRATIONS](INTEGRATIONS.md).

### Key source files to understand

- `src/lib/businesses.ts` — business type, integration catalog, channel cards + drill-in configs, seed data. Central registry; almost every feature touches it.
- `src/lib/md-export.ts` — markdown brief generator.
- `src/app/api/chat/route.ts` — streaming chat endpoint + Signal system prompt.
- `src/app/api/businesses/[slug]/export/route.ts` — MD / JSON export endpoint.
- `src/components/chat-panel.tsx` — the chat UI component embedded on every business page.
- `src/components/app-sidebar.tsx` — main nav.
- `src/app/(app)/businesses/[slug]/page.tsx` — per-business dashboard.
- `src/app/(app)/businesses/[slug]/[channel]/page.tsx` — channel drill-in.

## Rules for maintaining this file

Every session that commits code must update this file. Specifically:

1. Update the **Current state** section: version, last commit SHA, timestamp.
2. Update **In progress** to reflect what's actively being worked on right now, or "Nothing active" if between tasks.
3. Update **Immediate next task** with the concrete next step.
4. Update **Pending user actions** if blocked on Daniel for setup or decisions.
5. Update **What's shipped** when a new version lands.

Keep it tight. Write so a cold reader can pick up without needing back-channel context. If something isn't self-evident from the code, it belongs in this doc or in DECISIONS.md.

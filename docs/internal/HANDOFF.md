# Handoff

Read this first if you are a new session, a different LLM (Codex, Gemini, another Claude), or a human picking up this project after a break. Everything you need to continue is here or linked.

**This file is intentionally NOT rendered in the public `/docs` site.** It lives at `docs/internal/HANDOFF.md` along with ARCHITECTURE and DECISIONS. Only Cesar Augustus and contributors see it. Keep it that way.

## What this is

CQ Signal is a marketing reporting and analytics platform built AI-first. It gives business owners and agency operators a clean dashboard for their marketing performance, plus the ability to export every view as a Markdown brief or query it via a (coming) MCP server, so their own AI agents can analyze the data directly.

**Owner:** Cesar Augustus. Runs [Creative Quality Marketing](https://creativequalitymarketing.com) (CQ). Building this for his agency's internal use first, then SaaS later.

**Live:** [cq-signal-app.vercel.app](https://cq-signal-app.vercel.app)
**Repo:** [github.com/cqdesignsny/cq-signal-app](https://github.com/cqdesignsny/cq-signal-app)
**Local working directory:** `/Volumes/CQ-PRO-4TB/Admin/CQ Reporting App/cq-signal`

## Current state

**Version:** v0.16.0 (card cleanup + Compare toggle + DB-backed manual data + Typeform name fix + sidebar collapse fix; pending commit)
**Last committed version:** v0.15.0 (dashboard polish + functional Share menu + connect flow + Profile persistence + theme toggle)
**Last updated:** 2026-04-24

The app is a Next.js 16 App Router site deployed to Vercel. Pushed to GitHub `main` auto-deploys. Local dev is `pnpm dev` from the `cq-signal/` directory. Dev server listens at `http://localhost:3000`.

What's live:
- Full marketing landing page at `/`
- Clerk auth end-to-end with local `/sign-in` + `/sign-up`
- Neon Postgres with 8 tables applied (workspaces, users, businesses, integrations, integration_credentials, metrics_raw, leads, reports)
- AES-256-GCM credential encryption via `CQ_SIGNAL_SECRET`
- Streaming Signal chat with analyst-voice system prompt
- Markdown export endpoint for every business
- **GA4 integration** via OAuth refresh token (`src/lib/integrations/ga4.ts`)
- **Typeform integration** via Personal Access Token (`src/lib/integrations/typeform.ts`)
- **Report system** (`src/lib/reports/generate.ts`) that fetches live GA4 + Typeform across all 4 ranges, stores snapshot in DB, returns share URL
- **Public report view** at `/reports/[token]` with range toggle (7d / 30d / 90d / 1y) that switches the rendered data in place
- **SVG / PNG / JPEG logos** supported via `next.config.ts` `dangerouslyAllowSVG` + CSP sandbox
- **HVOF's real April MTD report** generated with live GA4 + Typeform + manual channels (Meta Ads, FB, IG, LinkedIn, Omnisend). Latest share token and URL in DB; regenerate via `pnpm generate:hvof`.

What's still hardcoded:
- Business metadata on `/app/businesses/[slug]` (name, tagline, vertical, integrations list) still reads from `src/lib/businesses.ts` seed, not from the DB. The live metrics come from GA4 + Typeform; the biographic fields are seeded.
- Meta Ads / FB / IG / LinkedIn / Omnisend still render from hardcoded channel-card placeholders on the business page (there's no manual-data override yet for the dashboard the way there is for the report). Live integrations will replace them.
- "Add business" flow still a placeholder.

## In progress

Nothing active. v0.14.0 changes are on disk, ready to commit.

## Immediate next task

1. **Add a credit card to the Vercel team** so the AI Gateway stops returning 403. Without it, the Signal recommendations on the dashboard and on every report render the empty-state fallback. Chat is also affected. Once the card lands, no code changes needed.
2. **React PDF template.** Build `src/components/pdf/report-document.tsx` using `@react-pdf/renderer` with a clean PDF-native layout (Document → Page → View → Text primitives) that mirrors the report sections (header, summary, traffic overview, leads, social, recommendations, footer) using brand-tinted colors. Wire `/api/reports/[token]/pdf` route to render and stream the PDF. Replace the current `?print=1` interim with a real download.
3. **Vercel Blob logo upload.** Hook the "Upload to Vercel Blob" button on the profile form to a Server Action that takes a `File`, uploads to Blob via `BLOB_READ_WRITE_TOKEN`, returns the public URL, and fills the logoUrl field. Existing paste-URL flow stays as a fallback.
4. **Resend for "Email to client."** Add `RESEND_API_KEY` env var. Build `src/lib/integrations/resend.ts` with a `sendReportEmail({to, businessName, shareUrl})` helper. Wire to a Server Action behind a small dialog asking for recipient + optional message. The Email button in the Share menu becomes functional.
5. **In-app manual-data editor.** Right now editing manual values requires touching `src/lib/manual-data.ts`. Build a per-channel form on `/app/businesses/[slug]/connect/[integration]` that writes to a new DB table (`manual_channel_data` keyed by business + integration) so non-developer Cesar can update HVOF's FB/IG/LinkedIn/Omnisend numbers from the UI.
6. **Screenshot-to-data extraction.** The cool feature Cesar floated. Use Claude vision (private detail) to extract structured channel metrics from an uploaded screenshot, prefill the manual-data form. Save user the typing.
7. **Wire Google Ads API** as the next live integration. HVOF runs Google Ads (~17% of traffic is Paid Search). Build `src/lib/integrations/google-ads.ts` using the existing Google OAuth refresh token with `adwords` scope.
8. Then Search Console, Meta, LinkedIn, Omnisend live. Each follows the same pattern as GA4/Typeform.
9. Later: PageSpeed Insights (Core Web Vitals), GA4 audience extension, MCP server, REST API keys.

## Environment variables

Already set in Vercel (pulled locally with `vercel env pull`):

- `VERCEL_OIDC_TOKEN` — Vercel AI Gateway auth (pulled via `vercel env pull`). **The Vercel team needs a valid credit card on file for Gateway requests to succeed.** Without it, all model calls return 403 `customer_verification_required`. Chat + Signal recommendations on the business page depend on this.
- `DATABASE_URL` — Neon Postgres (from Vercel Marketplace)
- `CQ_SIGNAL_SECRET` — 32-byte base64 AES-256-GCM master key for encrypting OAuth tokens at rest
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_APP_URL=https://cq-signal-app.vercel.app`
- `HVOF_GA4_PROPERTY_ID` — GA4 property ID for Hudson Valley Office Furniture (currently `477110586`)
- `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` — n8n OAuth client reused for refresh-token flow
- `GOOGLE_OAUTH_REFRESH_TOKEN` — long-lived refresh token from OAuth Playground with `analytics.readonly` scope
- `HVOF_TYPEFORM_FORM_ID` — HVOF's Typeform form ID
- `TYPEFORM_PAT` — HVOF Typeform Personal Access Token (scope: `responses:read`)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (provisioned, not yet used by logo upload UI)

Not yet provisioned:

- Meta (FB Ads + FB Pages + IG Graph) App ID + Secret
- LinkedIn OAuth client
- Omnisend API key
- Klaviyo API key (Advanced Skin Med Spa)
- Shopify App credentials
- HouseCall Pro API credentials (TZ Electric)
- Vercel Blob token (logo uploads)
- Resend API key (email delivery)

## What's shipped

Version history in [../CHANGELOG.md](../CHANGELOG.md). High level:

- **v0.1 to v0.5.** Scaffold, polish, app-like UI, AI-ready markdown exports, docs foundation and security baseline.
- **v0.5.1 to v0.5.5.** Handoff doc created, public/internal docs split, 30 percent font bump, interactive polish, Getting Started mission-forward rewrite, full agency name everywhere.
- **v0.6.0.** Drizzle + Neon + AES-256-GCM credential encryption.
- **v0.7.0.** Clerk v7 auth end-to-end.
- **v0.8.0.** Marketing landing + app moved to `/app/*` segment.
- **v0.8.1.** Light/dark toggle on marketing nav.
- **v0.8.2.** LinkedIn added to HVOF + TZ; friendly source labels with descriptions on channel cards.
- **v0.9.0.** Real GA4 integration with OAuth refresh token. HVOF's live sessions, top pages, traffic sources fetching cleanly.
- **v0.9.1.** Typeform integration live with period comparison. HVOF's form-based leads pulling through with name/email extraction.
- **v0.10.0.** Report system shipped. `generateReport()` fetches GA4 + Typeform + manual channels, stores a versioned snapshot in the `reports` table, generates a 32-char hex share token, returns share URL. Public `/reports/[token]` page renders the snapshot. `scripts/generate-hvof-report.ts` triggers the pipeline offline via `pnpm generate:hvof`. HVOF's first real April MTD report generated and shared.
- **v0.11.0.** Report snapshot upgraded to v2 schema with `ranges: Record<ReportRangeKey, ReportRangeData>` holding all four (7d / 30d / 90d / 1y) pre-fetched ranges. New client component `<ReportRangeTabs>` mirrors the dashboard's tabs on the public report. Switches via `?range=` query param wrapped in `useTransition` + `router.push`. Manual channels render regardless of range. Business logo now supports SVG (via `dangerouslyAllowSVG` with CSP sandbox on image-optimized responses, and we render business logos as plain `<img>` to avoid the optimizer). `businessProfile` field on `GenerateReportInput` persists `logoUrl` and `brandColor` onto the `businesses` row so reports inherit them.
- **v0.12.0.** Business dashboard at `/app/businesses/[slug]` now pulls live GA4 + Typeform snapshots server-side via `fetchRangeData()`. Cards show real sessions, top source, top landing, avg session duration, and lead counts with period-over-period deltas. Live-data cards get a "Live" pulse badge. Range toggle reuses `<ReportRangeTabs>` and is URL-synced. New `<SignalRecommendations>` async server component calls Claude via `generateText` + `Output.object()` with a zod schema to return 2 or 3 prescriptive, data-grounded action items with priority labels. Shared snapshot helper extracted to `src/lib/reports/snapshot.ts` so the report generator and the dashboard share the exact same fetch logic.
- **v0.13.0.** Public `/reports/[token]` rewritten to match the proven HVOF email-report design (`hvof-weekly-report-SAMPLE.html` from the Dropbox archive). Same section order. New `src/components/report/` primitive library. GA4 snapshot extended with `channelBreakdown` and `dailySessions`. Empty states for sections needing integrations not yet wired.
- **v0.14.0.** Report aesthetic dropped the email-template look for the app's premium editorial feel. Dashboard upgrade: red Create Report CTA, recommendations on top, TrafficOverviewCard Site Kit-style hero, manual-data overlay populating HVOF channels, Report history at bottom. Channel drill-ins: GA4 Site Kit-style + Typeform lead list. Google Ads + Google LSA added as first-class integrations.
- **v0.15.0.** Stripped all user-facing "Claude" mentions. Range tabs + section header moved above Traffic Overview. Live badge on TrafficOverviewCard. Per-card `<CardManageAction>` + dashed `<AddFeedTile>` + connect placeholder pages. Create Report opens in a new tab. Share Report functional (Copy link + print-view PDF). Theme toggle on the report. Edit Profile persists via Server Action. Typeform table reshaped (Date / Name / Company / What they need / Status).
- **v0.16.0** (pending commit). Punch-list pass on top of v0.15.0. (a) Create Report no longer refreshes the dashboard. (b) `CardManageAction` now always visible inline next to the status pill; dropped the colliding `ArrowUpRight`. (c) Compare-vs-prev toggle restored on `<ReportRangeTabs>` via `showCompareToggle`; persists with `?compare=off` in the URL. (d) "X days at a glance" subtitle pretty-formats dates as "Month Day, Year". (e) `AppSidebar` uses `useSidebar()` so the CQ Signal logo and footer text drop when the sidebar collapses to icon mode. (f) Typeform extractor: new `fetchFieldTitleMap(formId)` pulls form definition and maps field IDs/refs to human titles ("First name", "Company"); extractor combines `firstName + lastName` into `name` ("Patricia Rothberg"); falls back to single `name` field; Company / Email / Phone now match against title OR key. (g) DB-backed manual data: new `manual_channel_data` table (migration 0001 applied), Server Actions `saveManualChannelData` / `clearManualChannelData`, `getManualCard` is now async and DB-first. New `<ManualChannelForm>` editor on the connect/[integration] page lets Cesar enter headline metric + up to 4 secondary stats + notes; Clear button when data exists; honest "Drop a screenshot (coming next)" stub for the future vision flow.

## Key decisions and constraints

Short list. Full context in [DECISIONS.md](DECISIONS.md).

- **Stack:** Next.js 16 + TypeScript strict + Tailwind v4 + shadcn on Radix. Claude Sonnet 4.6 via AI Gateway model strings.
- **Language:** "business" throughout, never "client."
- **Project lives at `cq-signal/` subdirectory** of the workspace folder.
- **Markdown-first exports.** Every data surface must produce a markdown brief.
- **Mobile-port readiness from day one.** Clean API / data boundary so a future React Native app is a weeks-long project.
- **BYO API key pattern planned.** So future SaaS customers can bring their own keys.
- **Public vs internal docs split.** Public at `/docs`, internal at `docs/internal/`.
- **Offline report generation via tsx scripts.** Auth-gated API routes get bypassed for HVOF-specific one-offs by calling `generateReport()` directly in `scripts/*.ts` run via `dotenv -e .env.local -- tsx`.
- **`server-only` import removed** from modules that need to run in both the Next runtime and standalone tsx scripts (`src/lib/db/client.ts`, `src/lib/integrations/ga4.ts`, `src/lib/integrations/typeform.ts`, `src/lib/reports/generate.ts`). Still present in `src/lib/crypto.ts` because crypto is server-only no matter what.

## Voice and style rules

Critical to apply at every AI-producing surface (chat, briefs, PDF narratives, email content):

- No em dashes. Ever.
- No emojis. Ever.
- No AI filler phrases.
- No "as an AI" hedging.
- Signal's voice is conversational, direct, witty, analytical. Uses analogies. Pushes back when users are making a bad call.
- Cesar Augustus speaks plainly and confidently. Match that.

Full detail: `src/app/api/chat/route.ts` system prompt, plus `feedback_chat_voice.md` memory.

## Developer orientation

### Clone and run

```bash
git clone https://github.com/cqdesignsny/cq-signal-app.git
cd cq-signal-app
pnpm install
vercel env pull .env.local   # if you have access to the Vercel project
pnpm dev
```

### Generate HVOF's report

```bash
pnpm generate:hvof
# prints share token + share URL + a quick peek at live data
```

### Directory to walk first

1. [../../README.md](../../README.md) — one-page intro.
2. This file. You are here.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — stack, data model, decisions.
4. [DECISIONS.md](DECISIONS.md) — chronological log of every major architectural call.
5. Public docs under `docs/`: GETTING-STARTED, VISION, SECURITY, CHANGELOG, developer refs.

### Key source files to understand

- `src/lib/businesses.ts` — business type, integration catalog, channel cards, seed data.
- `src/lib/integrations/ga4.ts` — GA4 Data API fetcher.
- `src/lib/integrations/typeform.ts` — Typeform Responses API fetcher.
- `src/lib/reports/snapshot.ts` — shared `fetchRangeData(slug, key)` + `fetchAllRanges(slug)` helpers. Both the report generator and the in-app dashboard call these.
- `src/lib/reports/recommendations.ts` — Claude-powered `generateRecommendations()` returning 2 or 3 prescriptive action items with zod-typed output.
- `src/lib/reports/generate.ts` — report pipeline (fetch via shared helper + snapshot v2 + persist + share token).
- `src/app/reports/[token]/page.tsx` — public report page, range-aware via `?range=`. Composes `src/components/report/*` primitives in the HVOF email-template section order.
- `src/components/report/` — full primitive library for the report page (header, section nav, section card, sub-card, metric grid, hero metric, channel donut, trend chart, data table, lead status badge, campaign highlight, social split, core web vitals, recommendations list, footer, empty state, print button). All restyled in v0.14.0 to match the app's editorial feel.
- `src/components/traffic-overview-card.tsx` — Site Kit-style hero. All Visitors number + delta + sparkline + channel donut. Used on the business dashboard and the GA4 channel drill-in.
- `src/components/create-report-button.tsx` (client) — red primary button that posts to a Server Action.
- `src/components/report-history.tsx` — server component that lists the last 10 generated reports for a business.
- `src/lib/manual-data.ts` — per-business overlay of channel → manual values; fallback for cards before the API integration ships.
- `src/app/app/businesses/[slug]/actions.ts` — `createReportForBusiness` Server Action.
- `src/app/app/businesses/[slug]/page.tsx` — signed-in business dashboard. Fetches live data each render.
- `src/components/report-range-tabs.tsx` — the URL-synced toggle, reused on report page and business dashboard.
- `src/components/signal-recommendations.tsx` — async server component that renders Claude's recommendations with priority badges and expected-outcome lines.
- `scripts/generate-hvof-report.ts` — one-off HVOF report generator.
- `scripts/test-recommendations.ts` — dev utility to exercise the recommendations pipeline end-to-end.
- `src/lib/md-export.ts` — markdown brief generator.
- `src/lib/docs.ts` + `src/lib/docs-server.ts` — public docs registry.
- `src/app/api/chat/route.ts` — streaming chat endpoint + Signal system prompt.
- `src/components/chat-panel.tsx` — chat UI embedded on every business page.
- `src/components/app-sidebar.tsx` — main nav.
- `src/app/globals.css` — theme tokens, gradient, glass, card-lift utility.
- `src/app/app/businesses/[slug]/page.tsx` — per-business dashboard (still hardcoded; next task wires live data).
- `src/app/app/businesses/[slug]/[channel]/page.tsx` — channel drill-in.
- `src/app/app/insights/page.tsx` — portfolio-level insights (placeholder shape).
- `src/proxy.ts` — Clerk middleware with route matcher.
- `next.config.ts` — security headers + SVG allow + remote image patterns.

## Rules for maintaining this file

Every session that commits code must update this file:

1. Update **Current state**: version, last commit SHA, timestamp.
2. Update **In progress** with what's actively being worked on or "Nothing active" if between tasks.
3. Update **Immediate next task** with the concrete next step.
4. Update **Environment variables** if a new one lands.
5. Update **What's shipped** when a new version lands.

Keep it tight. Write so a cold reader can pick up without needing back-channel context.

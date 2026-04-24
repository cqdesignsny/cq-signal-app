# Changelog

## v0.11.0 · 2026-04-23 · Range toggle on reports + SVG logo support

- Report snapshot upgraded to v2 schema. `generateReport()` now fetches all four ranges (7d, 30d, 90d, 1y) in parallel and stores them under `snapshot.ranges[key]` with pre-computed `range` and `priorRange` date windows. `snapshot.primaryRange` picks the default tab.
- New `<ReportRangeTabs>` client component lives in the public report header and mirrors the dashboard's tab shape. Switches via `?range=` query param wrapped in `useTransition` + `router.push({ scroll: false })`. Omits the param when it equals the default range.
- Public `/reports/[token]` page accepts `searchParams` (async), resolves the active range, and renders `ranges[activeRange].ga4` and `ranges[activeRange].typeform`. Manual channels render regardless of range. `export const dynamic = "force-dynamic"` so the toggle re-renders server-side on each switch.
- SVG logo support. `next.config.ts` enables `dangerouslyAllowSVG` with a CSP sandbox `default-src 'self'; script-src 'none'; sandbox;` on image-optimized responses. Business logos render as plain `<img>` on the report to sidestep the optimizer entirely for SVGs. HVOF now uses its 2025 SVG logo.
- `GenerateReportInput.businessProfile` persists `logoUrl`, `brandColor`, `tagline`, and `vertical` onto the `businesses` row so the snapshot inherits the latest brand values at generation time.
- `server-only` removed from `src/lib/reports/generate.ts`, `src/lib/db/client.ts`, `src/lib/integrations/ga4.ts`, and `src/lib/integrations/typeform.ts` so `pnpm generate:hvof` can run them from tsx. Crypto module stays `server-only`.

## v0.10.0 · 2026-04-23 · Report system + HVOF's first generated report

- Report pipeline lives at `src/lib/reports/generate.ts`. `generateReport({ businessSlug, primaryRange, narrative, manualChannels, businessProfile })` ensures the workspace + business rows exist, fetches live GA4 + Typeform data, merges in manual channels, generates a 32-char hex share token, inserts into `reports`, and returns `{ reportId, shareToken, shareUrl, snapshot }`.
- Public `/reports/[token]` page reads the snapshot from DB and renders the full report: business header with logo, primary narrative, GA4 block (sessions vs prior, top landing pages, top traffic sources), Typeform block (lead list with names and emails extracted from flexible answer structures), manual channel cards (Meta Ads, FB, IG, LinkedIn, Omnisend) with notes explaining what's manual vs live.
- `scripts/generate-hvof-report.ts` bundles all HVOF manual data (April 2026 MTD), a narrative written in Signal's voice, and the business profile (logo, brand color). `pnpm generate:hvof` runs it via `dotenv -e .env.local -- tsx` so the DB and integrations tick without needing the API routes' Clerk auth wall.
- `/api/reports/generate` route handler wraps the same pipeline for when we want to trigger from the UI.

## v0.9.1 · 2026-04-23 · Typeform integration live

- `src/lib/integrations/typeform.ts` hits the Typeform Responses API using a Personal Access Token. Exports `fetchTypeformSnapshot(formId, startDate, endDate)` that returns total leads with period-over-period delta, a list of recent leads with name/email/phone extracted from flexible `answers[]` structures (matches on type, then `field.ref`, then falls back to regex on free text), and last-submitted timestamp.
- Period comparison computed from the same range length shifted back one period.
- HVOF's live leads pulling through cleanly with names and emails attached.

## v0.9.0 · 2026-04-23 · Real GA4 integration with OAuth refresh token

- `src/lib/integrations/ga4.ts` is a zero-dependency OAuth2 refresh-token flow. Exchanges `GOOGLE_GA4_REFRESH_TOKEN` for a short-lived access token at `oauth2.googleapis.com/token`, then hits `analyticsdata.googleapis.com/v1beta/properties/{id}:runReport` with `fetch`. No `googleapis` package, no service account key.
- Exports `fetchGA4Snapshot(propertyId, startDate, endDate)` returning sessions + users + pageviews with period-over-period delta, top landing pages by entries, top traffic sources by sessions.
- Pivoted from service account after `iam.disableServiceAccountKeyCreation` org policy blocked key generation. OAuth Playground flow produced a long-lived refresh token against the existing n8n Google OAuth client.
- HVOF's live sessions, top landing pages, traffic sources all reading cleanly.

## v0.8.2 · 2026-04-23 · LinkedIn + friendly source labels

- LinkedIn added to the integration catalog and wired for HVOF + TZ Electric.
- Each channel card gets an optional `sourceDescription` (e.g., "Website analytics (GA4)", "Facebook + Instagram paid ads") rendered under the source label so non-technical readers understand what each tile represents.

## v0.8.1 · 2026-04-23 · Light/dark toggle on marketing nav

- Theme toggle moved into the marketing-page sticky nav so visitors can preview the app in light or dark before signing in.

## v0.8.0 · 2026-04-23 · Marketing landing + app moved to /app/*

- New marketing landing page at `/` (public). Sticky glass nav with logo and Sign in / Get started CTAs; hero with editorial headline and brand-tagged chip; problem section; how-it-works four-card grid; seven differentiator cards; mission section with warm brand gradient overlay and Cesar's story in first person linking to [Creative Quality Marketing](https://creativequalitymarketing.com); final CTA; footer with nav anchors and sign-in link.
- Signed-in app moved from the `(app)` route group to the `/app/*` segment. All internal links bulk-updated to the new paths. Docs markdown cross-links updated to `/app/docs/*`.
- `proxy.ts` rewritten: protect `/app/*`, `/api/businesses/*`, `/api/chat/*`. Marketing, sign-in, sign-up stay public.
- `ClerkProvider` redirects signed-in and signed-up users to `/app` instead of `/`.
- `scroll-behavior: smooth` on `html` for anchor nav.

Verified locally: `/` returns 200 marketing; `/sign-in` returns 200 Clerk widget; `/app`, `/app/businesses/*`, `/app/docs` return 307 to `/sign-in`.

## v0.7.0 · 2026-04-23 · Clerk authentication

- Clerk v7 wired end-to-end following Next.js 16 conventions: `proxy.ts` at `src/proxy.ts` with `clerkMiddleware` and a route matcher that protects everything except `/sign-in/*` and `/sign-up/*`.
- `ClerkProvider` inside `<body>` in the root layout with `signInUrl` / `signUpUrl` set to our local pages.
- `src/app/sign-in/[[...sign-in]]/page.tsx` and `sign-up` equivalent, both styled with the CQ Signal logo above and the warm-gradient background inherited from global styles.
- `UserButton` from `@clerk/nextjs` in the top-bar for sign-out and account management.
- `src/lib/auth.ts` with `getOrCreateUser` helper. First sign-in auto-creates the CQ workspace and user record in Neon. First user in a workspace gets the `owner` role; everyone after is a `member`.
- Env vars pushed to Vercel across Production / Preview / Development: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `CQ_SIGNAL_SECRET`.
- Verified: unauthenticated requests to `/` or any protected route return a 307 redirect to `/sign-in?redirect_url=...`, and `/sign-in` itself renders Clerk's widget.

## v0.6.0 · 2026-04-23 · Database schema + credential encryption

- Drizzle ORM + `@neondatabase/serverless` + `drizzle-kit` installed.
- `src/lib/db/schema.ts` defines 8 tables: workspaces, users, businesses, integrations, integration_credentials (encrypted), metrics_raw, leads (with encrypted PII), reports. Indexes and cascade-delete foreign keys where appropriate.
- First migration generated at `drizzle/0000_previous_vulture.sql` and applied to Neon. All tables live.
- `src/lib/db/client.ts` with the Neon HTTP driver, `server-only` imported.
- `db:push`, `db:generate`, `db:migrate`, `db:studio` scripts in `package.json`, all wrapped with `dotenv-cli` for `.env.local` loading.
- `src/lib/crypto.ts` for AES-256-GCM authenticated encryption of OAuth tokens and API keys at rest. Random 12-byte IV per encryption, 16-byte auth tag, base64 payload. `encrypt` / `decrypt` / `encryptJson` / `decryptJson` helpers.
- `CQ_SIGNAL_SECRET` env var holds the 32-byte master key (base64).

## v0.5.5 · 2026-04-23 · Full agency name with link on first mention

- Every public-facing first mention of the agency now uses "Creative Quality Marketing" (linked to https://creativequalitymarketing.com) with "CQ" introduced as shorthand. Real-agency credibility signal for readers. Covers README, Vision, Getting Started, and the internal Handoff. Internal short-form references remain "CQ" after the first mention.

## v0.5.4 · 2026-04-23 · Why CQ Signal is different

- New section added to Getting Started: "Why CQ Signal is different." Seven concrete differentiators vs existing business data tools: AI-native architecture, data portability, prescriptive analysis, business-owner framing (not agency-only), white-label included, honesty about limitations, modern design. Sits between the mission and the technical setup.

## v0.5.3 · 2026-04-23 · Mission-forward Getting Started and Vision

- Getting Started rewritten as the welcoming entry point for new readers. Adds sections: What CQ Signal is, How it works, Who it is for, Best use cases, and Our mission and why we built this. The mission section is Cesar Augustus's story in first person, matching the voice he uses when introducing the product.
- Vision gets a new Mission statement and a Why this exists section at the top, so strategic readers see the purpose before the positioning analysis.
- Both docs now cross-link cleanly so the human path (Getting Started) and the strategic path (Vision) complement each other.

## v0.5.2 · 2026-04-23 · Docs split, font bump, interactive polish

- **Public vs internal docs split.** Public docs (Getting Started, Vision, Markdown Exports, REST API, MCP Server, Chat API, Integrations, Security, Changelog) render in the in-app `/docs` site. Internal docs (Handoff, Architecture, Decisions) moved to `docs/internal/` and are not rendered or linked from the public UI. They stay in the repo for Cesar Augustus and any contributor picking up the project.
- **Font sizes bumped 30% for readability.** Docs content: body text `text-lg`, headings stepped up, code and tables larger. Docs sub-nav items bumped. Main sidebar nav items given `h-10` and `text-base`, business list items `text-[15px]`, icon sizes up slightly.
- **Interactive card lifts.** New `.card-lift` utility: cards lift 4px on hover with a brand-tinted shadow bloom and a 2px brand ring. Accent colors shift from muted to brand on hover. Press state snaps back in 120ms.
- **Themed scrollbars.** Brand-tinted on hover, thin, rounded. Works on Firefox (`scrollbar-color`) and WebKit.
- **Brand selection and focus rings.** Text selection uses brand-red alpha. Keyboard focus shows a brand outline.
- **Link underline animation utility.** `.link-underline` class for animated underline effects where we want them.

## v0.5.1 · 2026-04-23 · Handoff doc and Insights restored

- Handoff doc at `docs/HANDOFF.md` (later moved to `docs/internal/HANDOFF.md` in v0.5.2).
- Insights restored as a real placeholder page at `/insights`.
- Main sidebar restored to Overview, Insights, Docs, Settings.

## v0.5 · 2026-04-23 · Docs foundation and security baseline

- Full documentation set: README, VISION, ARCHITECTURE, SECURITY, DECISIONS, CHANGELOG, plus developer refs GETTING-STARTED, MARKDOWN-EXPORTS, REST-API, MCP-SERVER, CHAT-API, INTEGRATIONS.
- In-app `/docs` site rendering the same markdown with react-markdown and remark-gfm. Sub-sidebar with section grouping.
- Security headers configured in `next.config.ts`: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Chat system prompt rewritten to Signal's voice: conversational, witty, analogy-heavy, pushes back, zero AI slop.

## v0.4 · 2026-04-23 · AI-ready

- Upgraded Signal chat to analyst voice.
- Markdown export endpoint: `/api/businesses/[slug]/export?format=md&range=7d|1m|3m|1y`.
- Export for AI dropdown on every business page.
- Agents & AI settings page documenting markdown briefs, REST API (preview), MCP server (coming).
- LinkedIn and TikTok added to the integration catalog.

## v0.3 · 2026-04-23 · App-like polish

- Theme-aware gradient background.
- Glass utility for top bar and hero surfaces.
- Theme toggle moved to sidebar footer as a segmented control.
- Meta split into Meta Ads, Facebook (organic), Instagram (organic).
- Channel-based hero cards with primary and secondary metrics.
- Channel drill-in pages at `/businesses/[slug]/[channel]`.
- Time range tabs with compare-vs-prior toggle.
- Share Report dropdown.
- Business profile editor skeleton.

## v0.2 · 2026-04-23 · Polish pass

- Logo auto-cropped to tight bounds and a dark-mode variant generated.
- PNGs optimized from 1.4MB to ~34KB each.
- Typography scaled up 30 to 50 percent across display and metric surfaces.
- TZ Electric: HouseCall Pro integration added.
- Fixed logo filename case for Linux filesystem compatibility on Vercel.

## v0.1 · 2026-04-23 · Scaffold

- Next.js 16 App Router, TypeScript strict, Tailwind v4, React Compiler.
- shadcn/ui on Radix, custom CQ Signal theme.
- Geist Sans + Geist Mono + Instrument Serif.
- App shell: collapsible sidebar, top bar, responsive layout.
- Pages: overview, business detail, add-business placeholder, settings.
- Ask Signal: streaming chat via AI SDK v6 + Claude Sonnet 4.6.
- Seeded businesses: Hudson Valley Office Furniture, TZ Electric, Level Aesthetics, Advanced Skin Med Spa, Wrecktified Paint and Collision.
- Deployed to cq-signal-app.vercel.app, auto-deploying from github.com/cqdesignsny/cq-signal-app.

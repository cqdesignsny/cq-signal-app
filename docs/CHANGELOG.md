# Changelog

## v0.5.1 · 2026-04-23 · Handoff doc and Insights restored

- **Handoff doc** at [docs/HANDOFF.md](HANDOFF.md). Single source of truth for any new session, LLM, or contributor picking up the project. Kept up to date at every commit per the explicit maintenance rule.
- Insights restored as a real placeholder page at `/insights`. Designed, not a dead link. Shows the shape of future weekly briefs, anomaly alerts, cross-business signals, and the brief archive.
- Main sidebar restored to four nav items: Overview, Insights, Docs, Settings.
- README and in-app docs index both link HANDOFF first.

## v0.5 · 2026-04-23 · Docs foundation and security baseline

- Full documentation set: [README](../README.md), [VISION](VISION.md), [ARCHITECTURE](ARCHITECTURE.md), [SECURITY](SECURITY.md), [DECISIONS](DECISIONS.md), this changelog, plus developer refs GETTING-STARTED, MARKDOWN-EXPORTS, REST-API, MCP-SERVER, CHAT-API, INTEGRATIONS.
- In-app `/docs` site rendering the same markdown with react-markdown + remark-gfm. Sub-sidebar with section grouping.
- Security headers configured in `next.config.ts`: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Chat system prompt rewritten to Signal's voice: conversational, witty, analogy-heavy, pushes back, zero AI slop. No em dashes, no emojis, no filler.

## v0.4 · 2026-04-23 · AI-ready

- Upgraded Signal chat to analyst voice.
- New markdown export endpoint: `/api/businesses/[slug]/export?format=md&range=7d|1m|3m|1y`.
- Export for AI dropdown on every business page (download, copy to clipboard, connect agent).
- Agents & AI settings page documenting markdown briefs, REST API (preview), MCP server (coming).
- LinkedIn and TikTok added to the integration catalog with drill-in structures.

## v0.3 · 2026-04-23 · App-like polish

- Theme-aware gradient background (warm brand and signal glows).
- Glass utility for top bar and hero surfaces.
- Theme toggle moved to sidebar footer as a segmented control.
- Meta split into Meta Ads, Facebook (organic), Instagram (organic).
- Channel-based hero cards with primary + secondary metrics.
- Channel drill-in pages at `/businesses/[slug]/[channel]`.
- Time range tabs (7d / 1m / 3m / 1y + compare vs prior).
- Share Report dropdown (PDF, Email, Link marked Soon).
- Business profile editor skeleton at `/businesses/[slug]/profile`.

## v0.2 · 2026-04-23 · Polish pass

- Logo auto-cropped to tight bounds. Generated a dark-mode variant.
- Optimized PNGs from 1.4MB to ~34KB each.
- Typography scaled up 30 to 50 percent across display and metric surfaces.
- TZ Electric: HouseCall Pro integration added.
- Fixed logo filename case for Linux filesystem compatibility on Vercel.

## v0.1 · 2026-04-23 · Scaffold

- Next.js 16 App Router, TypeScript strict, Tailwind v4, React Compiler.
- shadcn/ui on Radix, custom CQ Signal theme (warm paper, ink, brand red, signal amber).
- Geist Sans + Geist Mono + Instrument Serif.
- App shell: collapsible sidebar, top bar, responsive layout.
- Pages: overview, business detail, add-business placeholder, settings.
- Ask Signal: streaming chat via AI SDK v6 + Claude Sonnet 4.6.
- Seeded businesses: Hudson Valley Office Furniture, TZ Electric, Level Aesthetics, Advanced Skin Med Spa, Wrecktified Paint and Collision.
- Deployed: cq-signal-app.vercel.app, auto-deploying from github.com/cqdesignsny/cq-signal-app.

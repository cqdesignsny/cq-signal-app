# Changelog

## v0.5.3 · 2026-04-23 · Mission-forward Getting Started and Vision

- Getting Started rewritten as the welcoming entry point for new readers. Adds sections: What CQ Signal is, How it works, Who it is for, Best use cases, and Our mission and why we built this. The mission section is Daniel's story in first person, matching the voice he uses when introducing the product.
- Vision gets a new Mission statement and a Why this exists section at the top, so strategic readers see the purpose before the positioning analysis.
- Both docs now cross-link cleanly so the human path (Getting Started) and the strategic path (Vision) complement each other.

## v0.5.2 · 2026-04-23 · Docs split, font bump, interactive polish

- **Public vs internal docs split.** Public docs (Getting Started, Vision, Markdown Exports, REST API, MCP Server, Chat API, Integrations, Security, Changelog) render in the in-app `/docs` site. Internal docs (Handoff, Architecture, Decisions) moved to `docs/internal/` and are not rendered or linked from the public UI. They stay in the repo for Daniel and any contributor picking up the project.
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

# Decision log

Chronological log of key decisions made while building CQ Signal. Each entry captures the decision, why it was made, and important context. Future-us can use this to understand why things are the way they are.

## 2026-04-23 · Project kickoff

**Decision:** Build CQ Signal as an internal marketing reporting tool for CQ clients, architected for eventual SaaS.

**Why:** CQ needs better reporting across GA4, Google Ads, Meta, Shopify, Klaviyo, Omnisend than existing tools provide. Competing against AgencyAnalytics and Whatagraph on the dashboard front is a losing battle. Their AI layer is weak, and neither lets users plug data into their own LLMs. That's the opening.

**Context:** Competitive research identified five exploitable weaknesses in AgencyAnalytics: data freshness, custom metrics, prescriptive AI, pricing cliffs, no portfolio view for agencies.

## 2026-04-23 · Name: CQ Signal

**Decision:** Working name is CQ Signal.

**Why:** Signal over noise. Short, memorable, works as a verb ("Check Signal"). Positions the product as cutting through marketing reporting clutter.

**Alternatives considered:** CQ Pulse, CQ Lens, Plainsight, Northstar.

## 2026-04-23 · "Business" language, not "client"

**Decision:** All product-facing and database language uses "business," not "client."

**Why:** Future SaaS targets business owners who want insights on their own companies (possibly multiple). "Client" boxes the product into agency-first framing. "Business" is universal.

**Impact:** Database table is `businesses`, routes are `/businesses/[slug]`, UI copy is "Add Business."

## 2026-04-23 · Stack: Next.js 16 on Vercel, shadcn/ui on Radix, Claude via AI Gateway

**Decision:** Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui on Radix primitives, AI SDK v6 with model strings routed through Vercel AI Gateway.

**Why:**
- Next.js 16 plus Fluid Compute gives a 300s default timeout, fast cold starts at interactive scale, and React Compiler for free performance.
- Radix (not Base UI) because AI Elements components require Radix, and switching later is expensive.
- Model strings (not direct provider imports) because Gateway's failover and observability are valuable, and swapping models is a one-line change.

## 2026-04-23 · Scaffold in `cq-signal/` subdirectory, not workspace root

**Decision:** Next.js app lives at `CQ Reporting App/cq-signal/`, not the root.

**Why:** The workspace folder name has spaces, which npm rejects as a package name. Using a subdirectory also reserves room for a future mobile app, docs, and design assets at the workspace level.

## 2026-04-23 · AI Gateway model strings over direct Anthropic provider

**Decision:** Use `anthropic/claude-sonnet-4.6` as a model string in `streamText`, not `anthropic("claude-sonnet-4-5-20250929")`.

**Why:** Gateway provides failover, observability, and cost tracking. AI SDK v6 resolves the model string to the appropriate provider automatically. Falls back to direct Anthropic provider locally with `ANTHROPIC_API_KEY`.

## 2026-04-23 · Theme toggle in the sidebar footer, not the top bar

**Decision:** Dark mode toggle is a segmented Light / Dark / System control in the sidebar footer, not a small icon in the top bar.

**Why:** User feedback after v0.2. Sidebar placement is more discoverable and matches where users expect preferences.

## 2026-04-23 · "Meta" split into three integrations

**Decision:** The `meta-organic` integration was split into two: `facebook` (organic page posts and engagement) and `instagram` (organic posts, stories, followers). `meta-ads` stays for paid.

**Why:** Each surface has its own narrative and drill-in structure. Conflating Facebook and Instagram organic hides the story.

## 2026-04-23 · AI-first export design

**Decision:** Every business page exports a markdown brief. Signal will expose an MCP server and REST API for direct agent access.

**Why:** The strongest differentiator vs. AgencyAnalytics is that data flows out to the user's own AI stack. This is the positioning bet.

**Impact:** Markdown brief format, agents settings page, and `/api/businesses/[slug]/export` route built in v0.4. MCP server and per-workspace API keys follow the database layer.

## 2026-04-23 · Chat voice: human analyst, not AI assistant

**Decision:** Signal chat is framed as a professional marketing analyst with a conversational, witty, analogy-friendly voice. Never AI slop. No em dashes. No emojis. No corporate filler.

**Why:** The chat is the front door to the product's intelligence. A generic "helpful AI assistant" voice would undersell every feature and sound like every other chatbot. Signal speaks like a trusted operator, heavy use of analogies, pushes back when users are wrong.

**Impact:** System prompt in `src/app/api/chat/route.ts` encodes these rules. Same rules apply to any future AI-producing surface (scheduled briefs, anomaly alerts, PDF narratives).

## 2026-04-23 · Docs and security posture as first-class concerns

**Decision:** Maintain [README.md](../README.md), [VISION.md](VISION.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), [DECISIONS.md](DECISIONS.md), and [CHANGELOG.md](CHANGELOG.md) in the repo. Security posture treated as ongoing, not a phase.

**Why:** Product handles marketing data, PII, and third-party API tokens. Without explicit documentation, the security posture drifts. Without a decision log, reasons for architectural choices are lost the moment someone new joins or we revisit the code in a few months.

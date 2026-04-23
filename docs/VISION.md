# Vision

## Mission

Give every business owner clear, transparent, actionable visibility on their marketing performance. Built AI-first from day one, so the insight layer and the AI layer are no longer in separate worlds.

## Why this exists

This is a tool built by a business owner to solve his own problem. Daniel runs CQ, a marketing agency managing clients across furniture, electrical, med spa, auto body, and aesthetics verticals. Every week, making sense of client marketing data meant pulling numbers from GA4, Meta, Omnisend, Typeform, Shopify, and a dozen other places. The tools that existed (AgencyAnalytics, Whatagraph, Looker Studio) were fine at putting numbers on a page. None of them helped you think. None of them played cleanly with the AI stack that has changed how marketing actually happens.

CQ Signal is the product that should have existed. An agency owner built it for other agency owners and for the business owners they serve, because the gap between "what the dashboard shows" and "what you should do about it" is where the value lives, and AI is finally good enough to live there.

## The problem

Every marketing reporting tool in the business data world stops at the dashboard. You look at numbers, you close the tab, you move on. The tools were designed before AI was part of anyone's workflow.

Business owners today already talk to Claude, Gemini, ChatGPT, and their own agents about their businesses. To do that, they copy-paste data, screenshot charts, or manually type what a dashboard showed them. The insight layer and the AI layer live in separate worlds.

## Our angle

CQ Signal treats data as an input to AI, not just output to a human.

- **Dashboards for the human.** Clean, editorial, mobile-first, glanceable.
- **Markdown briefs for the LLM.** Every business page exports a ready-to-paste brief with context, metrics, comparisons, and suggested prompts.
- **MCP server for the agent.** (Coming) Claude Code, Gemini CLI, and any MCP-capable agent taps into Signal directly with tools like `get_business_metrics`, `compare_periods`, `get_leads`.
- **REST API plus per-workspace keys for everyone else.** (Coming) Bring your own agent, your own automation.

## Positioning against incumbents

AgencyAnalytics and Whatagraph are dashboard products. They own the human-consumption side of marketing reporting. We're not out-dashboarding them. We're out-integrating them with the AI stack their users already run.

Five exploitable weaknesses in AgencyAnalytics surfaced from research:

1. Data freshness complaints (dropped connections, stale data).
2. Weak custom-metric and data-blending engine.
3. AI features that describe instead of prescribe.
4. Price cliffs and white-label locked to top tier.
5. No way for users to feed data into their own LLMs.

Signal goes at all five.

## Who we build for

1. **Phase 1: CQ internally.** We run our clients' reporting on Signal. Daily driver.
2. **Phase 2: CQ's retainer clients get access.** Included benefit, not a separate SKU.
3. **Phase 3: Business owners at large.** Multi-business owners who want one pane of glass across their companies and can plug their own AI into it.
4. **Phase 4: Agencies.** White-label, multi-workspace, agency-shaped workflows.

## Non-goals

- Competing on raw integration count. 20 integrations that work flawlessly beat 100 that break monthly.
- Social scheduling, content creation, ad platform management. We report and analyze. We don't replace primary tools.
- Human-only export formats. Every export will be AI-consumable.

## Principles

- **AI-ready from day one.** Every data surface must produce a markdown brief or be reachable via MCP / API. Retrofitting later is a tax we don't pay.
- **Mobile-port ready.** Clean frontend / data boundary so a React Native app is a weeks-long project, not a rewrite.
- **Business owners, not just agencies.** Every UI string, route, and schema uses "business" so the product works for both audiences.
- **Defensive security posture.** See [SECURITY.md](SECURITY.md). We handle marketing data, PII, and third-party API tokens. Security is a posture, not a phase.
- **Claude-first, not Claude-only.** Use Claude by default (user preference, best voice for analysis). Architecture supports any provider via AI SDK model strings.

# Getting started

Welcome to CQ Signal. This is the starting point if you are new here, whether you are using Signal for your own business, building with it, or just trying to understand what it is and why it exists.

## What CQ Signal is

CQ Signal is marketing reporting and business analytics for people who want clarity, not spreadsheet anxiety.

It connects to the platforms your business already uses, puts the numbers in one clean dashboard, and lets you talk to your own data the way you would talk to a sharp analyst. The difference from every other reporting tool: Signal also exports your data in a format your AI agents can read, so Claude, Gemini, ChatGPT, or whatever you run can analyze your business directly without you copy-pasting screenshots into a chat window.

It is built AI-first. Not AI as a feature tacked on, AI as the assumption. Every dashboard surface has a chat panel. Every business page exports a markdown brief for your LLM. Every data point is structured so an agent can read it.

## How it works

1. **Add a business.** Name, vertical, logo. Signal white-labels every generated report with that business's brand.
2. **Connect the accounts.** Google Analytics, Google Ads, Meta Ads, Facebook Pages, Instagram, LinkedIn, TikTok, Shopify, Klaviyo, Omnisend, Typeform, HouseCall Pro, Vagaro, Boulevard, Booksy. Pick what you use, skip what you don't. OAuth for most, API keys for a few.
3. **Signal pulls the data** on an automatic schedule, typically every 15 to 60 minutes depending on the provider's rate limits.
4. **See the dashboards.** Clean, mobile-friendly, designed to be read at a glance. Every metric card drills into deeper detail.
5. **Ask Signal anything.** The chat panel is a senior marketing analyst with full context on your business. Ask what is working, what needs attention, or what you should do next. Signal pushes back when you are about to make a bad call.
6. **Export for your own AI.** Every business page generates a markdown brief you can download, copy, or paste into any LLM. Comes with ready-to-run prompts.
7. **Generate reports.** One click produces a shareable HTML report with the business's logo, beautiful on any screen. Send it to a client, save it to your drive, print it, email it.

## Who it is for

- **Business owners who want clear visibility** on their marketing performance without digging through five dashboards and three exports.
- **Multi-business owners** who run more than one company and want one pane of glass across all of them.
- **Agency operators** who manage reporting for multiple clients and need a professional place to show results without building dashboards by hand every week.
- **Anyone who talks to AI about their business** and is tired of screenshotting numbers into chat windows.

## Best use cases

- **Weekly marketing reports** to yourself, your team, or your clients. Generate a branded HTML report in a single click.
- **Pre-meeting prep.** Five minutes before a client call, open the business page and ask Signal "what do I need to know going in."
- **Cross-business portfolio tracking.** If you run or manage multiple companies, the Insights page surfaces what needs attention this week across all of them in one glance.
- **Feeding your LLM for deeper analysis.** Export a markdown brief, hand it to Claude Code, Gemini CLI, or a custom agent, and get analysis grounded in your actual numbers.
- **Anomaly spotting.** Signal flags unusual changes so you see problems before a client does.
- **Briefings for stakeholders** who want the story, not the raw numbers. Signal writes the narrative; you decide what to send.

## Our mission and why we built this

I built CQ Signal because I was frustrated.

I run CQ (Creative Quality Marketing). We manage marketing for real businesses: furniture dealers, electricians, med spas, auto body shops, aesthetic brands. Every week my team and I sit down and try to make sense of data spread across GA4, Meta Business Manager, Omnisend, Typeform, Shopify, and a dozen other places. The tools that exist for this (AgencyAnalytics, Whatagraph, Looker Studio) are fine at putting numbers on a page. None of them actually help you think.

And none of them play nicely with the AI tools that have fundamentally changed how I work. I use Claude every day. My team uses it. Our clients use it. But when it came to analyzing our marketing data, we were copying numbers into chats by hand. That felt broken.

So I built what I wanted: a reporting platform that is transparent about what it is showing, honest about what it does not know, and designed from day one so my agents can read the data directly. I wanted business owners to have real visibility on their marketing without needing to become data analysts, and I wanted that visibility to plug cleanly into whatever AI tools they are already using.

That is what CQ Signal is. An agency owner built it for other agency owners and for the business owners we serve. It exists because the gap between "what the dashboard shows" and "what you should do about it" is the most important space in marketing, and AI is finally good enough to live there.

If that resonates, welcome.

## Why CQ Signal is different

The business data space is full of tools that put numbers on a page. Here is what sets Signal apart.

**Designed around AI, not bolted onto it.** Every other reporting tool started as a dashboard and later added an "Ask AI" feature as a tier upgrade. Signal was architected from the first commit with AI as the primary consumption layer. Chat on every page, markdown export on every business, MCP server coming for direct agent access. Your AI is a first-class user, not a feature.

**Your data stays yours.** Other tools trap data inside their platform. Signal does the opposite. Every view exports as a ready-to-paste markdown brief with suggested prompts. REST API and MCP server are coming so Claude Code, Gemini, or a custom agent can query your business live. If you want your data in your own warehouse, grab the JSON and go.

**Prescriptive, not just descriptive.** "Sessions dropped 12%" is descriptive. "Your direct traffic fell 18%, organic held, double down on the blog content that drove 30% of new visitors last month" is prescriptive. Signal pushes toward the second kind of answer. If it cannot tell you what to do, it will not pretend.

**Built for business owners, not just agencies.** Most reporting tools assume an agency managing clients. Signal works for one business or a hundred, for a solo owner or a full agency. The product says "business" everywhere, and the architecture treats single-business and multi-business use identically.

**White-label included.** Every generated report carries the business's own logo, colors, and brand. Not gated behind a top tier. Table stakes for anyone delivering reports to clients or stakeholders.

**Honest about what it does not know.** Signal flags when data is incomplete, when an integration is stale, or when a question is outside what the numbers can answer. That honesty is what makes its recommendations trustworthy.

**A modern product, not a 2015 dashboard.** Fast, responsive, mobile-friendly, dark-mode native, designed with typography and motion that feels intentional. Open it on any device and it looks like it was built this decade, because it was.

## Running locally

### Prerequisites

- Node.js 20 or later
- pnpm 10 or later
- A Git client
- Either a Vercel AI Gateway key or an Anthropic API key

### Clone and install

```bash
git clone https://github.com/cqdesignsny/cq-signal-app.git
cd cq-signal-app
pnpm install
```

### Configure environment

```bash
cp .env.local.example .env.local
```

Fill in one of:

- `AI_GATEWAY_API_KEY` from [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway). Recommended for production.
- `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com). Fastest for local dev.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The portfolio overview loads with seeded businesses. Click any business to see its detail page. The chat panel on the right is live the moment credentials are set.

### Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |

### Deploying

Pushes to GitHub `main` auto-deploy to Vercel if the repo is linked. Set `AI_GATEWAY_API_KEY` (or `ANTHROPIC_API_KEY`) in Vercel's environment variables. Preview deploys land on every pull request.

## Next steps

- [Vision](/docs/vision) for the product's strategic angle and positioning.
- [Markdown exports](/docs/markdown-exports) for plugging Signal data into your own LLM.
- [MCP server](/docs/mcp-server) for the coming direct-connection protocol.
- [Integration catalog](/docs/integrations) for every channel Signal reports on.
- [Security](/docs/security) for how your data and your clients' data is protected.

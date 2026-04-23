# Getting started

This guide gets you running CQ Signal locally in under five minutes.

## Prerequisites

- Node.js 20 or later
- pnpm 10 or later
- A Git client
- Either a Vercel AI Gateway key or an Anthropic API key

## Clone and install

```bash
git clone https://github.com/cqdesignsny/cq-signal-app.git
cd cq-signal-app
pnpm install
```

## Configure environment

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in one of:

- `AI_GATEWAY_API_KEY` from [vercel.com/dashboard/ai-gateway](https://vercel.com/dashboard/ai-gateway). Recommended for production.
- `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com). Fastest for local dev.

Either works. Signal uses whichever it finds.

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The portfolio overview loads with seeded businesses. Click any business to see its detail page. Click the chat panel on the right to chat with the analyst.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |

## Deploying

Main branch pushes to GitHub auto-deploy to Vercel if the repo is linked. Set `AI_GATEWAY_API_KEY` (or `ANTHROPIC_API_KEY`) in Vercel's environment variables. Preview deploys land on every PR.

## Next steps

- [Architecture](/docs/architecture) for the stack and data model.
- [Security](/docs/security) for the threat model and practices.
- [Markdown exports](/docs/markdown-exports) to pull data for your AI.
- [Integration catalog](/docs/integrations) to see every channel Signal connects to.

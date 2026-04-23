# MCP server

The Model Context Protocol server lets any MCP-capable agent query Signal live. Point Claude Code, Gemini CLI, or your custom agent at one URL and it gains tools to analyze your businesses on demand.

**Status:** coming with the database layer. This doc describes the planned interface so you can design your agent workflows now.

## Endpoint (planned)

```
https://cq-signal-app.vercel.app/mcp
```

## Authentication (planned)

Signal accepts:

- Per-workspace API key via `X-Signal-Key` header.
- OAuth 2.0 device flow for user-facing agents (later).

## Tools

All tools are read-only by default. Write operations require the matching `write:*` scope on the API key.

### `list_businesses()`

Returns every business in the workspace.

```json
[
  {
    "slug": "hudson-valley-office-furniture",
    "name": "Hudson Valley Office Furniture",
    "short_name": "HVOF",
    "vertical": "Commercial B2B",
    "integrations": ["ga4", "meta-ads", "facebook", "instagram", "omnisend", "typeform"]
  }
]
```

### `get_business_metrics(slug, range)`

- `slug` — business slug.
- `range` — `7d`, `1m`, `3m`, or `1y`.

Returns per-channel metrics for the period with prior-period comparison.

### `compare_periods(slug, current_range, previous_range)`

- `slug` — business slug.
- `current_range` and `previous_range` — time ranges to compare.

Returns side-by-side comparison with delta and percent change per metric.

### `get_integration_data(slug, integration, range)`

- `slug` — business slug.
- `integration` — integration type (`ga4`, `meta-ads`, etc.).
- `range` — time range.

Returns the full integration-specific detail (landing pages for GA4, lead list for Typeform, post-level engagement for Instagram, and so on).

### `get_leads(slug, range)`

- `slug` — business slug.
- `range` — time range.

Returns the list of leads with names, emails, source, submitted timestamp, and form fields. Requires `read:leads` scope. Treat as PII.

### `get_weekly_brief(slug)`

Returns the most recent AI-generated weekly brief for this business.

### `submit_agent_analysis(slug, analysis)`

Write scope required. Lets your external agent push its analysis back into Signal so the next chat session has context. This is the agent loopback feature.

## Connecting Claude Code

```bash
claude mcp add signal https://cq-signal-app.vercel.app/mcp \
  --header "X-Signal-Key: sigk_live_..."
```

Then in any Claude Code session:

```
what needs attention across my businesses this week?
```

Claude Code calls `list_businesses()` and `get_business_metrics()` under the hood, analyzes the data against whatever context you've provided, and responds.

## Connecting custom MCP clients

Any MCP 1.0-compliant client works. Point it at the endpoint, provide the `X-Signal-Key` header, list tools, call them. Standard MCP semantics.

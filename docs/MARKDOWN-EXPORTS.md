# Markdown exports

Signal exports business data as Markdown briefs designed to feed directly into your LLM of choice. Every business page has an `Export for AI` button that downloads or copies a brief.

## Endpoint

```
GET /api/businesses/{slug}/export
```

Query parameters:

- `format` — `md` (default) or `json`. Markdown for LLM consumption, JSON for programmatic access.
- `range` — `7d` (default), `1m`, `3m`, or `1y`. Time window for metrics.
- `download` — `1` to trigger attachment download with a dated filename. Omit for inline.

## Example requests

```bash
# Download a 7-day brief for HVOF
curl -L "https://cq-signal-app.vercel.app/api/businesses/hudson-valley-office-furniture/export?format=md&range=7d&download=1" -O

# Inline for piping into tools
curl -s "https://cq-signal-app.vercel.app/api/businesses/hudson-valley-office-furniture/export?format=md"

# JSON for programmatic access
curl "https://cq-signal-app.vercel.app/api/businesses/hudson-valley-office-furniture/export?format=json&range=1m"
```

## Output shape

Each brief contains:

- **Header.** Business name, period, comparison period, generation timestamp.
- **Business context.** Name, vertical, tagline, connected channels.
- **Channel snapshot.** Per-integration primary metric and secondary metrics, with period-over-period comparison placeholders.
- **Suggested prompts.** Four ready-to-paste prompts for your LLM: top moves, anomaly hunt, client-facing summary, budget reallocation.
- **Connection instructions.** Pointers to the REST API and (coming) MCP server.

## Why Markdown

- LLMs parse Markdown faster and with fewer tokens than JSON or HTML.
- Readable if you open the file yourself.
- Portable across every AI provider (Claude, Gemini, ChatGPT, local models).

## Using with Claude Code

```bash
curl -s "https://cq-signal-app.vercel.app/api/businesses/level-aesthetics/export?format=md" > level-brief.md
claude --file level-brief.md "What are the three best moves for Level Aesthetics this week?"
```

## Using with Gemini CLI

```bash
curl -s ".../export?format=md" | gemini --stdin "Analyze the anomalies in this brief."
```

## Copy to clipboard

The `Export for AI` menu in the business header has a Copy action that puts the 7-day brief on your clipboard for fast paste into any LLM chat window.

## What lands next

- **Narrative-first format.** Prose paragraphs per channel, not just tables of numbers.
- **PII redaction toggle** for exports that include lead names and emails.
- **Portfolio-level brief.** Across every business in the workspace, one MD export.
- **Scheduled exports.** Email a weekly brief automatically.

import Link from "next/link";
import { ArrowLeft, Bot, Code2, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentsSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link href="/settings">
            <ArrowLeft className="size-3.5" />
            Settings
          </Link>
        </Button>
      </div>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-brand" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Agents & AI
          </p>
        </div>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          Plug your AI into CQ Signal.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Signal is built AI-first. Your data doesn't stay locked in dashboards. Pull it into any LLM, any agent framework, any workflow you run.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <FileCode2 className="size-5 text-foreground" />
            <CardTitle className="font-display text-lg">Markdown briefs</CardTitle>
            <CardDescription>
              Live now. Pull a formatted brief from any business page and paste into Claude, Gemini, ChatGPT, or your own agent.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Code2 className="size-5 text-foreground" />
            <CardTitle className="font-display text-lg">REST API</CardTitle>
            <CardDescription>
              Coming next. Per-workspace keys any agent or script can call for JSON or Markdown exports.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Bot className="size-5 text-foreground" />
            <CardTitle className="font-display text-lg">MCP server</CardTitle>
            <CardDescription>
              Coming next. Built-in Model Context Protocol endpoint so Claude Code and any MCP-capable agent can query Signal live.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight md:text-3xl">
          Markdown briefs
        </h2>
        <Card>
          <CardContent className="space-y-3 py-5 text-sm leading-relaxed">
            <p>
              Open any business page. Click <strong>Export for AI</strong> in the header. Pick a range (7d / 30d / 90d).
            </p>
            <p>The brief lands as a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.md</code> file with:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Business context (vertical, connected channels)</li>
              <li>Channel snapshot (each integration's key metrics)</li>
              <li>Period comparison (current vs prior)</li>
              <li>Suggested prompts you can paste straight into your LLM</li>
              <li>How to connect Signal directly (API + MCP)</li>
            </ul>
            <p className="text-muted-foreground">
              Why markdown? LLMs parse it faster, it takes fewer tokens than JSON or HTML, and it stays readable if you open it yourself.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight md:text-3xl">
          REST API (preview)
        </h2>
        <Card>
          <CardContent className="space-y-3 py-5 text-sm leading-relaxed">
            <p>Same data, raw. Query any business:</p>
            <pre className="overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs">
{`GET /api/businesses/{slug}/export?format=json&range=7d
GET /api/businesses/{slug}/export?format=md&range=1m`}
            </pre>
            <p>Per-workspace API keys land with the database layer. Until then, the Markdown endpoint is open for your local experimentation.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl tracking-tight md:text-3xl">
          MCP server (coming)
        </h2>
        <Card>
          <CardContent className="space-y-3 py-5 text-sm leading-relaxed">
            <p>Once live, point any MCP-capable agent at:</p>
            <pre className="overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs">
{`https://cq-signal-app.vercel.app/mcp`}
            </pre>
            <p>It'll expose tools like:</p>
            <ul className="list-disc space-y-1 pl-5 font-mono text-xs">
              <li><code>list_businesses()</code></li>
              <li><code>get_business_metrics(slug, range)</code></li>
              <li><code>compare_periods(slug, current, previous)</code></li>
              <li><code>get_integration_data(slug, integration, range)</code></li>
              <li><code>get_leads(slug, range)</code></li>
            </ul>
            <p className="text-muted-foreground">
              Your Claude Code, Gemini CLI, or custom agent becomes your marketing analyst with full read access to live data. Agent writes back recommendations and Signal logs them so the conversation carries forward.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

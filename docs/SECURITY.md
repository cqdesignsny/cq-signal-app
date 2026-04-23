# Security

CQ Signal handles marketing performance data, lead PII, and third-party API credentials. Security is not a phase. It's a posture. Everything below reflects current state or a known next step.

## Threat model

### What we protect

- **Third-party API credentials.** OAuth tokens and API keys for Google Ads, Meta, GA4, Omnisend, Typeform, Shopify, and every future integration. These are the highest-value target in the system. A compromise lets an attacker pull every metric and every lead from the user's entire marketing stack.
- **Lead PII.** Names, emails, phone numbers from Typeform and form-based integrations. Plus CRM data from HouseCall Pro, Vagaro, Boulevard.
- **Revenue and client data.** Shopify orders, Klaviyo revenue, booking revenue, job revenue.
- **Business ownership graph.** Which workspaces own which businesses. Multi-tenant integrity.
- **AI chat content.** Conversations may reference business-sensitive analysis or intent.
- **AI provider keys.** Our Anthropic / AI Gateway credentials, plus customer-provided BYO keys.

### Who we protect against

- Opportunistic attackers (credential stuffing, automated scanners).
- Targeted attackers (competitors, disgruntled former clients).
- Insider threat (rogue admin, compromised developer laptop).
- Third-party vendor compromise (Vercel, Anthropic, Neon, Clerk, Upstash).

## Current posture

### Deployed

- HTTPS enforced by Vercel. HSTS header with preload-ready value.
- Strict security headers configured in `next.config.ts` (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- No user auth yet. Chat endpoint accepts public requests during internal-only phase. Will be gated behind Clerk before any external user access.
- AI provider keys live in Vercel environment variables. Never in code, never in git.
- `.env.local` is gitignored with an explicit `!.env*.example` exception so example files can be committed but real secrets can't.
- Input validation on the export route (range param validated against enum).
- Logo filenames and route segments lowercased for Linux filesystem parity with the deploy target.
- Structured logging on the chat and export routes for later Sentry / Datadog integration.

### Planned before multi-tenant use

- **Clerk authentication.** SSO, MFA, session management, per-workspace RBAC.
- **Workspace isolation.** Every database query scoped by `workspace_id`. Postgres row-level security as defense-in-depth.
- **Encrypted credential storage.** Third-party OAuth tokens and API keys encrypted at rest with Vercel-managed or AWS KMS keys. Never logged, never returned to the client. Rotation schedule per provider.
- **Rate limiting.** Per-IP and per-workspace rate limits on `/api/chat`, `/api/export`, and all mutating endpoints via Upstash Redis. Tight burst caps. Different policies for read vs write.
- **Zod validation on every API route.** Body, query, and headers validated before any business logic runs.
- **Audit logs.** Every mutation (profile edit, integration connect or disconnect, data export, agent-key issuance, chat that accesses PII) written to an append-only log with IP and user ID.
- **Webhook signing.** Any inbound webhook (Meta lead ads, Typeform, Stripe) validated with HMAC using provider-specific secrets.
- **Short-lived tokens.** OAuth refresh every 15 to 60 minutes depending on provider.
- **CSRF protection.** Same-site cookies plus double-submit tokens on state-changing requests.
- **Dependency scanning.** Dependabot on the repo, `pnpm audit` in CI, block merges on high-severity issues.
- **Supply chain.** pnpm lockfile committed, `--frozen-lockfile` in CI, package integrity verification.
- **Secret rotation schedule.** Quarterly rotation for AI provider keys, webhook secrets, per-workspace agent API keys. Immediate rotation on any suspected compromise.

### Planned before SaaS launch

- **PII redaction toggle on markdown exports.** Default on for lead names and emails when exports will be consumed by third-party LLMs. Clear indication in the export when redaction is active.
- **Per-workspace data residency options** for clients with regional requirements.
- **SOC 2 readiness.** Access reviews, incident response runbook, vendor risk register.
- **Penetration test** by an external firm before broad SaaS launch.
- **Bug bounty program** with reasonable payout floor.

## Agent and AI access

Agents are privileged. When users point their Claude Code / Gemini / custom agent at Signal via MCP or REST API, the access is scoped:

- **Per-workspace API keys** with scopes (read, write, admin). Never stored in plain text server-side (hash + last-4 shown once at issue).
- **MCP server tools** require authentication. Default scope is read-only. Write operations require explicit scope.
- **Export endpoints** will require auth before SaaS launch. Current internal-only phase operates without auth by design.
- **Prompt injection defense.** User data flowing into the system prompt is sanitized. Tool results passed back to the model are labeled and never trusted as new instructions.

## Incident response (draft)

1. **Detect.** Alerts on anomalous request volume, failed auth spikes, credential access, or export spikes from a single workspace.
2. **Contain.** Rotate compromised secrets, invalidate sessions, optional kill-switch per workspace.
3. **Investigate.** Audit log review, affected-user inventory, scope determination, malicious actor traceability.
4. **Notify.** If user PII is affected, notification within 72 hours (GDPR-aligned), shorter where US state laws require faster.
5. **Remediate.** Patch the root cause. Add detection. Document the failure mode in this file so it can't recur silently.
6. **Post-mortem.** Blameless post-mortem shared with affected users when relevant.

## Reporting a vulnerability

If you find a security issue, email `cqdesignsny@gmail.com` with details. Do not file a public issue. Acknowledgement within 48 hours.

## Privacy commitments

- We do not sell data.
- We do not train models on customer data.
- Customer data is never used for product analytics without explicit opt-in.
- On account deletion, customer data is purged within 30 days, including backups.
- Claude Sonnet access is via Vercel AI Gateway and Anthropic API, both of which provide zero-retention options we will enable before SaaS launch.

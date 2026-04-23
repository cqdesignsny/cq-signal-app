# Chat API

Signal's conversational analyst. Streaming-first, grounded on business data.

## Endpoint

```
POST /api/chat
```

Accepts the Vercel AI SDK v6 chat protocol. On the client, use `useChat` from `@ai-sdk/react` with `DefaultChatTransport`.

## Request body

```json
{
  "messages": [
    { "id": "...", "role": "user", "parts": [{ "type": "text", "text": "..." }] }
  ],
  "businessSlug": "hudson-valley-office-furniture"
}
```

- `messages` — standard `UIMessage[]` from `@ai-sdk/react`.
- `businessSlug` — optional. When present, the system prompt is scoped to that business.

## Response

Server-sent events stream in the AI SDK UI message chunk format. The server responds via `result.toUIMessageStreamResponse()`. The client reads `messages.parts` for rendering.

## System prompt

Signal's voice is encoded in the system prompt in `src/app/api/chat/route.ts`. It includes the business context when provided, then a data-reality note about what Signal can and cannot answer before the data layer is wired.

Voice rules Signal follows:

- Conversational, direct, sharp. Uses analogies to explain data.
- Pushes back when the user is making a bad call.
- No em dashes. No emojis. No AI filler phrases.
- Plain prose by default. Bullets only when listing three or more parallel items.

## Model

Default: `anthropic/claude-sonnet-4.6` resolved through Vercel AI Gateway. Deploys use Gateway for failover, observability, and cost tracking. Local dev falls back to the direct provider package when Gateway credentials are not available.

## Client-side example

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function SignalChat({ businessSlug }: { businessSlug: string }) {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { businessSlug },
    }),
  });

  // Render messages.parts, input form, status-driven stop button.
}
```

See `src/components/chat-panel.tsx` for the full implementation used in the sidebar chat.

## Rate limits (planned)

Per-workspace and per-IP limits land with the database layer. Expect roughly 20 messages per minute per user, with token budgets applied on top.

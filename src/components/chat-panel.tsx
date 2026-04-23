"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatPanelProps = {
  businessSlug: string;
  businessName: string;
};

const SUGGESTIONS = [
  "How did we do this week?",
  "What changed the most from last week?",
  "Which channel is driving leads right now?",
  "What should we do next?",
];

export function ChatPanel({ businessSlug, businessName }: ChatPanelProps) {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { businessSlug },
    }),
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  const submit = (text: string) => {
    if (!text.trim() || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <CardHeader className="gap-1 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand" />
          <CardTitle className="font-display text-base">Ask Signal</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Chat with the data on <span className="text-foreground">{businessName}</span>.
        </CardDescription>
      </CardHeader>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <MessageCircle className="size-5 text-muted-foreground" />
            <p className="font-display text-sm">Start a conversation.</p>
            <p className="max-w-[240px] text-xs text-muted-foreground">
              Signal references connected data and suggests the two or three moves worth making.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "rounded-lg px-3 py-2 leading-relaxed",
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-muted text-foreground"
                    : "max-w-[92%] border bg-card text-card-foreground",
                )}
              >
                {m.parts.map((part, i) =>
                  part.type === "text" ? (
                    <span key={i} className="whitespace-pre-wrap">
                      {part.text}
                    </span>
                  ) : null,
                )}
              </div>
            ))}
            {status === "submitted" ? (
              <div className="text-xs text-muted-foreground">Signal is thinking…</div>
            ) : null}
            {error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                Something went wrong. Make sure your AI credentials are set in .env.local, then try again.
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-3 border-t px-4 py-3">
        {isEmpty ? (
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                disabled={isBusy}
                className={cn(
                  "rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors",
                  "hover:border-brand/60 hover:text-foreground disabled:opacity-50",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${businessName}...`}
            disabled={isBusy}
            className="h-9"
          />
          {isBusy ? (
            <Button type="button" onClick={stop} size="icon-sm" variant="outline" aria-label="Stop">
              <Square />
            </Button>
          ) : (
            <Button type="submit" size="icon-sm" disabled={!input.trim()} aria-label="Send">
              <Send />
            </Button>
          )}
        </form>
      </div>
    </Card>
  );
}

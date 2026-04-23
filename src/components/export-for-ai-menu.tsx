"use client";

import * as React from "react";
import Link from "next/link";
import { Bot, ClipboardCopy, Download, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { businessSlug: string; businessName: string };

export function ExportForAiMenu({ businessSlug, businessName }: Props) {
  const [copied, setCopied] = React.useState(false);
  const [copying, setCopying] = React.useState(false);

  const copyMarkdown = async () => {
    setCopying(true);
    try {
      const res = await fetch(`/api/businesses/${businessSlug}/export?format=md&range=7d`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } finally {
      setCopying(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Bot className="size-3.5" />
          Export for AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[280px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Feed {businessName} data to any LLM
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`/api/businesses/${businessSlug}/export?format=md&range=7d&download=1`}
            download
          >
            <Download className="size-4" />
            Markdown · Last 7 days
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`/api/businesses/${businessSlug}/export?format=md&range=1m&download=1`}
            download
          >
            <Download className="size-4" />
            Markdown · Last 30 days
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`/api/businesses/${businessSlug}/export?format=md&range=3m&download=1`}
            download
          >
            <Download className="size-4" />
            Markdown · Last 90 days
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyMarkdown} disabled={copying}>
          {copied ? <Check className="size-4 text-signal" /> : <ClipboardCopy className="size-4" />}
          {copied ? "Copied" : "Copy to clipboard (7d)"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/settings/agents">
            <ExternalLink className="size-4" />
            Connect your agent
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

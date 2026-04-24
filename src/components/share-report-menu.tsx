"use client";

import { useState, useTransition } from "react";
import { Check, Copy, FileDown, Link2, Loader2, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { latestShareTokenForBusiness } from "@/app/app/businesses/[slug]/share-actions";

type Props = {
  businessSlug: string;
  businessName: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://cq-signal-app.vercel.app";

export function ShareReportMenu({ businessSlug, businessName }: Props) {
  const [pending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    "copy" | "pdf" | null
  >(null);
  const [copied, setCopied] = useState(false);

  const withLatest = (
    label: "copy" | "pdf",
    handler: (shareUrl: string) => void,
  ) => {
    setPendingAction(label);
    startTransition(async () => {
      try {
        const token = await latestShareTokenForBusiness(businessSlug);
        if (!token) {
          alert(
            "No reports yet. Hit Create report to generate the first one, then share it.",
          );
          setPendingAction(null);
          return;
        }
        const shareUrl = `${APP_URL}/reports/${token}`;
        handler(shareUrl);
      } catch (err) {
        console.error("[share] failed", err);
        setPendingAction(null);
      }
    });
  };

  const onCopy = () =>
    withLatest("copy", async (url) => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        prompt("Copy this share URL:", url);
      }
      setPendingAction(null);
    });

  const onPdf = () =>
    withLatest("pdf", (url) => {
      window.open(`${url}?print=1`, "_blank", "noopener,noreferrer");
      setPendingAction(null);
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
        >
          <Share2 className="size-3.5" />
          Share report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[260px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Share {businessName} report
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onCopy();
          }}
          disabled={pending}
        >
          {pendingAction === "copy" && pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : copied ? (
            <Check className="size-4 text-brand" />
          ) : (
            <Link2 className="size-4" />
          )}
          {copied ? "Copied to clipboard" : "Copy share link"}
          {!copied && !pending ? (
            <Copy className="ml-auto size-3 text-muted-foreground" />
          ) : null}
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onPdf();
          }}
          disabled={pending}
        >
          {pendingAction === "pdf" && pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileDown className="size-4" />
          )}
          Download PDF (print view)
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Mail className="size-4" />
          Email to client
          <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">
            Soon
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Both options use the most recent generated report. Hit Create report
          first if you don't have one yet.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { FileDown, Link2, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShareReportMenu({ businessName }: { businessName: string }) {
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
      <DropdownMenuContent align="end" className="min-w-[240px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Send {businessName} report as
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <FileDown className="size-4" />
          Download PDF
          <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">
            Soon
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Mail className="size-4" />
          Email to client
          <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">
            Soon
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Link2 className="size-4" />
          Copy share link
          <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">
            Soon
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

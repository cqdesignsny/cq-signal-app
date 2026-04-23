"use client";

import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 px-4 glass lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-4" />
      <div className="font-display text-base text-muted-foreground">
        Reporting, without the noise.
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">Ask Signal</span>
          <kbd className="hidden items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8 ring-1 ring-border",
            },
          }}
        />
      </div>
    </header>
  );
}

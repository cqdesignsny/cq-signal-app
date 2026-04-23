import Link from "next/link";
import { Bot, ChevronRight, Palette, User } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SECTIONS = [
  {
    href: "/app/settings/agents",
    icon: Bot,
    title: "Agents & AI",
    description:
      "Markdown exports, REST API, and MCP server. Connect your AI agents to Signal data.",
    available: true,
  },
  {
    href: "#",
    icon: Palette,
    title: "Appearance",
    description: "Theme toggle lives in the sidebar. More visual controls coming.",
    available: false,
  },
  {
    href: "#",
    icon: User,
    title: "Account",
    description: "Workspace details, billing, team members.",
    available: false,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Settings
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          Signal preferences
        </h1>
      </header>

      <div className="grid gap-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const inner = (
            <Card
              className={
                s.available
                  ? "transition-all hover:-translate-y-0.5 hover:ring-foreground/25"
                  : "opacity-60"
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 text-foreground" />
                    <div>
                      <CardTitle className="font-display text-lg">
                        {s.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {s.description}
                      </CardDescription>
                    </div>
                  </div>
                  {s.available ? (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Soon
                    </span>
                  )}
                </div>
              </CardHeader>
            </Card>
          );

          return s.available ? (
            <Link key={s.href} href={s.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={s.title}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

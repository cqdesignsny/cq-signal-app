"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Option = { value: "light" | "dark" | "system"; icon: typeof Sun; label: string };

const OPTIONS: Option[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function SidebarThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const active = (mounted ? theme ?? "system" : "system") as Option["value"];

  return (
    <div className="px-2 pb-2 pt-1">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Appearance
      </div>
      <div
        role="radiogroup"
        aria-label="Theme"
        className="flex gap-0.5 rounded-lg border bg-background/60 p-0.5 shadow-sm backdrop-blur"
      >
        {OPTIONS.map((o) => {
          const isActive = active === o.value;
          const Icon = o.icon;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(o.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[11px] font-medium transition-all",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionNavItem = { id: string; label: string };

type Props = {
  items: SectionNavItem[];
};

export function SectionNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const scrollY = window.scrollY + 80;
      let active: string | null = null;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) {
          active = items[i].id;
          break;
        }
      }
      setActiveId(active ?? items[0]?.id ?? null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav
      className="sticky top-1 z-40 -mx-4 mb-6 overflow-x-auto border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 print:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex min-w-max items-center">
        {items.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors",
                isActive
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-[18px] items-center justify-center rounded-full text-[10px] font-bold leading-none transition-colors",
                  isActive
                    ? "bg-brand text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

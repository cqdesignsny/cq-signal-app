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
      const scrollY = window.scrollY + 100;
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
    <nav className="sticky top-3 z-40 mb-7 print:hidden">
      <div
        className="mx-auto inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

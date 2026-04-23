"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsSections } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 text-sm">
      <div>
        <Link
          href="/docs"
          className={cn(
            "block py-1 font-mono text-[11px] uppercase tracking-widest transition-colors",
            pathname === "/docs"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Overview
        </Link>
      </div>
      {docsSections.map((section) => (
        <div key={section.title} className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const isActive = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "-mx-2 block rounded-md px-2 py-1 transition-colors",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

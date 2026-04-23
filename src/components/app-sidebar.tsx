"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Plus, Settings, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { businesses } from "@/lib/businesses";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard, exact: true },
  { label: "Insights", href: "/insights", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-1 py-1.5">
          <Image
            src="/CQ-Signal-Logo.png"
            alt="CQ Signal"
            width={140}
            height={36}
            className="h-7 w-auto object-contain dark:invert"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href, item.exact)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
            Businesses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businesses.map((b) => {
                const active = pathname === `/businesses/${b.slug}`;
                const initials = (b.shortName ?? b.name).slice(0, 2).toUpperCase();
                return (
                  <SidebarMenuItem key={b.slug}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={`/businesses/${b.slug}`}>
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-semibold text-muted-foreground group-data-[active=true]/menu-item:bg-brand/10 group-data-[active=true]/menu-item:text-brand">
                          {initials}
                        </span>
                        <span className="truncate">{b.shortName ?? b.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-muted-foreground"
                  isActive={pathname === "/businesses/new"}
                >
                  <Link href="/businesses/new">
                    <Plus />
                    <span>Add Business</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-1 py-1 text-[11px] leading-tight text-muted-foreground">
          <div className="font-display text-sm text-foreground">CQ Signal</div>
          <div>Internal build · v0.1</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

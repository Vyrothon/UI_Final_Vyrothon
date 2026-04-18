"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  FileSearch,
  FileText,
  LayoutDashboard,
  Pill,
  Scale,
  TrendingUp,
} from "lucide-react"
import { getSidebarGroupsForPath } from "@/lib/app-feature-nav"
import { SITE_NAME } from "@/lib/site-config"
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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const iconFor = (href: string) => {
  const map: Record<string, typeof LayoutDashboard> = {
    "/dashboard": LayoutDashboard,
    "/dashboard/audit": FileSearch,
    "/dashboard/drug-check": Pill,
    "/dashboard/dispute": FileText,
    "/dashboard/escalation": TrendingUp,
    "/dashboard/lawyers": Building2,
    "/dashboard/tracker": CalendarClock,
    "/dashboard/clean-bill": BadgeCheck,
  }
  return map[href] ?? LayoutDashboard
}

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppFeatureSidebar() {
  const pathname = usePathname()
  const groups = getSidebarGroupsForPath(pathname)

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent">
              <Link href="/dashboard" title="ClearClaim workspace">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                  CC
                </span>
                <span className="truncate font-semibold tracking-tight">{SITE_NAME}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {groups.map((group, gi) => (
          <SidebarGroup key={group.title}>
            {gi > 0 && <SidebarSeparator className="mx-2" />}
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = iconFor(item.href)
                  const active = isActivePath(pathname, item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(active && "font-medium")}
                      >
                        <Link href={item.href} title={item.description}>
                          <Icon className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <p className="px-2 pb-2 text-[10px] leading-snug text-sidebar-foreground/55">
          Prototype data — not legal or medical advice.
        </p>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm" className="text-xs text-sidebar-foreground/70">
              <Link href="/terms">Terms</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm" className="text-xs text-sidebar-foreground/70">
              <Link href="/privacy">Privacy</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

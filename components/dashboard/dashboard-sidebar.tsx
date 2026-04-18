"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DASHBOARD_SIDEBAR_SECTIONS } from "@/lib/dashboard-nav"
import { SITE_NAME } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { SidebarUserFooter } from "@/components/dashboard/sidebar-user-footer"

function isWorkspacePath(href: string) {
  return href.startsWith("/dashboard")
}

function NavSections({ inSheet }: { inSheet?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6 px-2 py-2">
      {DASHBOARD_SIDEBAR_SECTIONS.map((section, idx) => (
        <div key={section.title}>
          {idx > 0 ? <Separator className="mb-4" /> : null}
          <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <nav className="flex flex-col gap-0.5">
            {section.links.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
              const Icon = item.icon
              const workspace = isWorkspacePath(item.href)

              const inner = (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    active
                      ? "bg-primary/12 font-medium text-foreground ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted/90 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0",
                      active ? "text-primary" : "opacity-80 group-hover:opacity-100",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      {!workspace && (
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-50" aria-hidden />
                      )}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-xs font-normal leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>
              )

              return inSheet ? (
                <SheetClose key={item.href} asChild>
                  {inner}
                </SheetClose>
              ) : (
                <Fragment key={item.href}>{inner}</Fragment>
              )
            })}
          </nav>
        </div>
      ))}
    </div>
  )
}

type Props = {
  userEmail: string
}

export function DashboardSidebar({ userEmail }: Props) {
  return (
    <>
      <div className="sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-2" aria-label="Open sidebar menu">
              <Menu className="h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[min(100vw-1rem,20rem)] flex-col p-0">
            <SheetHeader className="space-y-1 border-b border-border px-4 py-4 text-left">
              <SheetTitle className="text-base font-semibold">{SITE_NAME}</SheetTitle>
              <p className="text-xs font-normal text-muted-foreground">Workspace</p>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <NavSections inSheet />
            </div>
            <SheetFooter className="mt-auto border-t border-border p-4">
              <SidebarUserFooter email={userEmail} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 flex-1">
          <Link href="/dashboard" className="block truncate font-semibold leading-tight text-foreground">
            {SITE_NAME}
          </Link>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Workspace</p>
        </div>
      </div>

      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-muted/10 dark:bg-gray-950/50 md:flex"
        aria-label="Workspace navigation"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="shrink-0 border-b border-border px-4 py-4">
            <Link href="/dashboard" className="text-lg font-semibold text-foreground hover:opacity-90">
              {SITE_NAME}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">Workspace</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <NavSections />
          </div>
          <div className="shrink-0 border-t border-border bg-muted/20 p-4">
            <SidebarUserFooter email={userEmail} />
          </div>
        </div>
      </aside>
    </>
  )
}

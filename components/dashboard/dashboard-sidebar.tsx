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
          <h3 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <nav className="flex flex-col gap-0.5">
            {section.links.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`))
              const Icon = item.icon
              const workspace = isWorkspacePath(item.href)

              const inner = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors group",
                    active
                      ? "bg-primary/12 text-foreground font-medium ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted/90 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 mt-0.5",
                      active ? "text-primary" : "opacity-80 group-hover:opacity-100",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      {!workspace && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 shrink-0" aria-hidden />
                      )}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground line-clamp-2 leading-snug mt-0.5">
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
    <div className="flex shrink-0 flex-col border-b border-gray-200 bg-muted/10 dark:border-gray-800 dark:bg-gray-950/50 md:h-screen md:w-64 md:border-b-0 md:border-r">
      {/* Mobile top bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shrink-0" aria-label="Open sidebar menu">
              <Menu className="h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[min(100vw-1rem,20rem)] flex-col p-0">
            <SheetHeader className="border-b border-border px-4 py-4 text-left space-y-1">
              <SheetTitle className="text-base font-semibold">{SITE_NAME}</SheetTitle>
              <p className="text-xs text-muted-foreground font-normal">Workspace &amp; product</p>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <NavSections inSheet />
            </div>
            <SheetFooter className="border-t border-border p-4 mt-auto">
              <SidebarUserFooter email={userEmail} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 flex-1">
          <Link href="/" className="font-semibold text-foreground truncate block leading-tight">
            {SITE_NAME}
          </Link>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Workspace</p>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex min-h-0 flex-1 flex-col w-64">
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
          <Link href="/" className="font-semibold text-lg text-foreground hover:opacity-90">
            {SITE_NAME}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Workspace &amp; navigation</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavSections />
        </div>
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 p-4 bg-muted/20">
          <SidebarUserFooter email={userEmail} />
        </div>
      </aside>
    </div>
  )
}

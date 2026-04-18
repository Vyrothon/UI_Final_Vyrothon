"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppFeatureSidebar } from "@/components/workspace/app-feature-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SITE_NAME } from "@/lib/site-config"
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/site-urls"
import { Button } from "@/components/ui/button"
import { useWorkspaceUserEmail } from "@/hooks/use-workspace-user-email"

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const userEmail = useWorkspaceUserEmail()

  return (
    <SidebarProvider defaultOpen>
      <AppFeatureSidebar />
      <SidebarInset className="flex min-h-svh flex-col bg-white dark:bg-gray-950">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-black/10 bg-white/95 px-3 backdrop-blur dark:border-white/10 dark:bg-gray-950/95 md:px-4">
          <SidebarTrigger className="-ml-1 text-neutral-700 dark:text-neutral-200" />
          {!isDashboard ? (
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:hidden"
            >
              {SITE_NAME}
            </Link>
          ) : null}
          <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
            {isDashboard ? (
              <span
                className="truncate text-sm font-medium tabular-nums text-neutral-900 dark:text-neutral-100"
                title={userEmail}
              >
                {userEmail}
              </span>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-neutral-600 sm:px-3 sm:text-sm" asChild>
                  <Link href={APP_LOGIN_URL}>Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-black px-2 text-xs text-white hover:bg-black/90 dark:bg-white dark:text-black sm:px-3 sm:text-sm"
                  asChild
                >
                  <Link href={APP_SIGNUP_URL}>Sign up</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardScanProvider } from "@/components/dashboard/dashboard-scan-context"
import { useWorkspaceUserEmail } from "@/hooks/use-workspace-user-email"

export function DashboardAppShell({ children }: { children: ReactNode }) {
  const userEmail = useWorkspaceUserEmail()

  return (
    <DashboardScanProvider>
      <div className="min-h-screen w-full bg-background">
        <DashboardSidebar userEmail={userEmail} />
        <div className="flex min-h-screen flex-col md:pl-64">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
            <ThemeToggle />
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </DashboardScanProvider>
  )
}

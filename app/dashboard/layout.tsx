import type { ReactNode } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDemoSession } from "@/lib/demo-session"
import { SITE_NAME_FULL } from "@/lib/site-config"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export const metadata: Metadata = {
  title: `Dashboard | ${SITE_NAME_FULL}`,
  description: "ClearClaim workspace — bill intake, audit, disputes, and site navigation.",
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getDemoSession()
  if (!user) redirect("/login?next=/dashboard")

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950 md:flex-row">
      <DashboardSidebar userEmail={user.email} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  )
}

import type { ReactNode } from "react"
import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell"

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <DashboardAppShell>{children}</DashboardAppShell>
}

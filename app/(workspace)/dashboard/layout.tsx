import type { Metadata } from "next"
import type { ReactNode } from "react"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Dashboard | ${SITE_NAME_FULL}`,
  description: "Upload bill images and manage your ClearClaim workspace.",
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children
}

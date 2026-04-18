import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"

export const metadata: Metadata = {
  title: "Portal assist | ClearClaim AI",
  description: "Assisted capture of portal-hosted medical bills and documents.",
}

export default function OwenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

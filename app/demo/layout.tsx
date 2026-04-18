import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"

export const metadata: Metadata = {
  title: "Demo | ClearClaim AI",
  description:
    "See ClearClaim audit a hospital bill, flag overcharges, and export a dispute pack in minutes.",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

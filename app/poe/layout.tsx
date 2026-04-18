import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"

export const metadata: Metadata = {
  title: "Letters & docs | ClearClaim AI",
  description: "Dispute letters and document tools powered by ClearClaim.",
}

export default function PoeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

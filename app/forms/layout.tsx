import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"

export const metadata: Metadata = {
  title: "Bill intake | ClearClaim AI",
  description:
    "Secure intake for hospital bills, EOBs, and discharge paperwork—structured for OCR and audit pipelines.",
}

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `How routing works | ${SITE_NAME_FULL}`,
  description:
    "How ClearClaim sends your bill through OCR, models, and dispute workflows—like a switchboard for billing intelligence.",
}

export default function SwitchboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

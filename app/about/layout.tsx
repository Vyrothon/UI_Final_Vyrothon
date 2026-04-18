import type React from "react"
import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing-page-shell"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `About | ${SITE_NAME_FULL}`,
  description:
    "Why ClearClaim exists: opaque hospital billing, patient leverage, and AI that turns bills into disputes you can act on.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketingPageShell>{children}</MarketingPageShell>
}

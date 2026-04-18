import type React from "react"
import type { Metadata } from "next"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Pricing | ${SITE_NAME_FULL}`,
  description: "ClearClaim plans: free bill scan, Pro audits and dispute letters, family seats, and enterprise billing review.",
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

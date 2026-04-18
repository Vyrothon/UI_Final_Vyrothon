import type React from "react"
import type { Metadata } from "next"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
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
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

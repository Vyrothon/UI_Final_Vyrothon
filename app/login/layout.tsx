import type { Metadata } from "next"
import type { ReactNode } from "react"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Log in | ${SITE_NAME_FULL}`,
  description: "Sign in to ClearClaim to review hospital bills, disputes, and case history.",
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <MainNavbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}

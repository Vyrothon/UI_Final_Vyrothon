import type { Metadata } from "next"
import type { ReactNode } from "react"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
import { SITE_NAME_FULL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Sign up | ${SITE_NAME_FULL}`,
  description: "Create a ClearClaim account to upload bills, run audits, and manage disputes.",
}

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <MainNavbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}

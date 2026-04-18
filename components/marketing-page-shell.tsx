import type { ReactNode } from "react"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"

/** Standard marketing layout: top nav + footer (pages outside `/dashboard`). */
export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <MainNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

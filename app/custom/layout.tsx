import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Enterprise & custom | ClearClaim AI",
  description:
    "Custom audit rules, payer integrations, and white-label billing intelligence for hospitals, TPAs, and self-insured employers.",
}

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

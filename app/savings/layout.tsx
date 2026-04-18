import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Savings calculator | ClearClaim AI",
  description: "Estimate hours and money recovered when patients challenge incorrect hospital bills with ClearClaim.",
}

export default function SavingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

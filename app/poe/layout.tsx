import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Letters & documents | ClearClaim AI",
  description:
    "Generate dispute letters, regulator drafts, and insurer communications from your structured audit data.",
}

export default function PoeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

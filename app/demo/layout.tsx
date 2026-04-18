import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo | ClearClaim AI",
  description:
    "See ClearClaim audit a hospital bill, flag overcharges, and export a dispute pack in minutes.",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

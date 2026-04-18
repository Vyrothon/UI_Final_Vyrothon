import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal assist | ClearClaim AI",
  description:
    "Optional guided capture from hospital and insurer portals so PDFs land in ClearClaim without manual hunting.",
}

export default function OwenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

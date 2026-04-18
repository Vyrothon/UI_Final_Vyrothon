import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dispute tracker | ClearClaim AI",
  description:
    "Track billing disputes, deadlines, letters sent, and counsel referrals in one workspace.",
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

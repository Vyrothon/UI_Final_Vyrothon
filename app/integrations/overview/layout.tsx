import type React from "react"

export const metadata = {
  title: "Integrations | ClearClaim AI",
  description: "Email, storage, OCR, payments, and partners that connect to ClearClaim’s billing audit stack.",
}

export default function IntegrationsOverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

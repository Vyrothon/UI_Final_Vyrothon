import type { LucideIcon } from "lucide-react"
import { Building2, Pill, ScanLine, Stethoscope } from "lucide-react"

export type DashboardNavLink = {
  label: string
  href: string
  description: string
  icon: LucideIcon
}

export type DashboardNavSection = {
  title: string
  links: DashboardNavLink[]
}

export const DASHBOARD_SIDEBAR_SECTIONS: DashboardNavSection[] = [
  {
    title: "Product",
    links: [
      {
        label: "Bill scan & pricing",
        href: "/dashboard",
        description: "OCR and automated price dispute",
        icon: ScanLine,
      },
      {
        label: "Medications",
        href: "/dashboard/medicine",
        description: "Formulary and prescribing flags",
        icon: Pill,
      },
      {
        label: "Treatments",
        href: "/dashboard/malpractice",
        description: "Clinical necessity review",
        icon: Stethoscope,
      },
      {
        label: "Legal marketplace",
        href: "/dashboard/marketplace",
        description: "Lawyers and firms",
        icon: Building2,
      },
    ],
  },
]

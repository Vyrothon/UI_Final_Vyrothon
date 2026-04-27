import type { LucideIcon } from "lucide-react"
import {
  FileUp,
  ScanSearch,
  ListTodo,
  FileStack,
  Scale,
  FileInput,
  ClipboardList,
  Mail,
  MonitorSmartphone,
  PiggyBank,
  Home,
  DollarSign,
  PlayCircle,
  Info,
  Plug,
  Building2,
} from "lucide-react"

export type SidebarNavLink = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export type SidebarSection = {
  title: string
  links: SidebarNavLink[]
}

/** All navigation for the dashboard sidebar: in-app workspace + marketing product pages + site links. */
export const DASHBOARD_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Workspace",
    links: [
      {
        href: "/dashboard/bill-intake",
        label: "Bill intake",
        description: "Upload bills, EOBs, discharge papers",
        icon: FileUp,
      },
      {
        href: "/dashboard/audit",
        label: "AI audit",
        description: "Flagged lines & fair-price estimate",
        icon: ScanSearch,
      },
      {
        href: "/dashboard/disputes",
        label: "Dispute tracker",
        description: "Status, deadlines, outcomes",
        icon: ListTodo,
      },
      {
        href: "/dashboard/letters",
        label: "Letters & docs",
        description: "Dispute drafts & templates",
        icon: FileStack,
      },
      {
        href: "/dashboard/marketplace",
        label: "Legal marketplace",
        description: "Vetted firms & intake",
        icon: Scale,
      },
    ],
  },
  {
    title: "Product",
    links: [
      {
        href: "/forms",
        label: "Intake forms",
        description: "Structured bill intake flows",
        icon: FileInput,
      },
      {
        href: "/tasks",
        label: "Tasks",
        description: "Dispute tracker (marketing)",
        icon: ClipboardList,
      },
      {
        href: "/poe",
        label: "Letters hub",
        description: "Letters & docs (site)",
        icon: Mail,
      },
      {
        href: "/owen",
        label: "Portal assist",
        description: "Portal copilot",
        icon: MonitorSmartphone,
      },
      {
        href: "/savings",
        label: "Savings",
        description: "Estimates & insights",
        icon: PiggyBank,
      },
    ],
  },
  {
    title: "Site",
    links: [
      {
        href: "/",
        label: "Home",
        description: "Marketing home",
        icon: Home,
      },
      {
        href: "/pricing",
        label: "Pricing",
        description: "Plans & tiers",
        icon: DollarSign,
      },
      {
        href: "/demo",
        label: "Demo",
        description: "Product tour",
        icon: PlayCircle,
      },
      {
        href: "/about",
        label: "About",
        description: "ClearClaim story",
        icon: Info,
      },
      {
        href: "/integrations/overview",
        label: "Integrations",
        description: "Connect your stack",
        icon: Plug,
      },
      {
        href: "/custom",
        label: "Enterprise",
        description: "Custom & API",
        icon: Building2,
      },
    ],
  },
]

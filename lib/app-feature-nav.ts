/**
 * Legacy app-feature map (used if WorkspaceShell / app-feature-sidebar is mounted).
 */
export type AppFeatureItem = {
  label: string
  href: string
  description: string
}

export type AppFeatureGroup = {
  title: string
  items: AppFeatureItem[]
}

export const APP_FEATURE_GROUPS: AppFeatureGroup[] = [
  {
    title: "ClearClaim",
    items: [
      { label: "Bill scan & pricing", href: "/dashboard", description: "OCR and price dispute" },
      { label: "Medications", href: "/dashboard/medicine", description: "Formulary flags" },
      { label: "Treatments", href: "/dashboard/malpractice", description: "Necessity review" },
      { label: "Legal marketplace", href: "/dashboard/marketplace", description: "Lawyers and firms" },
    ],
  },
]

export function getSidebarGroupsForPath(_pathname: string): AppFeatureGroup[] {
  return APP_FEATURE_GROUPS
}

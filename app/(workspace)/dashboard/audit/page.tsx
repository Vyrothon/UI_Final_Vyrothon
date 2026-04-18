import { redirect } from "next/navigation"

/** Price audit is embedded on /dashboard after scan — keep route for old links. */
export default function AuditRedirectPage() {
  redirect("/dashboard")
}

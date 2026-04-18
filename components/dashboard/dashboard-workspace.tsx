"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BillIntakePanel } from "@/components/dashboard/bill-intake-panel"
import { getPrototypeSession } from "@/lib/prototype-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"

type SessionUser = { email: string; name?: string; source: "prototype" | "supabase" }

export default function DashboardWorkspace() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function resolveSession() {
      const proto = getPrototypeSession()
      if (proto) {
        if (!cancelled) {
          setUser({
            email: proto.email,
            name: proto.fullName,
            source: "prototype",
          })
          setChecking(false)
        }
        return
      }

      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const {
          data: { user: u },
        } = await supabase.auth.getUser()
        if (!cancelled && u?.email) {
          setUser({
            email: u.email,
            name: (u.user_metadata?.full_name as string | undefined) ?? undefined,
            source: "supabase",
          })
          setChecking(false)
          return
        }
      }

      if (!cancelled) {
        router.replace("/login")
      }
    }

    void resolveSession()
    return () => {
      cancelled = true
    }
  }, [router])

  if (checking || !user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <p className="text-sm text-muted-foreground">Loading workspace…</p>
      </div>
    )
  }

  return <BillIntakePanel />
}

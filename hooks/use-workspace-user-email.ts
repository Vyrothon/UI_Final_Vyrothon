"use client"

import { useEffect, useState } from "react"
import { getPrototypeSession } from "@/lib/prototype-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"

/** Shown in workspace header when no session email is available (dashboard prototype). */
export const WORKSPACE_FALLBACK_EMAIL = "test@gmail.com"

/**
 * Resolved email for workspace chrome: prototype session, Supabase user, or fallback.
 */
export function useWorkspaceUserEmail() {
  const [displayEmail, setDisplayEmail] = useState(WORKSPACE_FALLBACK_EMAIL)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const proto = getPrototypeSession()
      if (proto?.email) {
        if (!cancelled) setDisplayEmail(proto.email)
        return
      }

      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled && user?.email) {
          setDisplayEmail(user.email)
          return
        }
      }

      if (!cancelled) setDisplayEmail(WORKSPACE_FALLBACK_EMAIL)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return displayEmail
}

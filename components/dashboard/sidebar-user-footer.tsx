"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { clearPrototypeSession } from "@/lib/prototype-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export function SidebarUserFooter({ email }: { email: string }) {
  const router = useRouter()

  async function logout() {
    clearPrototypeSession()
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <p className="truncate text-xs text-muted-foreground" title={email}>
        {email}
      </p>
      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={() => void logout()}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  )
}

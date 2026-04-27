"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DashboardActions({ email }: { email: string }) {
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground truncate max-w-[220px] sm:max-w-none" title={email}>
        {email}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
        Log out
      </Button>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SidebarUserFooter({ email }: { email: string }) {
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground truncate" title={email}>
        {email}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={() => void logout()}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  )
}

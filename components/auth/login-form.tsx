"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_NAME } from "@/lib/site-config"

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        const first =
          typeof data.error === "object" && data.error
            ? Object.values(data.error).flat().filter(Boolean)[0]
            : data.error
        setMessage({ type: "err", text: String(first || "Could not sign in.") })
        return
      }
      const dest = nextPath?.startsWith("/") ? nextPath : "/dashboard"
      router.push(dest)
      router.refresh()
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md px-4 py-16 md:py-24 mx-auto w-full">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium tracking-tight">Log in</CardTitle>
          <CardDescription>
            Access your {SITE_NAME} workspace—audits, dispute letters, and case tracking.
            <span className="mt-2 block text-amber-700 dark:text-amber-400/90 text-xs font-normal">
              Demo mode: use any email and password. Sessions are stored in a browser cookie only.
            </span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && (
              <p
                className={
                  message.type === "ok"
                    ? "text-sm text-green-700 dark:text-green-400"
                    : "text-sm text-red-600 dark:text-red-400"
                }
                role="status"
              >
                {message.text}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="mailto:support@strawberryantler.com"
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Need help?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              No account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-md px-4 py-24 mx-auto flex justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_NAME } from "@/lib/site-config"
import { setPrototypeSession } from "@/lib/prototype-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"
import { formatAuthError } from "@/lib/supabase/auth-errors"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setMessage({ type: "err", text: formatAuthError(error) })
          return
        }
      } else {
        if (password.length < 8) {
          setMessage({ type: "err", text: "Use at least 8 characters for this prototype sign-in." })
          return
        }
        setPrototypeSession({ email })
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto w-full max-w-md px-4 py-16 md:py-24">
      <p className="mb-6 rounded-sm border border-black/10 bg-neutral-100 px-3 py-2 text-xs text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
        Prototype: {isSupabaseConfigured() ? "Uses Supabase when configured." : "Sign-in is simulated in the browser only."}{" "}
        You&apos;ll land on the upload dashboard.
      </p>
      <Card className="rounded-sm border border-black/15 shadow-none dark:border-white/15">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Log in</CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            Access your {SITE_NAME} workspace—audits, dispute letters, and case tracking.
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
                className="h-11 rounded-sm border-black/20 dark:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="mailto:support@strawberryantler.com"
                  className="text-xs text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline dark:hover:text-neutral-200"
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
                className="h-11 rounded-sm border-black/20 dark:border-white/20"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="h-11 w-full rounded-sm bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              No account?{" "}
              <Link href="/signup" className="font-medium text-neutral-900 underline underline-offset-4 dark:text-white">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

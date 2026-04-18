"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SIGNUP_COUNTRIES } from "@/lib/signup-countries"
import { SITE_NAME } from "@/lib/site-config"
import { setPrototypeSession } from "@/lib/prototype-auth"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/client"
import { formatAuthError } from "@/lib/supabase/auth-errors"

export default function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const supabaseMode = isSupabaseConfigured()
  const submitDisabled = loading || (supabaseMode && !country)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (password !== confirmPassword) {
      setMessage({ type: "err", text: "Passwords do not match." })
      return
    }
    setLoading(true)
    try {
      if (supabaseMode) {
        const supabase = createClient()
        const origin = typeof window !== "undefined" ? window.location.origin : ""
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
            data: {
              full_name: fullName,
              country,
            },
          },
        })
        if (error) {
          setMessage({ type: "err", text: formatAuthError(error) })
          return
        }
        if (data.user && !data.session) {
          setMessage({
            type: "ok",
            text: "Check your email and confirm your account, then log in.",
          })
          return
        }
        router.push("/dashboard")
        router.refresh()
        return
      }

      setPrototypeSession({ email, fullName })
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
        Prototype: {supabaseMode ? "Uses Supabase when configured." : "Account creation is simulated in the browser."}{" "}
        Next stop: the upload dashboard.
      </p>
      <Card className="rounded-sm border border-black/15 shadow-none dark:border-white/15">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            {supabaseMode
              ? "Country drives rates, letter templates, and payment options. You can add a payment method after email verification."
              : "Enter your details to open the prototype workspace."}
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
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="h-11 rounded-sm border-black/20 dark:border-white/20"
              />
            </div>
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
              <Label htmlFor="country">
                Country / region
                {!supabaseMode && <span className="font-normal text-neutral-500"> (optional)</span>}
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country" className="h-11 rounded-sm border-black/20 dark:border-white/20">
                  <SelectValue placeholder={supabaseMode ? "Select country" : "Optional"} />
                </SelectTrigger>
                <SelectContent>
                  {SIGNUP_COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="h-11 rounded-sm border-black/20 dark:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-sm border-black/20 dark:border-white/20"
              />
            </div>
            <p className="text-xs text-neutral-500">
              By creating an account you agree to the{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100">
                Privacy Policy
              </Link>
              . {SITE_NAME} is not a law firm.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="h-11 w-full rounded-sm bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled={submitDisabled}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-neutral-900 underline underline-offset-4 dark:text-white">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

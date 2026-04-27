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

export default function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (password !== confirmPassword) {
      setMessage({ type: "err", text: "Passwords do not match." })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, country, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        const first =
          typeof data.error === "object" && data.error
            ? Object.values(data.error).flat().filter(Boolean)[0]
            : data.error
        setMessage({ type: "err", text: String(first || "Could not create account.") })
        return
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
    <div className="container max-w-md px-4 py-16 md:py-24 mx-auto w-full">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium tracking-tight">Create account</CardTitle>
          <CardDescription>
            Country drives rates, letter templates, and payment options.
            <span className="mt-2 block text-amber-700 dark:text-amber-400/90 text-xs font-normal">
              Demo mode: any password works; no email verification.
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
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="h-11"
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
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country / region</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country" className="h-11">
                  <SelectValue placeholder="Select country" />
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
                minLength={1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any value in demo"
                className="h-11"
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
                className="h-11"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By creating an account you agree to the{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
              . {SITE_NAME} is not a law firm.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-11" disabled={loading || !country}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

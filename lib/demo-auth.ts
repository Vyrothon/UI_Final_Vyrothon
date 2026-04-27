/** Demo auth (no Supabase). Cookie readable in middleware (Edge-safe, no Buffer). */

export const DEMO_COOKIE = "cc_demo_session"

export type DemoUser = {
  email: string
  fullName?: string
  country?: string
}

export function serializeDemoUser(u: DemoUser): string {
  return encodeURIComponent(JSON.stringify(u))
}

export function parseDemoUser(raw: string): DemoUser | null {
  try {
    const o = JSON.parse(decodeURIComponent(raw)) as DemoUser
    if (o && typeof o.email === "string" && o.email.length > 0) return o
  } catch {
    return null
  }
  return null
}

export function demoCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

import { NextResponse } from "next/server"
import { z } from "zod"
import { DEMO_COOKIE, demoCookieOptions, serializeDemoUser } from "@/lib/demo-auth"

// Supabase (disabled for demo):
// import { createClient } from "@/lib/supabase/server"
// import { formatAuthError } from "@/lib/supabase/auth-errors"
// import { SITE_URL } from "@/lib/site-config"

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email(),
  country: z.string().min(1, "Country is required"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const res = NextResponse.json({
    ok: true,
    user: {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      country: parsed.data.country,
    },
  })
  res.cookies.set(
    DEMO_COOKIE,
    serializeDemoUser({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      country: parsed.data.country,
    }),
    demoCookieOptions(),
  )
  return res
}

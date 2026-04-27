import { NextResponse } from "next/server"
import { z } from "zod"
import { DEMO_COOKIE, demoCookieOptions, serializeDemoUser } from "@/lib/demo-auth"

// Supabase (disabled for demo):
// import { createClient } from "@/lib/supabase/server"
// import { formatAuthError } from "@/lib/supabase/auth-errors"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const res = NextResponse.json({
    ok: true,
    user: { email: parsed.data.email },
  })
  res.cookies.set(
    DEMO_COOKIE,
    serializeDemoUser({ email: parsed.data.email }),
    demoCookieOptions(),
  )
  return res
}

import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { formatAuthError } from "@/lib/supabase/auth-errors"
import { SITE_URL } from "@/lib/site-config"

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email(),
  country: z.string().min(1, "Country is required"),
  password: z.string().min(8, "Use at least 8 characters"),
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

  const base = SITE_URL.replace(/\/$/, "")
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${base}/auth/callback?next=/`,
      data: {
        full_name: parsed.data.fullName,
        country: parsed.data.country,
      },
    },
  })

  if (error) {
    return NextResponse.json({ error: formatAuthError(error) }, { status: 400 })
  }

  const needsConfirm = Boolean(data.user && !data.session)

  return NextResponse.json({
    ok: true,
    needsEmailConfirmation: needsConfirm,
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
  })
}

import { NextResponse } from "next/server"
import { z } from "zod"

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

  // TODO: Supabase Auth signInWithPassword
  return NextResponse.json({
    ok: true,
    mock: true,
    message: "Login endpoint ready—connect Supabase (or your IdP) to issue sessions.",
  })
}

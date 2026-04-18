import { NextResponse } from "next/server"
import { z } from "zod"

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

  // TODO: Supabase Auth signUp + profile row (country, Stripe customer, etc.)
  return NextResponse.json({
    ok: true,
    mock: true,
    message: "Signup validated—persist users in Supabase and enable email verification next.",
  })
}

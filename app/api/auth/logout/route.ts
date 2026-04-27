import { NextResponse } from "next/server"
import { DEMO_COOKIE } from "@/lib/demo-auth"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(DEMO_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}

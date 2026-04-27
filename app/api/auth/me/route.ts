import { NextResponse } from "next/server"
import { getDemoSession } from "@/lib/demo-session"

export async function GET() {
  const user = await getDemoSession()
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user })
}

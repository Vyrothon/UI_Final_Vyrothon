import { cookies } from "next/headers"
import { DEMO_COOKIE, parseDemoUser, type DemoUser } from "@/lib/demo-auth"

export async function getDemoSession(): Promise<DemoUser | null> {
  const jar = await cookies()
  const raw = jar.get(DEMO_COOKIE)?.value
  if (!raw) return null
  return parseDemoUser(raw)
}

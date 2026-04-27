import { NextResponse, type NextRequest } from "next/server"
import { DEMO_COOKIE, parseDemoUser } from "@/lib/demo-auth"

// Supabase session refresh disabled — using demo cookie auth. Re-enable:
// import { updateSession } from "@/lib/supabase/middleware"
// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }

export function middleware(request: NextRequest) {
  const raw = request.cookies.get(DEMO_COOKIE)?.value
  const session = raw ? parseDemoUser(raw) : null
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}

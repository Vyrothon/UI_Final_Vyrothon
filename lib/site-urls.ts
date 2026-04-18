const DEFAULT_SITE_URL = "http://localhost:3000"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

/** Login / signup CTAs. Legacy templates used `/demo` here — treat that as unset so auth goes to real pages. */
function resolveAuthUrl(env: string | undefined, fallback: "/login" | "/signup"): string {
  const v = env?.trim()
  if (!v || v === "/demo") return fallback
  return v
}

export const APP_LOGIN_URL = resolveAuthUrl(process.env.NEXT_PUBLIC_APP_LOGIN_URL, "/login")
export const APP_SIGNUP_URL = resolveAuthUrl(process.env.NEXT_PUBLIC_APP_SIGNUP_URL, "/signup")

export function withSiteUrl(pathname: string) {
  const base = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${base}${path}`
}

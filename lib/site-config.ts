/** ClearClaim marketing + app URLs. Override with NEXT_PUBLIC_* in .env.local */

export const SITE_NAME = "ClearClaim"
export const SITE_NAME_FULL = "ClearClaim AI"

export const SITE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")) || "https://clearclaim.ai"

export function getMarketingUrl(path = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${p === "//" ? "/" : p}`
}

/** Web app login: external app host, or this Next.js site */
export function getAppLoginUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  return base ? `${base}/login` : "/login"
}

/** Web app signup */
export function getAppSignupUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  return base ? `${base}/signup` : "/signup"
}

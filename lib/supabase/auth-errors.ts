import type { AuthError } from "@supabase/supabase-js"

export function formatAuthError(error: AuthError | null): string {
  if (!error) return "Something went wrong."
  const msg = error.message?.toLowerCase() ?? ""

  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password."
  }
  if (msg.includes("email not confirmed")) {
    return "Confirm your email before signing in, or use the link we sent you."
  }
  if (msg.includes("user already registered")) {
    return "An account with this email already exists. Try logging in."
  }
  if (msg.includes("password")) {
    return error.message
  }

  return error.message || "Something went wrong."
}

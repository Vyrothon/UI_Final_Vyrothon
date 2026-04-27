/**
 * Supabase browser client — DISABLED (demo auth via `lib/demo-auth.ts` + `/api/auth/*`).
 * Uncomment below when re-enabling Supabase.
 */
// import { createBrowserClient } from "@supabase/ssr"
// import { getSupabaseAnonKey, getSupabaseUrl } from "./env"
//
// export function createClient() {
//   return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
// }

export function createClient(): never {
  throw new Error("Supabase client is disabled. Use demo login at /api/auth/login.")
}

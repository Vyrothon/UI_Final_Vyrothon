/**
 * Supabase server client — DISABLED (demo auth). Uncomment when re-enabling Supabase.
 */
// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"
// import { getSupabaseAnonKey, getSupabaseUrl } from "./env"
//
// export async function createClient() {
//   const cookieStore = await cookies()
//   return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll()
//       },
//       setAll(cookiesToSet) {
//         try {
//           cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
//         } catch {
//           // Server Component; middleware refreshes session.
//         }
//       },
//     },
//   })
// }

export async function createClient(): Promise<never> {
  throw new Error("Supabase server client is disabled. Use demo session in lib/demo-session.ts.")
}

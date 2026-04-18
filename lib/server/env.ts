import { z } from "zod"

const optionalEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(20).optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().min(1).optional(),
  TAVILY_API_KEY: z.string().min(20).optional(),
  FREE_TIER_SCAN_LIMIT: z.coerce.number().int().positive().default(1),
  CLEARCLAIM_MOCK_MODE: z.coerce.boolean().default(false),
})

type OptionalEnv = z.infer<typeof optionalEnvSchema>

export type ServerEnv = OptionalEnv & {
  NEXT_PUBLIC_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

let cachedEnv: ServerEnv | null = null

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv

  const optional = optionalEnvSchema.parse(process.env)
  if (!optional.CLEARCLAIM_MOCK_MODE) {
    if (!optional.NEXT_PUBLIC_SUPABASE_URL || !optional.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "Invalid server environment configuration: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required unless CLEARCLAIM_MOCK_MODE=true",
      )
    }
  }

  cachedEnv = optional

  return cachedEnv
}

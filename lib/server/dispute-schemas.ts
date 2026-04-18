import { z } from "zod"

export const createDisputeSchema = z.object({
  bill_id: z.string().uuid(),
  send_now: z.boolean().default(true),
})

export const escalateDisputeSchema = z.object({
  dispute_id: z.string().uuid(),
  reason: z.string().min(3).max(500).default("No response from hospital"),
})

export const marketplaceMatchSchema = z.object({
  dispute_id: z.string().uuid(),
  city: z.string().min(2).optional(),
})

export const marketplaceConnectSchema = z.object({
  dispute_id: z.string().uuid(),
  law_firm_id: z.string().uuid(),
})

export const reportOutcomeSchema = z.object({
  dispute_id: z.string().uuid(),
  user_id: z.string(),
  recovered_amount: z.number().nonnegative(),
})

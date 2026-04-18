import { z } from "zod"

const isIsoDate = (value: string) => !Number.isNaN(Date.parse(value))

export const billLineItemSchema = z.object({
  description: z.string().min(2).max(300),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  total: z.number().nonnegative(),
  cpt_code: z.string().max(50).optional().nullable(),
  icd_code: z.string().max(50).optional().nullable(),
})

export const ingestBillSchema = z.object({
  user_id: z.string().uuid(),
  hospital_name: z.string().min(2).max(255),
  patient_name: z.string().min(2).max(255),
  admission_date: z
    .string()
    .refine(isIsoDate, "admission_date must be a valid date")
    .optional()
    .nullable(),
  discharge_date: z
    .string()
    .refine(isIsoDate, "discharge_date must be a valid date")
    .optional()
    .nullable(),
  total_amount: z.number().positive(),
  currency: z.string().min(3).max(10).default("USD"),
  bill_reference: z.string().max(100).optional().nullable(),
  source_type: z.enum(["manual", "pdf", "image"]),
  source_file_url: z.string().url().optional().nullable(),
  line_items: z.array(billLineItemSchema).min(1).max(1000),
})

export const auditRequestSchema = z.object({
  bill_id: z.string().uuid(),
})

export const auditResultSchema = z.object({
  audit_summary: z.object({
    total_billed: z.number(),
    total_legitimate: z.number(),
    overcharge_amount: z.number(),
    overcharge_percent: z.number(),
    verdict: z.enum(["clean", "minor_issues", "significant_fraud", "severe_fraud"]),
    confidence: z.number().min(0).max(100),
    dispute_recommended: z.boolean(),
  }),
  line_items: z.array(
    z.object({
      description: z.string(),
      billed_amount: z.number(),
      legitimate_amount: z.number(),
      status: z.enum(["clean", "flagged", "critical"]),
      fraud_type: z.enum([
        "none",
        "upcoding",
        "unbundling",
        "duplicate",
        "phantom",
        "excessive_markup",
        "drug_anomaly",
      ]),
      explanation: z.string(),
      dispute_strength: z.enum(["strong", "medium", "weak", "na"]),
    }),
  ),
  drug_audit: z.object({
    status: z.enum(["clear", "warning", "critical"]),
    flagged_drugs: z.array(
      z.object({
        name: z.string(),
        reason: z.string(),
        action: z.string(),
      }),
    ),
  }),
  dispute_summary: z.string(),
})

export const documentRequestSchema = z.object({
  bill_id: z.string().uuid(),
  kind: z.enum(["auto", "clean_certificate", "dispute_letter"]).default("auto"),
})

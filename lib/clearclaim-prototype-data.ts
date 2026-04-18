/**
 * Hardcoded prototype data for US hospital billing (USD).
 * Replace with API + DB responses in production.
 */
import type { AuditResult, BillDocument } from "@/lib/types/clearclaim"

export const PROTOTYPE_BILL_ID = "proto-bill-lrmc-847k"

export const prototypeBillDocument: BillDocument = {
  user_id: "prototype-user",
  hospital_name: "Lakeside Regional Medical Center",
  patient_name: "Jordan Avery",
  admission_date: "2026-04-02",
  discharge_date: "2026-04-05",
  total_amount: 84_700,
  currency: "USD",
  bill_reference: "LRMC-2026-04872",
  source_type: "image",
  line_items: [
    { description: "Private room (per day)", quantity: 3, unit_price: 4500, total: 13_500 },
    { description: "Operating room — major procedure (upcoded)", quantity: 1, unit_price: 18_500, total: 18_500 },
    { description: "OR anesthesia", quantity: 1, unit_price: 4200, total: 4200 },
    { description: "IV fluid & administration (excessive markup)", quantity: 12, unit_price: 850, total: 10_200 },
    { description: "Phantom medication — Alkeran (not administered)", quantity: 10, unit_price: 2400, total: 24_000 },
    { description: "Duplicate room charge (day 2)", quantity: 1, unit_price: 4500, total: 4500 },
    { description: "Consumables bundle", quantity: 1, unit_price: 9800, total: 9800 },
  ],
}

/** Matches `AuditResult` in lib/types/clearclaim.ts */
export const prototypeAuditResult: AuditResult = {
  audit_summary: {
    total_billed: 84_700,
    total_legitimate: 53_500,
    overcharge_amount: 31_200,
    overcharge_percent: 36.8,
    verdict: "significant_fraud",
    confidence: 91,
    dispute_recommended: true,
  },
  line_items: [
    {
      description: "Operating room — major procedure (upcoded)",
      billed_amount: 18_500,
      legitimate_amount: 9500,
      status: "critical",
      fraud_type: "upcoding",
      explanation:
        "Coded as highest-level OR; fair market for similar scope at this facility tier is about $9,500 based on Medicare OPPS–style benchmarks.",
      dispute_strength: "strong",
    },
    {
      description: "Phantom medication — Alkeran (not administered)",
      billed_amount: 24_000,
      legitimate_amount: 0,
      status: "critical",
      fraud_type: "phantom",
      explanation: "No administration record in discharge paperwork; oncology agent not consistent with appendectomy stay.",
      dispute_strength: "strong",
    },
    {
      description: "Duplicate room charge (day 2)",
      billed_amount: 4500,
      legitimate_amount: 0,
      status: "flagged",
      fraud_type: "duplicate",
      explanation: "Same ward day appears twice with identical rate.",
      dispute_strength: "strong",
    },
    {
      description: "IV fluid & administration (excessive markup)",
      billed_amount: 10_200,
      legitimate_amount: 1800,
      status: "flagged",
      fraud_type: "excessive_markup",
      explanation: "IV fluids billed far above typical hospital acquisition + reasonable markup for this setting.",
      dispute_strength: "medium",
    },
    {
      description: "Consumables bundle",
      billed_amount: 9800,
      legitimate_amount: 6000,
      status: "flagged",
      fraud_type: "unbundling",
      explanation: "Items that should roll into global surgical package appear as add-on lines.",
      dispute_strength: "medium",
    },
  ],
  drug_audit: {
    status: "critical",
    flagged_drugs: [
      {
        name: "Melphalan (Alkeran)",
        reason: "Not plausibly indicated for the documented procedure; no oncology pathway on record.",
        action: "Request itemized administration logs; consult your physician — informational only, not medical advice.",
      },
      {
        name: "Ceftriaxone + Linezolid",
        reason: "Combination warrants pharmacist review for overlap; billing shows both extended courses.",
        action: "Verify with treating team if both were clinically required.",
      },
    ],
  },
  dispute_summary:
    "You were billed $84,700; our benchmark suggests about $53,500 is defensible before duplicates and phantom lines. Ask billing to reconcile OR coding, remove the duplicate ward day, and provide MAR documentation for Alkeran.",
}

export const prototypeCleanAudit: AuditResult = {
  audit_summary: {
    total_billed: 11_200,
    total_legitimate: 10_800,
    overcharge_amount: 400,
    overcharge_percent: 3.6,
    verdict: "minor_issues",
    confidence: 94,
    dispute_recommended: false,
  },
  line_items: [
    {
      description: "Observation & lab bundle (urgent care)",
      billed_amount: 11_200,
      legitimate_amount: 10_800,
      status: "clean",
      fraud_type: "none",
      explanation: "Minor bundling variance; within tolerance for informal review.",
      dispute_strength: "na",
    },
  ],
  drug_audit: { status: "clear", flagged_drugs: [] },
  dispute_summary: "No material billing anomalies detected. Minor differences are within normal tolerance.",
}

export type EscalationLevel = 1 | 2 | 3 | 4 | 5 | 6

export type EscalationStep = {
  level: EscalationLevel
  title: string
  description: string
  status: "done" | "current" | "upcoming"
  due?: string
}

export const prototypeEscalation: EscalationStep[] = [
  {
    level: 1,
    title: "Hospital billing department",
    description: "Formal dispute letter sent with itemized table and 14-day response deadline.",
    status: "done",
    due: "2026-04-10",
  },
  {
    level: 2,
    title: "CEO / chief medical officer letter",
    description: "Escalation drafted; scheduled if no substantive reply.",
    status: "current",
    due: "2026-04-24",
  },
  {
    level: 3,
    title: "State medical board inquiry (if applicable)",
    description: "Template prepared if clinical misrepresentation is evidenced.",
    status: "upcoming",
  },
  {
    level: 4,
    title: "CFPB / state consumer protection",
    description: "Billing practices and surprise billing channels — informational templates only.",
    status: "upcoming",
  },
  {
    level: 5,
    title: "Partner law firm referral",
    description: "Pre-packaged case file for claims above threshold.",
    status: "upcoming",
  },
  {
    level: 6,
    title: "Small claims / arbitration checklist",
    description: "Educational checklist — not legal representation.",
    status: "upcoming",
  },
]

export type LawFirmCard = {
  id: string
  name: string
  city: string
  specializations: string[]
  responseSlaHours: number
  quoteRangeUsd: string
}

export const prototypeLawFirms: LawFirmCard[] = [
  {
    id: "firm-1",
    name: "Riverside Medical Billing Law Group",
    city: "Chicago",
    specializations: ["Hospital overcharge", "ERISA / state appeals"],
    responseSlaHours: 24,
    quoteRangeUsd: "$15k – $35k retainer",
  },
  {
    id: "firm-2",
    name: "Heartland Patient Advocacy LLP",
    city: "Dallas",
    specializations: ["Insurance", "In-network disputes"],
    responseSlaHours: 18,
    quoteRangeUsd: "Contingency + flat review fee",
  },
  {
    id: "firm-3",
    name: "Federal Healthcare Rights Center",
    city: "Washington",
    specializations: ["Multi-facility patterns", "Class coordination"],
    responseSlaHours: 36,
    quoteRangeUsd: "$5k – $10k consult",
  },
]

export type TrackerEvent = {
  id: string
  at: string
  direction: "outbound" | "inbound"
  title: string
  detail: string
}

export const prototypeTracker: TrackerEvent[] = [
  {
    id: "t1",
    at: "2026-04-08",
    direction: "outbound",
    title: "Dispute letter emailed to billing@lakesidermc.example",
    detail: "PDF package #LRMC-2026-04872 attached; 14-day clock started.",
  },
  {
    id: "t2",
    at: "2026-04-09",
    direction: "inbound",
    title: "Auto-receipt acknowledged",
    detail: "Ticket #88321 — “We are reviewing.”",
  },
  {
    id: "t3",
    at: "2026-04-16",
    direction: "outbound",
    title: "Follow-up reminder scheduled",
    detail: "Escalation to Level 2 prepared if no itemized response.",
  },
]

export const prototypeDisputeLetterIntro = `Dear Billing Department,

Re: Patient ${prototypeBillDocument.patient_name} — Bill reference ${prototypeBillDocument.bill_reference}

We write to dispute several line items on the above bill totaling $${prototypeAuditResult.audit_summary.overcharge_amount.toLocaleString("en-US")} in questioned charges. Please find an itemized table attached mirroring our audit. We request a written reconciliation within 14 days.

This communication is for billing clarification and is not legal advice.`

export const DISCLAIMER_SHORT =
  "ClearClaim is not a law firm and does not provide legal or medical advice. Generated documents are aids for your review."

/**
 * Hardcoded dataset for dashboard panels (US / USD prototype).
 */
import {
  prototypeAuditResult,
  prototypeBillDocument,
  prototypeCleanAudit,
  prototypeLawFirms,
  prototypeTracker,
} from "@/lib/clearclaim-prototype-data"

export type AuditFlagKind =
  | "clean"
  | "upcoding"
  | "duplicate"
  | "phantom"
  | "unbundling"
  | "markup"

export const FLAG_LABEL: Record<AuditFlagKind, string> = {
  clean: "Clean",
  upcoding: "Upcoding",
  duplicate: "Duplicate",
  phantom: "Phantom",
  unbundling: "Unbundling",
  markup: "Markup",
}

function mapFraudToFlag(
  fraud: string,
): AuditFlagKind {
  if (fraud === "none" || fraud === "clean") return "clean"
  if (fraud === "duplicate") return "duplicate"
  if (fraud === "phantom") return "phantom"
  if (fraud === "unbundling") return "unbundling"
  if (fraud === "excessive_markup") return "markup"
  if (fraud === "upcoding") return "upcoding"
  return "clean"
}

export const DEMO_AUDIT_META = {
  hospital: prototypeBillDocument.hospital_name,
  patientRef: prototypeBillDocument.bill_reference ?? "REF",
  billDate: `${prototypeBillDocument.admission_date} – ${prototypeBillDocument.discharge_date}`,
  currency: "USD" as const,
  confidence: prototypeAuditResult.audit_summary.confidence / 100,
}

export type DemoAuditLine = {
  id: string
  description: string
  code: string
  billed: number
  fairEstimate: number
  flag: AuditFlagKind
  explanation: string
}

function toDemoLines(
  rows: typeof prototypeAuditResult.line_items,
): DemoAuditLine[] {
  return rows.map((row, i) => ({
    id: `line-${i}`,
    description: row.description,
    code: row.dispute_strength === "na" ? "—" : `CHK-${i + 1}`,
    billed: row.billed_amount,
    fairEstimate: row.legitimate_amount,
    flag: mapFraudToFlag(row.fraud_type),
    explanation: row.explanation,
  }))
}

export const DEMO_AUDIT_LINES: DemoAuditLine[] = toDemoLines(prototypeAuditResult.line_items)

export type DemoScanScenario = "fraud" | "clean"

export function demoAuditLinesForScenario(scenario: DemoScanScenario): DemoAuditLine[] {
  const rows =
    scenario === "fraud" ? prototypeAuditResult.line_items : prototypeCleanAudit.line_items
  return toDemoLines(rows)
}

export function demoAuditMetaForScenario(scenario: DemoScanScenario) {
  const summary =
    scenario === "fraud" ? prototypeAuditResult.audit_summary : prototypeCleanAudit.audit_summary
  return {
    hospital: prototypeBillDocument.hospital_name,
    patientRef: prototypeBillDocument.bill_reference ?? "REF",
    billDate: `${prototypeBillDocument.admission_date} – ${prototypeBillDocument.discharge_date}`,
    currency: "USD" as const,
    confidence: summary.confidence / 100,
  }
}

export function auditSummaryForScenario(scenario: DemoScanScenario) {
  return scenario === "fraud" ? prototypeAuditResult.audit_summary : prototypeCleanAudit.audit_summary
}

export function demoAuditTotals(lines: DemoAuditLine[]) {
  const billed = lines.reduce((s, l) => s + l.billed, 0)
  const fair = lines.reduce((s, l) => s + l.fairEstimate, 0)
  return { billed, fair, overcharge: Math.max(0, billed - fair) }
}

export type LetterDoc = {
  id: string
  kind: "dispute" | "follow_up" | "hipaa" | "template"
  title: string
  created: string
  pages: number
  summary: string
}

export const DEMO_LETTERS: LetterDoc[] = [
  {
    id: "ltr-1",
    kind: "dispute",
    title: "Formal dispute — billing department",
    created: "2026-04-08",
    pages: 3,
    summary: "Itemized challenges for OT upcoding, duplicate ward day, and phantom medication line.",
  },
  {
    id: "ltr-2",
    kind: "follow_up",
    title: "14-day follow-up reminder",
    created: "2026-04-22",
    pages: 1,
    summary: "Short reminder referencing original dispute and requested reconciliation deadline.",
  },
]

export type DisputeStatus = "draft" | "sent" | "awaiting" | "escalated" | "resolved"

export type DemoDispute = {
  id: string
  hospital: string
  status: DisputeStatus
  opened: string
  dueBy?: string
  disputedAmount: number
  recovered?: number
  lastEvent: string
}

export const DEMO_DISPUTES: DemoDispute[] = [
  {
    id: "DSP-LRMC-01",
    hospital: prototypeBillDocument.hospital_name,
    status: "awaiting",
    opened: "2026-04-08",
    dueBy: "2026-04-24",
    disputedAmount: prototypeAuditResult.audit_summary.overcharge_amount,
    lastEvent: "Dispute email acknowledged by hospital ticket #88321.",
  },
  {
    id: "DSP-NH-UC-02",
    hospital: "North Harbor Urgent Care Network",
    status: "resolved",
    opened: "2026-03-12",
    disputedAmount: 400,
    recovered: 400,
    lastEvent: "Minor variance credited to patient portal.",
  },
]

export type FirmSpecialty = "billing" | "insurance" | "medmal"

export type DemoFirm = {
  id: string
  name: string
  city: string
  state: string
  specialty: FirmSpecialty
  blurb: string
  winRatePct: number
  avgRecoveryK: number
  responseHrs: number
  intakeFeeLabel: string
}

export const DEMO_FIRMS: DemoFirm[] = prototypeLawFirms.map((f, i) => ({
  id: f.id,
  name: f.name,
  city: f.city,
  state: i === 0 ? "IL" : i === 1 ? "TX" : "DC",
  specialty: (["billing", "insurance", "medmal"] as const)[i],
  blurb: `${f.specializations[0]} — illustrative ranking.`,
  winRatePct: 78 + i * 3,
  avgRecoveryK: 42 + i * 18,
  responseHrs: f.responseSlaHours,
  intakeFeeLabel: f.quoteRangeUsd,
}))

export { prototypeTracker as DEMO_CORRESPONDENCE }

export type DemoMalpracticeFlag = {
  id: string
  treatment: string
  issue: string
  severity: "review" | "high"
}

/** Hardcoded clinical-necessity flags — demo only; not a diagnosis. */
export const DEMO_MALPRACTICE_ITEMS: DemoMalpracticeFlag[] = [
  {
    id: "mp-1",
    treatment: "Extended dual IV antibiotics (ceftriaxone + linezolid)",
    issue:
      "Stay was documented as routine appendectomy without positive blood cultures or sepsis criteria; prolonged broad-spectrum coverage may not match guideline duration for this presentation.",
    severity: "high",
  },
  {
    id: "mp-2",
    treatment: "Repeat CT abdomen without new clinical change",
    issue:
      "Second contrast CT billed 36h after first stable read; insurer-style review would ask for documented change in exam or labs.",
    severity: "review",
  },
  {
    id: "mp-3",
    treatment: "Inpatient observation extension (day 4)",
    issue:
      "Discharge-ready notes on day 3; extra ward day appears discretionary relative to documented milestones.",
    severity: "review",
  },
]

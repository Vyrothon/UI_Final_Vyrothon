/** Hardcoded demo content for the workspace (no backend). */

export type AuditFlagKind = "upcoding" | "duplicate" | "phantom" | "unbundling" | "markup" | "clean"

export type AuditLineItem = {
  id: string
  description: string
  code: string
  billed: number
  fairEstimate: number
  flag: AuditFlagKind
  explanation: string
}

export const DEMO_AUDIT_META = {
  hospital: "Metro General Hospital",
  patientRef: "CC-DEMO-4891",
  billDate: "March 18, 2026",
  currency: "USD",
  confidence: 0.87,
}

export const DEMO_AUDIT_LINES: AuditLineItem[] = [
  {
    id: "1",
    description: "Facility / room & board (3 nights)",
    code: "99233 ×3",
    billed: 9600,
    fairEstimate: 5400,
    flag: "markup",
    explanation: "Per-night rate ~62% above regional published benchmark for similar acuity.",
  },
  {
    id: "2",
    description: "Operating room time",
    code: "63650",
    billed: 8200,
    fairEstimate: 4100,
    flag: "upcoding",
    explanation: "Documentation supports ~2.5 hr block; bill shows 5.0 hr at peak tier.",
  },
  {
    id: "3",
    description: "Pharmacy — IV antibiotic",
    code: "J0690",
    billed: 1840,
    fairEstimate: 920,
    flag: "duplicate",
    explanation: "Same NDC and day appears twice under different line descriptions.",
  },
  {
    id: "4",
    description: "Sterile procedure tray",
    code: "SUP-OT-12",
    billed: 2499,
    fairEstimate: 0,
    flag: "phantom",
    explanation: "Tray already bundled into primary procedure per standard coding; no separate charge.",
  },
  {
    id: "5",
    description: "Emergency dept. physician fee",
    code: "99285",
    billed: 6200,
    fairEstimate: 5800,
    flag: "clean",
    explanation: "Within normal range for Level 5 ED visit in this region.",
  },
  {
    id: "6",
    description: "Recovery room monitoring (add-on)",
    code: "PACU-ADD",
    billed: 1400,
    fairEstimate: 0,
    flag: "unbundling",
    explanation: "PACU monitoring already included in primary anesthesia / facility bundle for this procedure.",
  },
]

export function demoAuditTotals(lines: AuditLineItem[]) {
  const billed = lines.reduce((s, l) => s + l.billed, 0)
  const fair = lines.reduce((s, l) => s + l.fairEstimate, 0)
  return { billed, fair, overcharge: Math.max(0, billed - fair) }
}

export type DisputeStatus = "draft" | "sent" | "awaiting" | "escalated" | "resolved"

export type DisputeCase = {
  id: string
  hospital: string
  status: DisputeStatus
  opened: string
  dueBy?: string
  lastEvent: string
  disputedAmount: number
  recovered?: number
}

export const DEMO_DISPUTES: DisputeCase[] = [
  {
    id: "D-2026-0142",
    hospital: "Metro General Hospital",
    status: "awaiting",
    opened: "Apr 2, 2026",
    dueBy: "Apr 28, 2026",
    lastEvent: "Initial dispute letter emailed to billing; read receipt confirmed.",
    disputedAmount: 16300,
  },
  {
    id: "D-2026-0118",
    hospital: "Lakeside Outpatient Surgery",
    status: "escalated",
    opened: "Mar 9, 2026",
    lastEvent: "No substantive response in 21 days — pack sent to partner counsel.",
    disputedAmount: 4200,
  },
  {
    id: "D-2026-0099",
    hospital: "Northside Imaging Center",
    status: "resolved",
    opened: "Jan 14, 2026",
    lastEvent: "Hospital issued credit; patient confirmed on Mar 1.",
    disputedAmount: 1180,
    recovered: 950,
  },
]

export type LetterDoc = {
  id: string
  title: string
  kind: "dispute" | "follow_up" | "hipaa" | "template"
  created: string
  pages: number
  summary: string
}

export const DEMO_LETTERS: LetterDoc[] = [
  {
    id: "L-01",
    title: "Formal dispute — Metro General itemized charges",
    kind: "dispute",
    created: "Apr 2, 2026",
    pages: 4,
    summary: "Cites duplicate pharmacy, OR upcoding, and unbundled supply line; 14-day response request.",
  },
  {
    id: "L-02",
    title: "Follow-up demand letter",
    kind: "follow_up",
    created: "Apr 16, 2026",
    pages: 2,
    summary: "Second notice referencing non-response; preserves escalation rights.",
  },
  {
    id: "L-03",
    title: "HIPAA records request (template)",
    kind: "hipaa",
    created: "Apr 1, 2026",
    pages: 1,
    summary: "Fill-in template for itemized billing and medical records.",
  },
  {
    id: "L-04",
    title: "Insurance EOB reconciliation worksheet",
    kind: "template",
    created: "Mar 28, 2026",
    pages: 3,
    summary: "Side-by-side EOB vs hospital bill for appeals.",
  },
]

export type FirmSpecialty = "billing" | "medmal" | "insurance"

export type DemoFirm = {
  id: string
  name: string
  city: string
  state: string
  specialty: FirmSpecialty
  winRatePct: number
  avgRecoveryK: number
  responseHrs: number
  intakeFeeLabel: string
  blurb: string
}

export const DEMO_FIRMS: DemoFirm[] = [
  {
    id: "F-01",
    name: "Hartwell & Reeves LLP",
    city: "Chicago",
    state: "IL",
    specialty: "billing",
    winRatePct: 71,
    avgRecoveryK: 18,
    responseHrs: 6,
    intakeFeeLabel: "$400 intake · 6% referred contingency",
    blurb: "Patient billing disputes, surprise bills, and hospital overcharges.",
  },
  {
    id: "F-02",
    name: "Pacific Consumer Health Law",
    city: "Los Angeles",
    state: "CA",
    specialty: "insurance",
    winRatePct: 64,
    avgRecoveryK: 24,
    responseHrs: 12,
    intakeFeeLabel: "$400 intake · 6% referred contingency",
    blurb: "EOBs, bad-faith delays, and out-of-network negotiation.",
  },
  {
    id: "F-03",
    name: "Morgan Ellis Trial Group",
    city: "Houston",
    state: "TX",
    specialty: "medmal",
    winRatePct: 58,
    avgRecoveryK: 210,
    responseHrs: 24,
    intakeFeeLabel: "$400 intake · 6% referred contingency",
    blurb: "High-dollar cases with clinical + billing overlap; contingency-heavy.",
  },
  {
    id: "F-04",
    name: "ClearPoint Legal PLLC",
    city: "Austin",
    state: "TX",
    specialty: "billing",
    winRatePct: 69,
    avgRecoveryK: 11,
    responseHrs: 8,
    intakeFeeLabel: "$400 intake · 6% referred contingency",
    blurb: "Fast intake for audits under $50k; telehealth-friendly.",
  },
]

export const FLAG_LABEL: Record<AuditFlagKind, string> = {
  upcoding: "Upcoding",
  duplicate: "Duplicate",
  phantom: "Phantom / bundled",
  unbundling: "Unbundling",
  markup: "Excessive markup",
  clean: "Clean",
}

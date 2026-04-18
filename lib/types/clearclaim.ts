export type BillStatus = "ingested" | "audited" | "document_generated"

export type FraudType =
  | "none"
  | "upcoding"
  | "unbundling"
  | "duplicate"
  | "phantom"
  | "excessive_markup"
  | "drug_anomaly"

export type LineItemStatus = "clean" | "flagged" | "critical"
export type DisputeStrength = "strong" | "medium" | "weak" | "na"
export type Verdict = "clean" | "minor_issues" | "significant_fraud" | "severe_fraud"
export type DrugAuditStatus = "clear" | "warning" | "critical"
export type GeneratedDocumentType = "clean_certificate" | "dispute_letter"

export interface BillLineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
  cpt_code?: string | null
  icd_code?: string | null
}

export interface BillDocument {
  user_id: string
  hospital_name: string
  patient_name: string
  admission_date?: string | null
  discharge_date?: string | null
  total_amount: number
  currency: string
  bill_reference?: string | null
  source_type: "manual" | "pdf" | "image"
  source_file_url?: string | null
  line_items: BillLineItem[]
}

export interface AuditLineItemResult {
  description: string
  billed_amount: number
  legitimate_amount: number
  status: LineItemStatus
  fraud_type: FraudType
  explanation: string
  dispute_strength: DisputeStrength
}

export interface DrugAuditFlag {
  name: string
  reason: string
  action: string
}

export interface AuditResult {
  audit_summary: {
    total_billed: number
    total_legitimate: number
    overcharge_amount: number
    overcharge_percent: number
    verdict: Verdict
    confidence: number
    dispute_recommended: boolean
  }
  line_items: AuditLineItemResult[]
  drug_audit: {
    status: DrugAuditStatus
    flagged_drugs: DrugAuditFlag[]
  }
  dispute_summary: string
}

export interface DisputeLetterPayload {
  bill_id: string
  audit_report_id: string
  patient_name: string
  hospital_name: string
  bill_reference?: string | null
  disputed_items: AuditLineItemResult[]
  total_disputed: number
  requested_total: number
}

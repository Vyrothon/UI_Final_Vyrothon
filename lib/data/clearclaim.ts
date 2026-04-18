import { promises as fs } from "node:fs"
import path from "node:path"
import type { BillDocument } from "@/lib/types/clearclaim"
import { getServerEnv } from "@/lib/server/env"
import { getSupabaseAdminClient } from "@/lib/server/supabase"

const MOCK_DB_PATH = path.join(process.cwd(), ".clearclaim-mock-db.json")

function mockMode() {
  return getServerEnv().CLEARCLAIM_MOCK_MODE
}

type MockDb = {
  users: string[]
  bills: Record<string, Record<string, any>>
  lineItems: Record<string, Array<Record<string, any>>>
  usage: Record<string, number>
  audits: Record<string, Record<string, any>>
  documents: Record<string, Record<string, any>>
}

async function readMockDb(): Promise<MockDb> {
  try {
    const raw = await fs.readFile(MOCK_DB_PATH, "utf8")
    return JSON.parse(raw) as MockDb
  } catch {
    return {
      users: [],
      bills: {},
      lineItems: {},
      usage: {},
      audits: {},
      documents: {},
    }
  }
}

async function writeMockDb(db: MockDb) {
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify(db, null, 2), "utf8")
}

export function currentPeriodKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

export async function ensureUserRecord(userId: string) {
  if (mockMode()) {
    const db = await readMockDb()
    if (!db.users.includes(userId)) db.users.push(userId)
    await writeMockDb(db)
    return
  }
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("users").upsert({ id: userId }, { onConflict: "id" })
  if (error) throw new Error(`Failed to ensure user: ${error.message}`)
}

export async function incrementUsageCounter(userId: string, periodKey = currentPeriodKey()) {
  if (mockMode()) {
    const key = `${userId}:${periodKey}`
    const db = await readMockDb()
    const next = (db.usage[key] ?? 0) + 1
    db.usage[key] = next
    await writeMockDb(db)
    return next
  }
  const supabase = getSupabaseAdminClient()
  const { data: existing, error: fetchError } = await supabase
    .from("usage_counters")
    .select("id, scans_count")
    .eq("user_id", userId)
    .eq("period_key", periodKey)
    .maybeSingle()

  if (fetchError) throw new Error(`Failed to read usage counter: ${fetchError.message}`)

  if (!existing) {
    const { data, error } = await supabase
      .from("usage_counters")
      .insert({
        user_id: userId,
        period_key: periodKey,
        scans_count: 1,
      })
      .select("scans_count")
      .single()

    if (error) throw new Error(`Failed to create usage counter: ${error.message}`)
    return data.scans_count as number
  }

  const { data, error } = await supabase
    .from("usage_counters")
    .update({ scans_count: Number(existing.scans_count) + 1, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select("scans_count")
    .single()

  if (error) throw new Error(`Failed to update usage counter: ${error.message}`)
  return data.scans_count as number
}

export async function getUsageCount(userId: string, periodKey = currentPeriodKey()) {
  if (mockMode()) {
    const db = await readMockDb()
    return db.usage[`${userId}:${periodKey}`] ?? 0
  }
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("usage_counters")
    .select("scans_count")
    .eq("user_id", userId)
    .eq("period_key", periodKey)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch usage count: ${error.message}`)
  return Number(data?.scans_count ?? 0)
}

export async function createBillWithLineItems(payload: BillDocument) {
  if (mockMode()) {
    const db = await readMockDb()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const bill = {
      id,
      user_id: payload.user_id,
      hospital_name: payload.hospital_name,
      patient_name: payload.patient_name,
      admission_date: payload.admission_date ?? null,
      discharge_date: payload.discharge_date ?? null,
      total_amount: payload.total_amount,
      currency: payload.currency,
      bill_reference: payload.bill_reference ?? null,
      source_type: payload.source_type,
      source_file_url: payload.source_file_url ?? null,
      status: "ingested",
      created_at: now,
      updated_at: now,
    }
    db.bills[id] = bill
    db.lineItems[id] = payload.line_items.map((lineItem) => ({
        id: crypto.randomUUID(),
        bill_id: id,
        ...lineItem,
        created_at: now,
      }))
    await writeMockDb(db)
    return bill
  }
  const supabase = getSupabaseAdminClient()

  const { data: bill, error: billError } = await supabase
    .from("bills")
    .insert({
      user_id: payload.user_id,
      hospital_name: payload.hospital_name,
      patient_name: payload.patient_name,
      admission_date: payload.admission_date ?? null,
      discharge_date: payload.discharge_date ?? null,
      total_amount: payload.total_amount,
      currency: payload.currency,
      bill_reference: payload.bill_reference ?? null,
      source_type: payload.source_type,
      source_file_url: payload.source_file_url ?? null,
      status: "ingested",
    })
    .select("*")
    .single()

  if (billError) throw new Error(`Failed to create bill: ${billError.message}`)

  const lineItemsPayload = payload.line_items.map((lineItem) => ({
    bill_id: bill.id,
    description: lineItem.description,
    quantity: lineItem.quantity,
    unit_price: lineItem.unit_price,
    total: lineItem.total,
    cpt_code: lineItem.cpt_code ?? null,
    icd_code: lineItem.icd_code ?? null,
  }))

  const { error: lineItemError } = await supabase.from("bill_line_items").insert(lineItemsPayload)
  if (lineItemError) throw new Error(`Failed to create line items: ${lineItemError.message}`)

  return bill
}

export async function getBillWithLineItems(billId: string) {
  if (mockMode()) {
    const db = await readMockDb()
    const bill = db.bills[billId]
    if (!bill) throw new Error("Bill not found")
    return { ...bill, bill_line_items: db.lineItems[billId] ?? [] }
  }
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bills")
    .select("*, bill_line_items(*)")
    .eq("id", billId)
    .single()

  if (error) throw new Error(`Failed to read bill: ${error.message}`)
  return data
}

export async function upsertAuditReport(billId: string, audit: Record<string, unknown>) {
  if (mockMode()) {
    const db = await readMockDb()
    const summary = audit.audit_summary as Record<string, unknown>
    const existing = db.audits[billId]
    const now = new Date().toISOString()
    const data = {
      id: existing?.id ?? crypto.randomUUID(),
      bill_id: billId,
      total_billed: summary.total_billed,
      total_legitimate: summary.total_legitimate,
      overcharge_amount: summary.overcharge_amount,
      overcharge_percent: summary.overcharge_percent,
      verdict: summary.verdict,
      confidence: summary.confidence,
      dispute_recommended: summary.dispute_recommended,
      dispute_summary: audit.dispute_summary,
      audit_json: audit,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    }
    db.audits[billId] = data
    const bill = db.bills[billId]
    if (bill) bill.status = "audited"
    await writeMockDb(db)
    return data
  }
  const supabase = getSupabaseAdminClient()
  const summary = audit.audit_summary as Record<string, unknown>
  const { data, error } = await supabase
    .from("audit_reports")
    .upsert(
      {
        bill_id: billId,
        total_billed: summary.total_billed,
        total_legitimate: summary.total_legitimate,
        overcharge_amount: summary.overcharge_amount,
        overcharge_percent: summary.overcharge_percent,
        verdict: summary.verdict,
        confidence: summary.confidence,
        dispute_recommended: summary.dispute_recommended,
        dispute_summary: audit.dispute_summary,
        audit_json: audit,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "bill_id" },
    )
    .select("*")
    .single()

  if (error) throw new Error(`Failed to write audit report: ${error.message}`)

  const { error: statusError } = await supabase
    .from("bills")
    .update({ status: "audited", updated_at: new Date().toISOString() })
    .eq("id", billId)
  if (statusError) throw new Error(`Failed to update bill status: ${statusError.message}`)

  return data
}

export async function getAuditReportByBillId(billId: string) {
  if (mockMode()) {
    const db = await readMockDb()
    return db.audits[billId] ?? null
  }
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("audit_reports").select("*").eq("bill_id", billId).maybeSingle()
  if (error) throw new Error(`Failed to read audit report: ${error.message}`)
  return data
}

export async function insertGeneratedDocument(input: {
  bill_id: string
  audit_report_id?: string | null
  document_type: "clean_certificate" | "dispute_letter"
  file_name: string
  file_content: string
  metadata?: Record<string, unknown>
}) {
  if (mockMode()) {
    const db = await readMockDb()
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const data = {
      id,
      ...input,
      metadata: input.metadata ?? {},
      created_at: now,
    }
    db.documents[id] = data
    const bill = db.bills[input.bill_id]
    if (bill) bill.status = "document_generated"
    await writeMockDb(db)
    return data
  }
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("generated_documents")
    .insert({
      ...input,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to store generated document: ${error.message}`)

  const { error: statusError } = await supabase
    .from("bills")
    .update({ status: "document_generated", updated_at: new Date().toISOString() })
    .eq("id", input.bill_id)
  if (statusError) throw new Error(`Failed to update bill document status: ${statusError.message}`)

  return data
}

export async function getRelevantRateBenchmarks(descriptions: string[]) {
  if (mockMode()) {
    const mockRates = [
      { description: "General follow-up consultation", standard_rate_pkr_min: 150, standard_rate_pkr_max: 500 },
      { description: "Comprehensive surgical consultation", standard_rate_pkr_min: 400, standard_rate_pkr_max: 900 },
      { description: "Appendectomy procedure package", standard_rate_pkr_min: 9000, standard_rate_pkr_max: 16000 },
      { description: "Operation theatre anesthesia charge", standard_rate_pkr_min: 2500, standard_rate_pkr_max: 6000 },
      { description: "General ward room day", standard_rate_pkr_min: 800, standard_rate_pkr_max: 1800 },
      { description: "IV fluid consumable bag", standard_rate_pkr_min: 25, standard_rate_pkr_max: 120 },
    ]
    const lowered = descriptions.map((item) => item.toLowerCase())
    return mockRates.filter((item) => {
      const description = item.description.toLowerCase()
      return lowered.some((d) => description.includes(d) || d.includes(description))
    })
  }
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("rate_benchmarks").select("*")
  if (error) throw new Error(`Failed to read rate benchmarks: ${error.message}`)

  const lowered = descriptions.map((item) => item.toLowerCase())
  return (data ?? []).filter((item) => {
    const description = String(item.description ?? "").toLowerCase()
    return lowered.some((d) => description.includes(d) || d.includes(description))
  })
}

"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function generateId() {
  const browserCrypto = typeof globalThis !== "undefined" ? (globalThis.crypto as Crypto | undefined) : undefined
  if (browserCrypto && typeof browserCrypto.randomUUID === "function") {
    return browserCrypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

type IngestPayload = {
  user_id: string
  hospital_name: string
  patient_name: string
  admission_date?: string
  discharge_date?: string
  total_amount: number
  currency: string
  bill_reference?: string
  source_type: "manual" | "pdf" | "image"
  line_items: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
}

type AuditResult = {
  audit_summary: {
    total_billed: number
    total_legitimate: number
    overcharge_amount: number
    overcharge_percent: number
    verdict: "clean" | "minor_issues" | "significant_fraud" | "severe_fraud"
    confidence: number
    dispute_recommended: boolean
  }
  line_items: Array<{
    description: string
    billed_amount: number
    legitimate_amount: number
    status: "clean" | "flagged" | "critical"
    fraud_type: string
    explanation: string
  }>
  dispute_summary: string
}

const cleanFixture: IngestPayload = {
  user_id: generateId(),
  hospital_name: "North Harbor Urgent Care",
  patient_name: "Alex Rivera",
  admission_date: "2026-04-01",
  discharge_date: "2026-04-03",
  total_amount: 11_200,
  currency: "USD",
  bill_reference: "NH-UC-CLEAN-2026-01",
  source_type: "manual",
  line_items: [
    { description: "Observation & lab bundle", quantity: 1, unit_price: 11_200, total: 11_200 },
  ],
}

const fraudFixture: IngestPayload = {
  user_id: generateId(),
  hospital_name: "Lakeside Regional Medical Center",
  patient_name: "Jordan Avery",
  admission_date: "2026-04-02",
  discharge_date: "2026-04-05",
  total_amount: 84_700,
  currency: "USD",
  bill_reference: "LRMC-2026-04872",
  source_type: "manual",
  line_items: [
    { description: "OR anesthesia charge", quantity: 1, unit_price: 4200, total: 4200 },
    { description: "Private room (per day)", quantity: 3, unit_price: 4500, total: 13_500 },
    { description: "Operating room — major procedure", quantity: 1, unit_price: 18_500, total: 18_500 },
    { description: "IV fluid & administration", quantity: 12, unit_price: 850, total: 10_200 },
    { description: "Phantom medication line", quantity: 10, unit_price: 2400, total: 24_000 },
    { description: "Duplicate room charge", quantity: 1, unit_price: 4500, total: 4500 },
    { description: "Consumables bundle", quantity: 1, unit_price: 9800, total: 9800 },
  ],
}

export default function ClearClaimWorkbench() {
  const [payloadText, setPayloadText] = useState(JSON.stringify(fraudFixture, null, 2))
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billId, setBillId] = useState<string | null>(null)
  const [audit, setAudit] = useState<AuditResult | null>(null)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [documentBase64, setDocumentBase64] = useState<string | null>(null)

  const flaggedItems = useMemo(() => audit?.line_items.filter((item) => item.status !== "clean") ?? [], [audit])

  const runPipeline = async () => {
    setIsRunning(true)
    setError(null)
    setBillId(null)
    setAudit(null)
    setDocumentName(null)
    setDocumentBase64(null)

    try {
      const parsed = JSON.parse(payloadText) as IngestPayload

      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      })
      const ingestJson = await ingestRes.json()
      if (!ingestRes.ok) throw new Error(ingestJson.error || "Ingest failed")
      setBillId(ingestJson.bill_id)

      const auditRes = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill_id: ingestJson.bill_id }),
      })
      const auditJson = await auditRes.json()
      if (!auditRes.ok) throw new Error(auditJson.error || "Audit failed")
      setAudit(auditJson.result)

      const docRes = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill_id: ingestJson.bill_id, kind: "auto" }),
      })
      const docJson = await docRes.json()
      if (!docRes.ok) throw new Error(docJson.error || "Document generation failed")
      setDocumentName(docJson.file_name)
      setDocumentBase64(docJson.file_content_base64)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error")
    } finally {
      setIsRunning(false)
    }
  }

  const downloadDocument = () => {
    if (!documentBase64 || !documentName) return
    const anchor = document.createElement("a")
    anchor.href = `data:application/pdf;base64,${documentBase64}`
    anchor.download = documentName
    anchor.click()
  }

  return (
    <div className="grid gap-6">
      <Card className="p-5 border border-gray-200">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => setPayloadText(JSON.stringify({ ...cleanFixture, user_id: generateId() }, null, 2))}
          >
            Load Clean Fixture
          </Button>
          <Button
            variant="outline"
            onClick={() => setPayloadText(JSON.stringify({ ...fraudFixture, user_id: generateId() }, null, 2))}
          >
            Load Fraud Fixture
          </Button>
          <Button onClick={runPipeline} disabled={isRunning}>
            {isRunning ? "Running pipeline..." : "Run Full Pipeline"}
          </Button>
        </div>

        <label className="text-sm font-medium">Ingest payload JSON</label>
        <Textarea
          value={payloadText}
          onChange={(e) => setPayloadText(e.target.value)}
          className="mt-2 min-h-[320px] font-mono text-xs"
        />
      </Card>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 text-red-700">
          <p className="font-medium">Pipeline error</p>
          <p className="text-sm">{error}</p>
        </Card>
      )}

      {billId && (
        <Card className="p-4">
          <p className="text-sm text-gray-600">Bill ID</p>
          <Input value={billId} readOnly className="mt-1 font-mono text-xs" />
        </Card>
      )}

      {audit && (
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-3">Audit Result</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Verdict</p>
              <p className="font-semibold">{audit.audit_summary.verdict}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Overcharge</p>
              <p className="font-semibold">
                ${audit.audit_summary.overcharge_amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Overcharge %</p>
              <p className="font-semibold">{audit.audit_summary.overcharge_percent.toFixed(2)}%</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-semibold">{audit.audit_summary.confidence}%</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3">{audit.dispute_summary}</p>
          <h3 className="font-medium mb-2">Flagged items ({flaggedItems.length})</h3>
          <div className="space-y-2">
            {flaggedItems.length === 0 ? (
              <p className="text-sm text-gray-500">No flagged items.</p>
            ) : (
              flaggedItems.map((item, index) => (
                <div key={`${item.description}-${index}`} className="border rounded p-3">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-xs text-gray-600">
                    {item.fraud_type} | billed ${item.billed_amount.toFixed(2)} | legitimate ${item.legitimate_amount.toFixed(2)}
                  </p>
                  <p className="text-sm mt-1">{item.explanation}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {documentName && (
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-2">Generated Document</h2>
          <p className="text-sm text-gray-600 mb-3">{documentName}</p>
          <Button onClick={downloadDocument}>Download PDF</Button>
        </Card>
      )}
    </div>
  )
}

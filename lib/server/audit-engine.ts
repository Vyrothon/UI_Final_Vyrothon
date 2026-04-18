import OpenAI from "openai"
import { auditResultSchema } from "@/lib/server/schemas"
import { getServerEnv } from "@/lib/server/env"
import { withTimeout } from "@/lib/server/http"

type BillRecord = {
  id: string
  bill_line_items: Array<{
    description: string
    total: number
    quantity: number
    unit_price: number
    cpt_code?: string | null
  }>
}

type RateBenchmark = {
  description: string
  standard_rate_pkr_min: number
  standard_rate_pkr_max: number
}

async function fetchDrugContextFromTavily(lineItems: BillRecord["bill_line_items"]) {
  const env = getServerEnv()
  if (!env.TAVILY_API_KEY) return ""

  const candidate = lineItems.find((item) => /mg|tablet|capsule|injection|syrup/i.test(item.description))
  if (!candidate) return ""

  const query = `${candidate.description} drug safety side effects dosage and typical US hospital pricing`
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      max_results: 3,
    }),
  })

  if (!response.ok) return ""
  const data = (await response.json()) as { results?: Array<{ title?: string; content?: string }> }
  const results = data.results ?? []
  return results
    .map((item) => `${item.title ?? ""}\n${item.content ?? ""}`)
    .join("\n\n")
    .slice(0, 2500)
}

function heuristicAudit(bill: BillRecord, rates: RateBenchmark[]) {
  const lineItems = bill.bill_line_items
  const seen = new Map<string, number>()
  let totalBilled = 0
  let totalLegitimate = 0

  const evaluated = lineItems.map((line) => {
    totalBilled += Number(line.total)
    const key = line.description.trim().toLowerCase()
    const benchmark = rates.find((r) => key.includes(r.description.toLowerCase()) || r.description.toLowerCase().includes(key))
    const baseline = benchmark ? Number(benchmark.standard_rate_pkr_max) : Number(line.total)

    const seenCount = (seen.get(key) ?? 0) + 1
    seen.set(key, seenCount)

    let status: "clean" | "flagged" | "critical" = "clean"
    let fraudType: "none" | "upcoding" | "unbundling" | "duplicate" | "phantom" | "excessive_markup" | "drug_anomaly" = "none"
    let explanation = "Line item is within expected range."
    let disputeStrength: "strong" | "medium" | "weak" | "na" = "na"
    let legitimateAmount = Number(line.total)

    if (seenCount > 1) {
      status = "flagged"
      fraudType = "duplicate"
      explanation = "Duplicate line item detected with matching description."
      disputeStrength = "strong"
      legitimateAmount = 0
    } else if (benchmark && Number(line.total) > baseline * 1.5) {
      status = Number(line.total) > baseline * 2.2 ? "critical" : "flagged"
      fraudType = "excessive_markup"
      explanation = "Billed amount is materially above benchmark range."
      disputeStrength = "strong"
      legitimateAmount = baseline
    } else if (/consult|operating room|\bOR\b|operation theatre/i.test(line.description) && Number(line.total) > baseline * 1.3) {
      status = "flagged"
      fraudType = "upcoding"
      explanation = "Procedure appears priced above likely code complexity."
      disputeStrength = "medium"
      legitimateAmount = baseline
    }

    totalLegitimate += legitimateAmount
    return {
      description: line.description,
      billed_amount: Number(line.total),
      legitimate_amount: Number(legitimateAmount.toFixed(2)),
      status,
      fraud_type: fraudType,
      explanation,
      dispute_strength: disputeStrength,
    }
  })

  const overcharge = Math.max(0, totalBilled - totalLegitimate)
  const overchargePercent = totalBilled === 0 ? 0 : (overcharge / totalBilled) * 100

  let verdict: "clean" | "minor_issues" | "significant_fraud" | "severe_fraud" = "clean"
  if (overchargePercent >= 30) verdict = "severe_fraud"
  else if (overchargePercent >= 10) verdict = "significant_fraud"
  else if (overchargePercent > 0) verdict = "minor_issues"

  return {
    audit_summary: {
      total_billed: Number(totalBilled.toFixed(2)),
      total_legitimate: Number(totalLegitimate.toFixed(2)),
      overcharge_amount: Number(overcharge.toFixed(2)),
      overcharge_percent: Number(overchargePercent.toFixed(2)),
      verdict,
      confidence: 82,
      dispute_recommended: verdict !== "clean",
    },
    line_items: evaluated,
    drug_audit: {
      status: "clear" as const,
      flagged_drugs: [],
    },
    dispute_summary:
      verdict === "clean"
        ? "No significant billing anomalies were detected. You can proceed with payment."
        : "Multiple billing anomalies were detected. Request an itemized correction and dispute the flagged line items.",
  }
}

function buildPrompt(bill: BillRecord, rates: RateBenchmark[], tavilyContext: string) {
  return `You are a senior medical billing fraud specialist with expertise in US hospital and facility billing (Medicare OPPS, commercial contracts, and chargemaster patterns).

Return only valid JSON in this exact shape:
{
  "audit_summary": {
    "total_billed": number,
    "total_legitimate": number,
    "overcharge_amount": number,
    "overcharge_percent": number,
    "verdict": "clean | minor_issues | significant_fraud | severe_fraud",
    "confidence": number,
    "dispute_recommended": boolean
  },
  "line_items": [
    {
      "description": "string",
      "billed_amount": number,
      "legitimate_amount": number,
      "status": "clean | flagged | critical",
      "fraud_type": "none | upcoding | unbundling | duplicate | phantom | excessive_markup | drug_anomaly",
      "explanation": "string",
      "dispute_strength": "strong | medium | weak | na"
    }
  ],
  "drug_audit": {
    "status": "clear | warning | critical",
    "flagged_drugs": [{ "name": "string", "reason": "string", "action": "string" }]
  },
  "dispute_summary": "string"
}

Bill data: ${JSON.stringify(bill)}
Rate benchmarks: ${JSON.stringify(rates)}
Drug safety context (if available): ${tavilyContext || "N/A"}
`
}

export async function runAuditEngine(bill: BillRecord, rates: RateBenchmark[]) {
  const env = getServerEnv()
  if (!env.OPENAI_API_KEY) {
    return auditResultSchema.parse(heuristicAudit(bill, rates))
  }

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
  })

  const tavilyContext = await fetchDrugContextFromTavily(bill.bill_line_items)

  const completion = await withTimeout(
    client.chat.completions.create({
      model: env.OPENAI_MODEL || "openai/gpt-oss-120b",
      temperature: 0.2,
      messages: [{ role: "user", content: buildPrompt(bill, rates, tavilyContext) }],
    }),
    15000,
    "LLM audit timed out",
  )

  const rawContent = completion.choices?.[0]?.message?.content
  if (!rawContent) throw new Error("Empty LLM audit response")

  const parsed = typeof rawContent === "string" ? JSON.parse(rawContent) : JSON.parse(rawContent[0]?.text ?? "{}")
  return auditResultSchema.parse(parsed)
}

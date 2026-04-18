import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { auditRequestSchema } from "@/lib/server/schemas"
import { serverErrorResponse, validationErrorResponse } from "@/lib/server/http"
import { logError } from "@/lib/server/logger"
import { getBillWithLineItems, getRelevantRateBenchmarks, upsertAuditReport } from "@/lib/data/clearclaim"
import { runAuditEngine } from "@/lib/server/audit-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = auditRequestSchema.parse(body)

    const bill = await getBillWithLineItems(payload.bill_id)
    const descriptions = (bill.bill_line_items ?? []).map((item: { description: string }) => item.description)
    const benchmarks = await getRelevantRateBenchmarks(descriptions)

    const auditResult = await runAuditEngine(bill, benchmarks)
    const auditReport = await upsertAuditReport(payload.bill_id, auditResult)

    return NextResponse.json({
      success: true,
      audit_report_id: auditReport.id,
      result: auditResult,
    })
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    logError("Audit endpoint failed", { error: error instanceof Error ? error.message : String(error) })
    return serverErrorResponse("Failed to audit bill")
  }
}

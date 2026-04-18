import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { documentRequestSchema } from "@/lib/server/schemas"
import { getAuditReportByBillId, getBillWithLineItems, insertGeneratedDocument } from "@/lib/data/clearclaim"
import { buildCleanCertificate, buildDisputeLetter } from "@/lib/server/pdf"
import { logError } from "@/lib/server/logger"
import { serverErrorResponse, validationErrorResponse } from "@/lib/server/http"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = documentRequestSchema.parse(body)

    const bill = await getBillWithLineItems(payload.bill_id)
    const auditReport = await getAuditReportByBillId(payload.bill_id)
    if (!auditReport) {
      return NextResponse.json({ error: "Audit report not found. Run /api/audit first." }, { status: 404 })
    }

    const auditJson = auditReport.audit_json as {
      audit_summary: { verdict: string; overcharge_amount: number; total_legitimate: number; confidence: number }
      line_items: Array<{ description: string; billed_amount: number; legitimate_amount: number; fraud_type: string; status: string }>
      dispute_summary: string
    }

    const inferredKind = auditJson.audit_summary.verdict === "clean" ? "clean_certificate" : "dispute_letter"
    const kind = payload.kind === "auto" ? inferredKind : payload.kind

    let fileContent: string
    let fileName: string
    if (kind === "clean_certificate") {
      fileName = `clean-certificate-${bill.id}.pdf`
      fileContent = await buildCleanCertificate({
        patient_name: bill.patient_name,
        hospital_name: bill.hospital_name,
        bill_reference: bill.bill_reference,
        confidence: auditJson.audit_summary.confidence,
      })
    } else {
      const disputed = auditJson.line_items.filter((item) => item.status !== "clean")
      fileName = `dispute-letter-${bill.id}.pdf`
      fileContent = await buildDisputeLetter({
        patient_name: bill.patient_name,
        hospital_name: bill.hospital_name,
        bill_reference: bill.bill_reference,
        disputed_items: disputed,
        overcharge_amount: Number(auditJson.audit_summary.overcharge_amount),
        total_legitimate: Number(auditJson.audit_summary.total_legitimate),
        dispute_summary: auditJson.dispute_summary,
      })
    }

    const document = await insertGeneratedDocument({
      bill_id: bill.id,
      audit_report_id: auditReport.id,
      document_type: kind,
      file_name: fileName,
      file_content: fileContent,
      metadata: {
        generated_at: new Date().toISOString(),
        verdict: auditJson.audit_summary.verdict,
      },
    })

    return NextResponse.json({
      success: true,
      document_id: document.id,
      document_type: document.document_type,
      file_name: document.file_name,
      file_content_base64: document.file_content,
    })
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    logError("Document generation failed", { error: error instanceof Error ? error.message : String(error) })
    return serverErrorResponse("Failed to generate document")
  }
}

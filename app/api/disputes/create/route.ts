import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { getAuditReportByBillId, insertGeneratedDocument } from "@/lib/data/clearclaim"
import { getSupabaseAdminClient } from "@/lib/server/supabase"
import { createDisputeSchema } from "@/lib/server/dispute-schemas"
import { buildDisputeLetter } from "@/lib/server/pdf"
import { logError } from "@/lib/server/logger"
import { serverErrorResponse, validationErrorResponse } from "@/lib/server/http"

export async function POST(request: NextRequest) {
  try {
    const payload = createDisputeSchema.parse(await request.json())
    const supabase = getSupabaseAdminClient()

    const { data: bill, error: billError } = await supabase.from("bills").select("*").eq("id", payload.bill_id).single()
    if (billError || !bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 })

    const auditReport = await getAuditReportByBillId(payload.bill_id)
    if (!auditReport) return NextResponse.json({ error: "Audit report not found" }, { status: 404 })

    const auditJson = auditReport.audit_json as any
    const disputedItems = (auditJson.line_items || []).filter((item: any) => item.status !== "clean")

    const letterPdf = await buildDisputeLetter({
      patient_name: bill.patient_name,
      hospital_name: bill.hospital_name,
      bill_reference: bill.bill_reference,
      disputed_items: disputedItems,
      overcharge_amount: Number(auditJson.audit_summary.overcharge_amount || 0),
      total_legitimate: Number(auditJson.audit_summary.total_legitimate || 0),
      dispute_summary: String(auditJson.dispute_summary || ""),
    })

    const document = await insertGeneratedDocument({
      bill_id: bill.id,
      audit_report_id: auditReport.id,
      document_type: "dispute_letter",
      file_name: `dispute-letter-${bill.id}.pdf`,
      file_content: letterPdf,
      metadata: { generated_from: "disputes.create" },
    })

    const now = new Date()
    const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .upsert(
        {
          bill_id: bill.id,
          audit_report_id: auditReport.id,
          status: payload.send_now ? "sent" : "draft",
          level: 1,
          letter_document_id: document.id,
          sent_at: payload.send_now ? now.toISOString() : null,
          response_due_at: due.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: "bill_id" },
      )
      .select("*")
      .single()

    if (disputeError) throw new Error(disputeError.message)

    if (payload.send_now) {
      await supabase.from("dispute_correspondence").insert({
        dispute_id: dispute.id,
        direction: "outbound",
        recipient: `${bill.hospital_name} billing department`,
        channel: "email",
        content_summary: "Initial dispute letter sent with flagged line items and requested correction.",
      })
    }

    return NextResponse.json({
      success: true,
      dispute_id: dispute.id,
      status: dispute.status,
      level: dispute.level,
      letter_document_id: document.id,
      response_due_at: dispute.response_due_at,
    })
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    logError("Create dispute failed", { error: error instanceof Error ? error.message : String(error) })
    return serverErrorResponse("Failed to create dispute")
  }
}

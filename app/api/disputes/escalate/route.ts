import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { getSupabaseAdminClient } from "@/lib/server/supabase"
import { escalateDisputeSchema } from "@/lib/server/dispute-schemas"
import { serverErrorResponse, validationErrorResponse } from "@/lib/server/http"
import { logError } from "@/lib/server/logger"

export async function POST(request: NextRequest) {
  try {
    const payload = escalateDisputeSchema.parse(await request.json())
    const supabase = getSupabaseAdminClient()

    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .select("*")
      .eq("id", payload.dispute_id)
      .single()

    if (disputeError || !dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 })

    const nextLevel = Math.min(Number(dispute.level) + 1, 6)
    const escalatedStatus = nextLevel > 1 ? "escalated" : dispute.status

    const { data: updated, error: updateError } = await supabase
      .from("disputes")
      .update({
        level: nextLevel,
        status: escalatedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dispute.id)
      .select("*")
      .single()

    if (updateError) throw new Error(updateError.message)

    const recipientMap: Record<number, string> = {
      2: "Hospital CEO / Medical Director",
      3: "PMDC",
      4: "SECP / Consumer Protection Body",
      5: "Partner Law Firms",
      6: "Consumer Court / Civil Filing",
    }

    await supabase.from("dispute_correspondence").insert({
      dispute_id: dispute.id,
      direction: "outbound",
      recipient: recipientMap[nextLevel] || "Escalation recipient",
      channel: "email",
      content_summary: `Escalated to level ${nextLevel}. Reason: ${payload.reason}`,
    })

    return NextResponse.json({
      success: true,
      dispute_id: updated.id,
      status: updated.status,
      level: updated.level,
    })
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    logError("Escalate dispute failed", { error: error instanceof Error ? error.message : String(error) })
    return serverErrorResponse("Failed to escalate dispute")
  }
}

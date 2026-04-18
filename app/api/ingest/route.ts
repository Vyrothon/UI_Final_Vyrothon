import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { createBillWithLineItems, ensureUserRecord, getUsageCount, incrementUsageCounter } from "@/lib/data/clearclaim"
import { getServerEnv } from "@/lib/server/env"
import { validationErrorResponse, serverErrorResponse } from "@/lib/server/http"
import { logError } from "@/lib/server/logger"
import { ingestBillSchema } from "@/lib/server/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = ingestBillSchema.parse(body)
    const env = getServerEnv()

    await ensureUserRecord(payload.user_id)
    const usageCount = await getUsageCount(payload.user_id)
    if (usageCount >= env.FREE_TIER_SCAN_LIMIT) {
      return NextResponse.json(
        {
          error: "Monthly scan limit reached for current tier",
          limit: env.FREE_TIER_SCAN_LIMIT,
          used: usageCount,
        },
        { status: 429 },
      )
    }

    const bill = await createBillWithLineItems(payload)
    const updatedCount = await incrementUsageCounter(payload.user_id)

    return NextResponse.json({
      success: true,
      bill_id: bill.id,
      status: bill.status,
      created_at: bill.created_at,
      scans_used_this_month: updatedCount,
      scan_limit: env.FREE_TIER_SCAN_LIMIT,
    })
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error)
    logError("Ingest endpoint failed", { error: error instanceof Error ? error.message : String(error) })
    return serverErrorResponse("Failed to ingest bill")
  }
}

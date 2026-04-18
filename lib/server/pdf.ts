import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

type LineItem = {
  description: string
  billed_amount: number
  legitimate_amount: number
  fraud_type: string
}

async function createPdf(title: string, rows: string[]) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  page.drawText("ClearClaim", { x: 50, y: 790, size: 16, font: boldFont, color: rgb(0.1, 0.2, 0.8) })
  page.drawText(title, { x: 50, y: 765, size: 14, font: boldFont })

  let y = 730
  for (const row of rows) {
    if (y < 60) break
    page.drawText(row.replace(/[^\x20-\x7E]/g, ""), { x: 50, y, size: 10, font })
    y -= 18
  }

  return pdfDoc.saveAsBase64({ dataUri: false })
}

export async function buildCleanCertificate(input: {
  patient_name: string
  hospital_name: string
  bill_reference?: string | null
  confidence: number
}) {
  return createPdf("Clean Bill Certificate", [
    `Patient: ${input.patient_name}`,
    `Hospital: ${input.hospital_name}`,
    `Bill reference: ${input.bill_reference || "N/A"}`,
    "Audit Result: VERIFIED CLEAN",
    `Confidence: ${input.confidence}%`,
    "No major anomalies were found across billed line items.",
    "Recommended action: proceed with payment.",
  ])
}

export async function buildDisputeLetter(input: {
  patient_name: string
  hospital_name: string
  bill_reference?: string | null
  disputed_items: LineItem[]
  overcharge_amount: number
  total_legitimate: number
  dispute_summary: string
}) {
  const rows = [
    `Patient: ${input.patient_name}`,
    `Hospital: ${input.hospital_name}`,
    `Bill reference: ${input.bill_reference || "N/A"}`,
    "",
    "Subject: Formal medical billing dispute",
    "I am disputing the charges listed below and request correction within 14 days.",
    "",
  ]

  for (const item of input.disputed_items.slice(0, 12)) {
    rows.push(
      `- ${item.description} | billed $${item.billed_amount.toFixed(2)} | legitimate $${item.legitimate_amount.toFixed(2)} | ${item.fraud_type}`,
    )
  }

  rows.push("")
  rows.push(`Total disputed amount: $${input.overcharge_amount.toFixed(2)}`)
  rows.push(`Requested corrected total: $${input.total_legitimate.toFixed(2)}`)
  rows.push(`Summary: ${input.dispute_summary}`)
  rows.push("")
  rows.push("ClearClaim Notice: This document is generated software output and is not legal advice.")

  return createPdf("Dispute Letter", rows)
}

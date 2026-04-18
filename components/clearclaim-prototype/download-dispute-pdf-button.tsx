"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import {
  prototypeAuditResult,
  prototypeBillDocument,
  prototypeDisputeLetterIntro,
  DISCLAIMER_SHORT,
} from "@/lib/clearclaim-prototype-data"

export function DownloadDisputePdfButton() {
  async function handleDownload() {
    const pdf = await PDFDocument.create()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const page = pdf.addPage([612, 792])
    const margin = 50
    let y = 792 - margin
    const line = 13

    const write = (text: string, size = 10, bold = false, color = rgb(0, 0, 0)) => {
      page.drawText(text.slice(0, 120), {
        x: margin,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      })
      y -= line
    }

    write("ClearClaim — dispute letter", 9, true)
    y -= 4
    write(DISCLAIMER_SHORT, 7, false, rgb(0.35, 0.35, 0.35))
    y -= 8

    for (const para of prototypeDisputeLetterIntro.split("\n\n")) {
      for (const ln of para.split("\n")) {
        write(ln || " ", 10)
      }
      y -= 4
    }

    y -= 6
    write("Flagged summary (USD)", 10, true)
    for (const row of prototypeAuditResult.line_items) {
      write(
        `${row.fraud_type}: ${row.billed_amount} billed / ${row.legitimate_amount} fair`,
        9,
      )
    }
    y -= 6
    write(
      `Total questioned: $${prototypeAuditResult.audit_summary.overcharge_amount.toLocaleString("en-US")}`,
      10,
      true,
    )

    const bytes = await pdf.save()
    const blob = new Blob([bytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clearclaim-dispute-${prototypeBillDocument.bill_reference ?? "draft"}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button type="button" onClick={() => void handleDownload()} className="gap-2 bg-black text-white hover:bg-black/90">
      <Download className="h-4 w-4" />
      Download PDF (prototype)
    </Button>
  )
}

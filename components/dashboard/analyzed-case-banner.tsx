"use client"

import Link from "next/link"
import { FileCheck, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prototypeBillDocument } from "@/lib/clearclaim-prototype-data"
import { useDashboardScan } from "@/components/dashboard/dashboard-scan-context"

/** Shows on medications, treatments, marketplace when bill analysis state changes. */
export function AnalyzedCaseBanner() {
  const { hasAnalysis, scan } = useDashboardScan()

  if (hasAnalysis && scan) {
    const files = scan.fileNames.length ? scan.fileNames.join(", ") : null
    return (
      <Alert className="border-primary/25 bg-primary/5">
        <FileCheck className="h-4 w-4 text-primary" />
        <AlertTitle className="text-foreground">Active case</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Linked to bill <span className="font-mono font-medium text-foreground">{prototypeBillDocument.bill_reference}</span>
          {files ? (
            <>
              {" "}
              · source {files}
            </>
          ) : null}
          .{" "}
          <Link href="/dashboard" className="font-medium text-foreground underline underline-offset-4">
            View scan &amp; pricing
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <Link href="/dashboard" className="font-medium text-foreground underline underline-offset-4">
          Scan a bill
        </Link>{" "}
        first so medications, treatments, and legal options align with the same case file.
      </AlertDescription>
    </Alert>
  )
}

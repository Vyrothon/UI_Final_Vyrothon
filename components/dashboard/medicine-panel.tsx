"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prototypeAuditResult, DISCLAIMER_SHORT } from "@/lib/clearclaim-prototype-data"
import { Badge } from "@/components/ui/badge"
import { AnalyzedCaseBanner } from "@/components/dashboard/analyzed-case-banner"

export function MedicinePanel() {
  const d = prototypeAuditResult.drug_audit
  const critical = d.status === "critical"

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AnalyzedCaseBanner />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Safety review</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Medication &amp; formulary</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Flags aligned with your bill scan case. Not medical advice — discuss with your clinician or pharmacist.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{DISCLAIMER_SHORT}</p>
      </div>

      <Alert variant="destructive" className="border-red-200/80 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>
          Medication review — status: {d.status}
          {critical ? " (elevated)" : ""}
        </AlertTitle>
        <AlertDescription className="text-sm">
          {d.flagged_drugs.length} item(s) need follow-up. This is not a prescription or diagnosis.{" "}
          {critical ? (
            <>
              If billing or prescribing looks inconsistent with your care, consider{" "}
              <Link href="/dashboard/marketplace" className="font-medium underline underline-offset-4">
                speaking with a lawyer
              </Link>
              .
            </>
          ) : (
            <>
              <Link href="/dashboard/marketplace" className="font-medium underline underline-offset-4">
                Legal marketplace
              </Link>
            </>
          )}
        </AlertDescription>
      </Alert>

      <ul className="space-y-4">
        {d.flagged_drugs.map((drug, i) => (
          <li key={`${drug.name}-${i}`}>
            <Card className="border border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div>
                  <CardTitle className="text-base leading-snug">{drug.name}</CardTitle>
                  <CardDescription>Flagged in extraction</CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0">
                  Review
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{drug.reason}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Suggested action:</span> {drug.action}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/marketplace">Find a lawyer or firm</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to bill scan</Link>
        </Button>
      </div>
    </div>
  )
}

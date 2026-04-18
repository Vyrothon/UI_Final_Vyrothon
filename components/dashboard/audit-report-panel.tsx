"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  auditSummaryForScenario,
  demoAuditLinesForScenario,
  demoAuditMetaForScenario,
  FLAG_LABEL,
  type AuditFlagKind,
  type DemoScanScenario,
} from "@/lib/dashboard-demo-data"
import { prototypeAuditResult } from "@/lib/clearclaim-prototype-data"
import { formatUsd } from "@/lib/currency-format"
import { cn } from "@/lib/utils"

const FLAG_FILTER: { value: AuditFlagKind | "all"; label: string }[] = [
  { value: "all", label: "All lines" },
  { value: "upcoding", label: "Upcoding" },
  { value: "duplicate", label: "Duplicate" },
  { value: "phantom", label: "Phantom" },
  { value: "unbundling", label: "Unbundling" },
  { value: "markup", label: "Markup" },
  { value: "clean", label: "Clean" },
]

function money(n: number) {
  return formatUsd(n)
}

function flagBadgeClass(flag: AuditFlagKind) {
  switch (flag) {
    case "clean":
      return "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border-emerald-700/20"
    case "phantom":
    case "duplicate":
      return "bg-red-600/12 text-red-800 dark:text-red-300 border-red-700/25"
    default:
      return "bg-amber-600/12 text-amber-900 dark:text-amber-200 border-amber-700/25"
  }
}

export function AuditReportPanel({
  embedded = false,
  scenario = "fraud",
}: {
  embedded?: boolean
  scenario?: DemoScanScenario
} = {}) {
  const [filter, setFilter] = useState<AuditFlagKind | "all">("all")
  const baseLines = useMemo(() => demoAuditLinesForScenario(scenario), [scenario])
  const meta = useMemo(() => demoAuditMetaForScenario(scenario), [scenario])
  const summary = useMemo(() => auditSummaryForScenario(scenario), [scenario])

  const lines = useMemo(() => {
    if (filter === "all") return baseLines
    return baseLines.filter((l) => l.flag === filter)
  }, [baseLines, filter])

  const flaggedCount = baseLines.filter((l) => l.flag !== "clean").length
  const disputeSummary =
    scenario === "fraud" ? prototypeAuditResult.dispute_summary : null

  return (
    <div
      className="mx-auto max-w-5xl space-y-8"
      id={embedded ? "price-analysis" : undefined}
    >
      {!embedded ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price &amp; billing</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Billing audit</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Audit for <strong>{meta.hospital}</strong> · Ref {meta.patientRef} · {meta.billDate}. Educational output only —
            not medical or legal advice.
          </p>
        </div>
      ) : (
        <div className="scroll-mt-28 space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Price &amp; billing issues</h2>
          <p className="text-sm text-muted-foreground">
            Benchmark comparison. Your pricing dispute service can run automatically after OCR completes.
          </p>
        </div>
      )}

      {scenario === "clean" ? (
        <Alert className="border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <AlertTitle className="text-emerald-900 dark:text-emerald-200">No material price issues</AlertTitle>
          <AlertDescription className="text-sm text-emerald-900/90 dark:text-emerald-200/90">
            Variance is within tolerance for this path. You can still review medications and treatments below.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-200">Price patterns flagged</AlertTitle>
          <AlertDescription className="text-sm text-amber-900/90 dark:text-amber-200/90">
            ClearClaim is not a law firm. Benchmarks and “fair” amounts are illustrative until rate data is wired for your
            jurisdiction.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-gray-200 shadow-sm dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Billed total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{money(summary.total_billed)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-gray-200 shadow-sm dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Estimated fair total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {money(summary.total_legitimate)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card
          className={cn(
            "border shadow-sm",
            scenario === "clean"
              ? "border-emerald-200/80 bg-emerald-50/25 dark:border-emerald-900/40 dark:bg-emerald-950/10"
              : "border-amber-200/80 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10",
          )}
        >
          <CardHeader className="pb-2">
            <CardDescription>Estimated overcharge</CardDescription>
            <CardTitle
              className={cn(
                "text-2xl font-semibold tabular-nums",
                scenario === "clean"
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-amber-900 dark:text-amber-200",
              )}
            >
              {money(summary.overcharge_amount)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            {flaggedCount} of {baseLines.length} lines flagged for review
          </CardContent>
        </Card>
      </div>

      {disputeSummary ? (
        <Card className="border border-border bg-muted/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Automated price dispute</CardTitle>
            <CardDescription>
              The full dispute package can be generated and submitted to hospital billing when your integration is live.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{disputeSummary}</CardContent>
        </Card>
      ) : null}

      <Card className="border border-gray-200 shadow-sm dark:border-gray-800">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Line items</CardTitle>
              <CardDescription>Filter by pattern type.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {FLAG_FILTER.map((f) => (
                <Button
                  key={f.value}
                  type="button"
                  size="sm"
                  variant={filter === f.value ? "default" : "outline"}
                  className="h-8"
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Model confidence</span>
              <span>{Math.round(meta.confidence * 100)}%</span>
            </div>
            <Progress value={meta.confidence * 100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Billed</TableHead>
                <TableHead className="text-right">Fair est.</TableHead>
                <TableHead>Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[200px] font-medium">{row.description}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.code}</TableCell>
                  <TableCell className="text-right tabular-nums">{money(row.billed)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-700 dark:text-emerald-400/90">
                    {money(row.fairEstimate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", flagBadgeClass(row.flag))}>
                      {FLAG_LABEL[row.flag]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-3 rounded-lg border border-gray-200 bg-muted/20 p-4 dark:border-gray-800">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 shrink-0" />
              Plain-language notes
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {lines.map((row) => (
                <li key={row.id}>
                  <span className="font-medium text-foreground">{row.description}</span> — {row.explanation}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default">
              <Link href="/dashboard/medicine">Review medications</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/malpractice">Review treatments</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/marketplace">Legal marketplace</Link>
            </Button>
            {!embedded ? (
              <Button asChild variant="ghost">
                <Link href="/dashboard">Back to bill scan</Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

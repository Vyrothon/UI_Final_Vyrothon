"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DEMO_AUDIT_LINES,
  DEMO_AUDIT_META,
  FLAG_LABEL,
  demoAuditTotals,
  type AuditFlagKind,
} from "@/lib/dashboard-demo-data"
import { cn } from "@/lib/utils"

const FLAG_FILTER: { value: AuditFlagKind | "all"; label: string }[] = [
  { value: "all", label: "All lines" },
  { value: "upcoding", label: "Upcoding" },
  { value: "duplicate", label: "Duplicate" },
  { value: "phantom", label: "Phantom / bundled" },
  { value: "unbundling", label: "Unbundling" },
  { value: "markup", label: "Markup" },
  { value: "clean", label: "Clean" },
]

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: DEMO_AUDIT_META.currency })
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

export function AuditReportPanel() {
  const [filter, setFilter] = useState<AuditFlagKind | "all">("all")
  const lines = useMemo(() => {
    if (filter === "all") return DEMO_AUDIT_LINES
    return DEMO_AUDIT_LINES.filter((l) => l.flag === filter)
  }, [filter])
  const totals = demoAuditTotals(DEMO_AUDIT_LINES)
  const flaggedCount = DEMO_AUDIT_LINES.filter((l) => l.flag !== "clean").length

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 2 of 5</p>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mt-1">AI audit report</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-3xl">
          Demo audit for <strong>{DEMO_AUDIT_META.hospital}</strong> · Ref {DEMO_AUDIT_META.patientRef} ·{" "}
          {DEMO_AUDIT_META.billDate}. Educational output only — not medical or legal advice.
        </p>
      </div>

      <Alert className="border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-200">Pattern detection (hardcoded demo)</AlertTitle>
        <AlertDescription className="text-amber-900/90 dark:text-amber-200/90 text-sm">
          ClearClaim is not a law firm. Benchmarks and “fair” amounts are illustrative until your product wires
          jurisdiction-specific rate data and clinician review.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Billed total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{money(totals.billed)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Estimated fair total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {money(totals.fair)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-amber-200/80 dark:border-amber-900/40 shadow-sm bg-amber-50/30 dark:bg-amber-950/10">
          <CardHeader className="pb-2">
            <CardDescription>Estimated overcharge</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-amber-900 dark:text-amber-200">
              {money(totals.overcharge)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground pt-0">
            {flaggedCount} of {DEMO_AUDIT_LINES.length} lines flagged for review
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-medium">Line items</CardTitle>
              <CardDescription>Filter by pattern type. Click a row explanation below the table.</CardDescription>
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
              <span>Model confidence (demo)</span>
              <span>{Math.round(DEMO_AUDIT_META.confidence * 100)}%</span>
            </div>
            <Progress value={DEMO_AUDIT_META.confidence * 100} className="h-2" />
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
                  <TableCell className="font-medium max-w-[200px]">{row.description}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{row.code}</TableCell>
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

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-muted/20 p-4 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
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
              <Link href="/dashboard/disputes">Open dispute tracker</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/letters">Letters &amp; docs</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard/bill-intake">Back to intake</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

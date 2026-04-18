"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Circle,
  Loader2,
  Building2,
  Hash,
  CalendarRange,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { prototypeBillDocument } from "@/lib/clearclaim-prototype-data"
import { formatUsd } from "@/lib/currency-format"
import { AuditReportPanel } from "@/components/dashboard/audit-report-panel"
import { useDashboardScan } from "@/components/dashboard/dashboard-scan-context"
import { pickDemoScenario } from "@/lib/dashboard-upload-demo"

export type BillDocKind = "hospital_bill" | "eob" | "discharge" | "other"

export type UploadedBillDoc = {
  id: string
  name: string
  size: number
  type: string
  addedAt: number
  kind: BillDocKind
}

const DOC_KIND_LABEL: Record<BillDocKind, string> = {
  hospital_bill: "Hospital bill",
  eob: "EOB / insurance",
  discharge: "Discharge summary",
  other: "Other",
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export function BillIntakePanel() {
  const { scan, hasAnalysis, scenario, setScanPayload, clearScanPayload } = useDashboardScan()
  const inputRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<UploadedBillDoc[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [scanning, setScanning] = useState(false)

  const analyzed = hasAnalysis
  const activeScenario = scenario ?? "fraud"
  const sourceFileNames = scan?.fileNames ?? []

  useEffect(() => {
    if (!analyzed) return
    const el = document.getElementById("price-analysis")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [analyzed])

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return
    const next: UploadedBillDoc[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      next.push({
        id: `${f.name}-${f.size}-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        addedAt: Date.now(),
        kind: "hospital_bill",
      })
    }
    setDocs((prev) => [...next, ...prev])
  }, [])

  const remove = useCallback((id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const setKind = useCallback((id: string, kind: BillDocKind) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, kind } : d)))
  }, [])

  const hasHospitalBill = useMemo(() => docs.some((d) => d.kind === "hospital_bill"), [docs])

  const runAnalysis = useCallback(async () => {
    if (docs.length === 0) return
    const names = docs.map((d) => d.name)
    const nextScenario = pickDemoScenario(names)
    setScanning(true)
    await new Promise((r) => setTimeout(r, 1400))
    setScanPayload({
      fileNames: names,
      analyzedAt: Date.now(),
      scenario: nextScenario,
    })
    setScanning(false)
  }, [docs, setScanPayload])

  const resetCase = useCallback(() => {
    clearScanPayload()
    setDocs([])
  }, [clearScanPayload])

  const sourceLabel = sourceFileNames.length ? sourceFileNames.join(", ") : "your upload"

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 1 · Scan</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Bill scan &amp; pricing</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          Upload a hospital bill image or PDF. OCR extracts facility details, then the pricing engine benchmarks line
          items and prepares a dispute summary. A backend service can submit disputes to billing automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Supported formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>PDF, PNG, JPG, WebP</p>
            <p>Photos of paper bills and portal downloads</p>
            <p>Multiple files per case</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>OCR extracts facility and reference fields.</p>
            <p>Pricing engine flags line items against benchmarks.</p>
            <p>Medications and treatments can surface lawyer referrals when needed.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Upload</CardTitle>
          <CardDescription>Attach your bill, then run analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,image/*,.png,.jpg,.jpeg,.webp,.jfif,application/pdf"
            multiple
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ""
            }}
          />

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            className={[
              "cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/40",
            ].join(" ")}
          >
            <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, PNG, JPG, WebP, JFIF · multiple files ok</p>
            <Button type="button" variant="secondary" className="pointer-events-none mt-4">
              Choose files
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-sm font-medium">Your documents ({docs.length})</h3>
            {docs.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No documents yet — add at least one to run analysis.</p>
            ) : (
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium" title={d.name}>
                          {d.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(d.size)}
                          {d.type ? ` · ${d.type.split("/").pop()}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                      <Select value={d.kind} onValueChange={(v) => setKind(d.id, v as BillDocKind)}>
                        <SelectTrigger className="h-9 w-full sm:w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(DOC_KIND_LABEL) as BillDocKind[]).map((k) => (
                            <SelectItem key={k} value={k}>
                              {DOC_KIND_LABEL[k]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => remove(d.id)}
                        aria-label={`Remove ${d.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" disabled={docs.length === 0 || scanning} onClick={() => void runAnalysis()}>
              {scanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running OCR &amp; pricing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze bill
                </>
              )}
            </Button>
            {analyzed ? (
              <Button type="button" variant="outline" onClick={resetCase}>
                Reset case
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Readiness</CardTitle>
          <CardDescription>Checklist before analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ChecklistRow done={docs.length > 0} label="At least one file attached" />
          <ChecklistRow done={hasHospitalBill} label="At least one file tagged Hospital bill" />
          <ChecklistRow done={analyzed} label="OCR and pricing analysis completed" />
        </CardContent>
      </Card>

      {analyzed ? (
        <>
          <Card className="border border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Building2 className="h-5 w-5 text-primary" />
                OCR extract
              </CardTitle>
              <CardDescription>
                Read from <span className="font-medium text-foreground">{sourceLabel}</span> — mapped to structured fields
                for this case.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-2 rounded-lg border border-border bg-background/80 p-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Hospital</p>
                  <p className="text-sm font-medium">{prototypeBillDocument.hospital_name}</p>
                </div>
              </div>
              <div className="flex gap-2 rounded-lg border border-border bg-background/80 p-3">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Bill reference</p>
                  <p className="font-mono text-sm">{prototypeBillDocument.bill_reference}</p>
                </div>
              </div>
              <div className="flex gap-2 rounded-lg border border-border bg-background/80 p-3">
                <CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Admission – discharge</p>
                  <p className="text-sm">
                    {prototypeBillDocument.admission_date} → {prototypeBillDocument.discharge_date}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 rounded-lg border border-border bg-background/80 p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total billed (detected)</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatUsd(prototypeBillDocument.total_amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/45 dark:bg-emerald-950/25">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <AlertTitle className="text-emerald-900 dark:text-emerald-200">Price dispute queued</AlertTitle>
            <AlertDescription className="text-sm text-emerald-900/90 dark:text-emerald-200/85">
              A pricing dispute package is ready for hospital billing integration. Results appear below.
            </AlertDescription>
          </Alert>

          <AuditReportPanel embedded scenario={activeScenario} />

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Button asChild variant="outline">
              <Link href="/dashboard/medicine">Medication review →</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/malpractice">Treatment review →</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/marketplace">Legal marketplace →</Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}

function ChecklistRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-500" aria-hidden />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  )
}

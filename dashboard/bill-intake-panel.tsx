"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Upload, FileText, X, CheckCircle2, Circle, Info } from "lucide-react"
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

/** Feature 1 — Bill intake: upload, classify, and prep for audit (all client-side demo). */
export function BillIntakePanel() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<UploadedBillDoc[]>([])
  const [isDragging, setIsDragging] = useState(false)

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
  const hasDischarge = useMemo(() => docs.some((d) => d.kind === "discharge"), [docs])

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 1 of 5</p>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mt-1">Bill intake</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">
          Add the documents you want audited. Tag each file so the later AI audit step knows how to treat it (demo —
          files stay in this browser only).
        </p>
      </div>

      <Alert className="border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20">
        <Info className="h-4 w-4 text-amber-800 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-200">Privacy (demo)</AlertTitle>
        <AlertDescription className="text-amber-900/90 dark:text-amber-200/90 text-sm">
          Do not upload real PHI if you are not comfortable keeping this tab local. This build does not send files to a
          server.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Supported formats</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>PDF, PNG, JPG, WebP</p>
            <p>Photos of paper bills and portal downloads</p>
            <p>Multiple files per case</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Tips (hardcoded)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Include every page that shows line items and totals.</p>
            <p>EOB + hospital bill together helps reconcile denials.</p>
            <p>Target: under ~30 seconds to attach a typical stack.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Upload</CardTitle>
          <CardDescription>Drag files in or browse. Then set the document type for each row.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,image/*,.png,.jpg,.jpeg,.webp,application/pdf"
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
              "rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-gray-900/40",
            ].join(" ")}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" aria-hidden />
            <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, WebP · multiple files ok</p>
            <Button type="button" variant="secondary" className="mt-4 pointer-events-none">
              Choose files
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Your documents ({docs.length})</h3>
            {docs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No documents yet.</p>
            ) : (
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-3"
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground mt-1" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" title={d.name}>
                          {d.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(d.size)}
                          {d.type ? ` · ${d.type.split("/").pop()}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
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
                        className="shrink-0 h-9 w-9"
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
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Intake checklist</CardTitle>
          <CardDescription>Hardcoded gates for the demo — ties to what you uploaded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ChecklistRow done={docs.length > 0} label="At least one file attached" />
          <ChecklistRow done={hasHospitalBill} label="At least one file tagged Hospital bill" />
          <ChecklistRow
            done={hasDischarge}
            label="Discharge summary attached (recommended)"
            optional
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/audit">Continue to AI audit →</Link>
        </Button>
        <p className="text-xs text-muted-foreground self-center">
          The audit uses a hardcoded sample case; your uploads are not sent to a server yet.
        </p>
      </div>
    </div>
  )
}

function ChecklistRow({ done, label, optional }: { done: boolean; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0" aria-hidden />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
      )}
      <span className={done ? "text-foreground" : "text-muted-foreground"}>
        {label}
        {optional && <span className="text-xs text-muted-foreground"> — optional</span>}
      </span>
    </div>
  )
}

"use client"

import Link from "next/link"
import { Download, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DEMO_LETTERS, DEMO_AUDIT_META, type LetterDoc } from "@/lib/dashboard-demo-data"

const KIND_LABEL: Record<LetterDoc["kind"], string> = {
  dispute: "Dispute letter",
  follow_up: "Follow-up",
  hipaa: "HIPAA / records",
  template: "Template",
}

function buildDemoLetterBody(doc: LetterDoc): string {
  return [
    `${doc.title}`,
    `Reference: ${DEMO_AUDIT_META.patientRef} · ${DEMO_AUDIT_META.hospital}`,
    `Generated (demo): ${doc.created}`,
    "",
    "---",
    doc.summary,
    "",
    "[Body would continue with itemized table, citations, and signature block.]",
    "",
    "ClearClaim AI — educational draft. Not legal advice. Not a law firm.",
  ].join("\n")
}

export function LettersDocsPanel() {
  function downloadTxt(doc: LetterDoc) {
    const blob = new Blob([buildDemoLetterBody(doc)], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.id}-${doc.title.slice(0, 24).replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 4 of 5</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Letters &amp; documents</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Demo drafts linked to the sample audit. Plain-text placeholders — PDF export also on the Dispute PDF page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_LETTERS.map((doc) => (
          <Card key={doc.id} className="flex flex-col border border-gray-200 shadow-sm dark:border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="shrink-0 font-normal">
                  {KIND_LABEL[doc.kind]}
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">{doc.id}</span>
              </div>
              <CardTitle className="pt-1 text-base font-medium leading-snug">{doc.title}</CardTitle>
              <CardDescription>
                {doc.created} · {doc.pages} pp.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex flex-1 flex-col gap-3">
              <p className="flex-1 text-sm text-muted-foreground">{doc.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{doc.title}</DialogTitle>
                      <DialogDescription>{doc.created}</DialogDescription>
                    </DialogHeader>
                    <pre className="rounded-md border border-border bg-muted/50 p-4 font-mono text-xs whitespace-pre-wrap">
                      {buildDemoLetterBody(doc)}
                    </pre>
                  </DialogContent>
                </Dialog>
                <Button variant="default" size="sm" className="gap-1" onClick={() => downloadTxt(doc)}>
                  <Download className="h-4 w-4" />
                  Download .txt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-dashed border-gray-300 bg-muted/10 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <FileText className="h-4 w-4" />
            Generate next letter (demo)
          </CardTitle>
          <CardDescription>
            Production would merge audit JSON + jurisdiction templates. This build is static only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/audit">Review audit again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/dispute">Open formal PDF draft</Link>
          </Button>
        </CardContent>
      </Card>

      <Button asChild variant="ghost">
        <Link href="/dashboard/disputes">← Dispute tracker</Link>
      </Button>
    </div>
  )
}

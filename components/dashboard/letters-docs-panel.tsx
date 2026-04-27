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
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 4 of 5</p>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mt-1">Letters &amp; documents</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Demo drafts linked to the sample audit. Download as plain text placeholders; PDF generation comes later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_LETTERS.map((doc) => (
          <Card key={doc.id} className="border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="font-normal shrink-0">
                  {KIND_LABEL[doc.kind]}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">{doc.id}</span>
              </div>
              <CardTitle className="text-base font-medium leading-snug pt-1">{doc.title}</CardTitle>
              <CardDescription>
                {doc.created} · {doc.pages} pp.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 mt-auto">
              <p className="text-sm text-muted-foreground flex-1">{doc.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{doc.title}</DialogTitle>
                      <DialogDescription>{doc.created}</DialogDescription>
                    </DialogHeader>
                    <pre className="text-xs whitespace-pre-wrap font-mono bg-muted/50 rounded-md p-4 border border-border">
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

      <Card className="border border-dashed border-gray-300 dark:border-gray-600 bg-muted/10">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate next letter (demo)
          </CardTitle>
          <CardDescription>
            In production this would merge audit JSON + jurisdiction templates. Here it is a static library only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/audit">Review audit again</Link>
          </Button>
        </CardContent>
      </Card>

      <Button asChild variant="ghost">
        <Link href="/dashboard/disputes">← Dispute tracker</Link>
      </Button>
    </div>
  )
}

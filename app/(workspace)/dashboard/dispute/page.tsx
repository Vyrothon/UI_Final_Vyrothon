import { DownloadDisputePdfButton } from "@/components/clearclaim-prototype/download-dispute-pdf-button"
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  prototypeAuditResult,
  prototypeBillDocument,
  prototypeDisputeLetterIntro,
  DISCLAIMER_SHORT,
} from "@/lib/clearclaim-prototype-data"

export default function DisputePackagePage() {
  return (
    <DashboardPageFrame
      eyebrow="Export"
      title="Dispute package"
      description={
        <>
          Option A — letter + PDF (Implementation §11). Client-side{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">pdf-lib</code> stub.
        </>
      }
      disclaimer={DISCLAIMER_SHORT}
    >
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border/80 pb-4">
          <p className="text-right text-xs text-muted-foreground">{prototypeBillDocument.bill_reference}</p>
          <CardTitle className="sr-only">Dispute letter preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 font-serif text-sm leading-relaxed">
          <div className="space-y-4 whitespace-pre-wrap">{prototypeDisputeLetterIntro}</div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="font-sans text-xs font-medium text-muted-foreground">Summary</p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">{prototypeAuditResult.dispute_summary}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <DownloadDisputePdfButton />
      </div>
    </DashboardPageFrame>
  )
}

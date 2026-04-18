import { prototypeCleanAudit, DISCLAIMER_SHORT } from "@/lib/clearclaim-prototype-data"
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame"
import { Card, CardContent } from "@/components/ui/card"
import { formatUsd } from "@/lib/currency-format"

export default function CleanBillPage() {
  const a = prototypeCleanAudit

  return (
    <DashboardPageFrame
      eyebrow="Alternate path"
      title="Clean bill certificate"
      description="Alternate path when the engine finds no material issues."
      disclaimer={DISCLAIMER_SHORT}
    >
      <Card className="overflow-hidden border-2 border-emerald-700/25 bg-emerald-50/80 shadow-sm dark:border-emerald-600/35 dark:bg-emerald-950/30">
        <CardContent className="p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-300">
            Verified clean
          </p>
          <p className="mt-6 text-center text-2xl font-semibold text-emerald-900 dark:text-emerald-100">ClearClaim Audit Result</p>
          <p className="mt-2 text-center text-sm text-emerald-800/90 dark:text-emerald-200/90">
            Bill reference: NH-UC-CLEAN-2026-01 · North Harbor Urgent Care (alternate fixture)
          </p>
          <div className="mt-8 space-y-2 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <p>
              Total billed: <strong>{formatUsd(a.audit_summary.total_billed)}</strong>
            </p>
            <p>
              Benchmark legitimate: <strong>{formatUsd(a.audit_summary.total_legitimate)}</strong>
            </p>
            <p>
              Residual variance: <strong>{a.audit_summary.overcharge_percent.toFixed(1)}%</strong> — within tolerance for
              this review.
            </p>
            <p className="pt-4 text-xs text-emerald-800/85 dark:text-emerald-300/85">
              Recommended action: proceed with payment unless your insurer requires additional documentation. This certificate
              is a software-generated summary, not a legal document.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardPageFrame>
  )
}

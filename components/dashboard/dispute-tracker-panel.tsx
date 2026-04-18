"use client"

import Link from "next/link"
import { CalendarClock, ChevronRight, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEMO_DISPUTES, type DisputeStatus } from "@/lib/dashboard-demo-data"
import { formatUsd } from "@/lib/currency-format"
import { cn } from "@/lib/utils"

function money(n: number) {
  return formatUsd(n)
}

function statusBadge(status: DisputeStatus) {
  const map: Record<DisputeStatus, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-slate-500/15 text-slate-800 dark:text-slate-200" },
    sent: { label: "Sent", className: "bg-blue-600/15 text-blue-800 dark:text-blue-300" },
    awaiting: { label: "Awaiting response", className: "bg-amber-600/15 text-amber-900 dark:text-amber-200" },
    escalated: { label: "Escalated", className: "bg-violet-600/15 text-violet-800 dark:text-violet-300" },
    resolved: { label: "Resolved", className: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300" },
  }
  const s = map[status]
  return (
    <Badge variant="outline" className={cn("font-medium", s.className)}>
      {s.label}
    </Badge>
  )
}

export function DisputeTrackerPanel() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 3 of 5</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Dispute tracker</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Case statuses and dates are illustrative.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {DEMO_DISPUTES.filter((d) => d.status !== "resolved").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription>Total disputed</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {money(DEMO_DISPUTES.reduce((s, d) => s + d.disputedAmount, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-emerald-200/60 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10">
          <CardHeader className="pb-2">
            <CardDescription>Recovered</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {money(DEMO_DISPUTES.reduce((s, d) => s + (d.recovered ?? 0), 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        {DEMO_DISPUTES.map((d) => (
          <Card key={d.id} className="overflow-hidden border border-gray-200 shadow-sm dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                    {statusBadge(d.status)}
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Landmark className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {d.hospital}
                  </CardTitle>
                  <CardDescription>
                    Opened {d.opened}
                    {d.dueBy ? (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Due {d.dueBy}
                      </span>
                    ) : null}
                  </CardDescription>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">Disputed</p>
                  <p className="text-lg font-semibold tabular-nums">{money(d.disputedAmount)}</p>
                  {d.recovered != null ? (
                    <p className="text-sm tabular-nums text-emerald-700 dark:text-emerald-400">
                      Recovered {money(d.recovered)}
                    </p>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg border border-gray-200 bg-muted/15 px-3 py-2.5 text-sm text-muted-foreground dark:border-gray-800">
                <span className="font-medium text-foreground">Last event: </span>
                {d.lastEvent}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/letters">
                    View letters
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {d.status === "awaiting" || d.status === "escalated" ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/marketplace">Get counsel</Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button asChild variant="ghost">
        <Link href="/dashboard/audit">← Back to audit</Link>
      </Button>
    </div>
  )
}

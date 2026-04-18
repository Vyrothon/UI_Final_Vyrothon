"use client"

import Link from "next/link"
import { Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DEMO_MALPRACTICE_ITEMS } from "@/lib/dashboard-demo-data"
import { DISCLAIMER_SHORT } from "@/lib/clearclaim-prototype-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AnalyzedCaseBanner } from "@/components/dashboard/analyzed-case-banner"

export function MalpracticePanel() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AnalyzedCaseBanner />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Clinical necessity</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Unneeded or questionable treatments</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Heuristic review of whether services matched likely need for the documented stay — not a clinical or legal
          opinion.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{DISCLAIMER_SHORT}</p>
      </div>

      <Alert className="border-primary/25 bg-primary/5">
        <Stethoscope className="h-4 w-4" />
        <AlertTitle>When care may not match the bill</AlertTitle>
        <AlertDescription className="text-sm">
          If you see treatments that look unnecessary or harmful, consider documenting everything and{" "}
          <Link href="/dashboard/marketplace" className="font-medium underline underline-offset-4">
            consulting a med-mal or billing attorney
          </Link>{" "}
          in the marketplace.
        </AlertDescription>
      </Alert>

      <ul className="space-y-4">
        {DEMO_MALPRACTICE_ITEMS.map((item) => (
          <li key={item.id}>
            <Card className="border border-border shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <CardTitle className="text-base leading-snug">{item.treatment}</CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0",
                    item.severity === "high"
                      ? "border-red-300 text-red-800 dark:border-red-800 dark:text-red-300"
                      : "border-amber-300 text-amber-900 dark:border-amber-700 dark:text-amber-200",
                  )}
                >
                  {item.severity === "high" ? "High concern" : "Review"}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">{item.issue}</CardDescription>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/marketplace">Legal marketplace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/medicine">Medication flags</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Bill scan</Link>
        </Button>
      </div>
    </div>
  )
}

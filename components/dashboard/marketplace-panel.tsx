"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Building2, CheckCircle2, Clock, MapPin, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEMO_FIRMS, type DemoFirm, type FirmSpecialty } from "@/lib/dashboard-demo-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AnalyzedCaseBanner } from "@/components/dashboard/analyzed-case-banner"

const SPECIALTY_LABEL: Record<FirmSpecialty | "all", string> = {
  all: "All specialties",
  billing: "Billing & overcharge",
  insurance: "Insurance / EOB",
  medmal: "Med-mal / high stakes",
}

const REGIONS = ["all", "IL", "TX", "DC"] as const

export function MarketplacePanel() {
  const [specialty, setSpecialty] = useState<FirmSpecialty | "all">("all")
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("all")
  const [introSent, setIntroSent] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return DEMO_FIRMS.filter((f) => {
      if (specialty !== "all" && f.specialty !== specialty) return false
      if (region !== "all" && f.state !== region) return false
      return true
    })
  }, [specialty, region])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AnalyzedCaseBanner />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Legal</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">Marketplace — lawyers &amp; firms</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          When medications, treatments, or billing disputes need counsel. Rankings are illustrative.
        </p>
      </div>

      <Alert>
        <Scale className="h-4 w-4" />
        <AlertTitle>Not a law firm</AlertTitle>
        <AlertDescription className="text-sm">
          Intro requests simulate intake only. No attorney–client relationship is created here.
        </AlertDescription>
      </Alert>

      <Card className="border border-gray-200 shadow-sm dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Filter directory</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label>Specialty</Label>
            <Select value={specialty} onValueChange={(v) => setSpecialty(v as FirmSpecialty | "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SPECIALTY_LABEL) as (FirmSpecialty | "all")[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {SPECIALTY_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Region</Label>
            <Select value={region} onValueChange={(v) => setRegion(v as (typeof REGIONS)[number])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All listed</SelectItem>
                {REGIONS.filter((s) => s !== "all").map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {introSent ? (
        <Alert className="border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-900 dark:text-emerald-200">Intro request logged</AlertTitle>
          <AlertDescription className="text-emerald-900/90 dark:text-emerald-200/90">
            We would email <strong>{introSent}</strong> with your case summary. Nothing was sent.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((firm) => (
          <FirmCard key={firm.id} firm={firm} onIntro={() => setIntroSent(firm.name)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No firms match — try “All”.</p>
      ) : null}

      <Button asChild variant="ghost">
        <Link href="/dashboard">← Bill scan</Link>
      </Button>
    </div>
  )
}

function FirmCard({ firm, onIntro }: { firm: DemoFirm; onIntro: () => void }) {
  return (
    <Card className="flex h-full flex-col border border-gray-200 shadow-sm dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-medium leading-tight">{firm.name}</CardTitle>
          <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
            {firm.id}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {firm.city}, {firm.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{firm.blurb}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-muted/50 px-1 py-2">
            <p className="text-muted-foreground">Win rate</p>
            <p className="font-semibold text-foreground">{firm.winRatePct}%</p>
          </div>
          <div className="rounded-md bg-muted/50 px-1 py-2">
            <p className="text-muted-foreground">Avg recovery</p>
            <p className="font-semibold text-foreground">${firm.avgRecoveryK}k avg</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md bg-muted/50 py-2">
            <Clock className="mb-0.5 h-3 w-3 text-muted-foreground" />
            <p className="font-semibold text-foreground">{firm.responseHrs}h</p>
            <p className="text-[10px] text-muted-foreground">SLA</p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          {firm.intakeFeeLabel}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" type="button" onClick={onIntro}>
          Request intro
        </Button>
      </CardFooter>
    </Card>
  )
}

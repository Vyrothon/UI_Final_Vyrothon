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

const SPECIALTY_LABEL: Record<FirmSpecialty | "all", string> = {
  all: "All specialties",
  billing: "Billing & overcharge",
  insurance: "Insurance / EOB",
  medmal: "Med-mal / high stakes",
}

const US_STATES = ["all", "IL", "CA", "TX"] as const

export function MarketplacePanel() {
  const [specialty, setSpecialty] = useState<FirmSpecialty | "all">("all")
  const [state, setState] = useState<(typeof US_STATES)[number]>("all")
  const [introSent, setIntroSent] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return DEMO_FIRMS.filter((f) => {
      if (specialty !== "all" && f.specialty !== specialty) return false
      if (state !== "all" && f.state !== state) return false
      return true
    })
  }, [specialty, state])

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step 5 of 5</p>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mt-1">Legal marketplace</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-3xl">
          Vetted firms (hardcoded). Ranking is illustrative — your README rules (win rate, recovery, SLA) would drive
          real scores. ClearClaim does not represent you; intros are educational in this demo.
        </p>
      </div>

      <Alert>
        <Scale className="h-4 w-4" />
        <AlertTitle>Not a law firm</AlertTitle>
        <AlertDescription className="text-sm">
          Selecting a firm below only simulates an intake request. No attorney-client relationship is created in this
          demo build.
        </AlertDescription>
      </Alert>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Filter demo directory</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
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
          <div className="space-y-2 flex-1">
            <Label>State</Label>
            <Select value={state} onValueChange={(v) => setState(v as (typeof US_STATES)[number])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All listed</SelectItem>
                {US_STATES.filter((s) => s !== "all").map((s) => (
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
          <AlertTitle className="text-emerald-900 dark:text-emerald-200">Demo intake logged</AlertTitle>
          <AlertDescription className="text-emerald-900/90 dark:text-emerald-200/90">
            We would email <strong>{introSent}</strong> with your audit pack. Nothing was sent.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((firm) => (
          <FirmCard key={firm.id} firm={firm} onIntro={() => setIntroSent(firm.name)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No firms match those filters — try “All”.</p>
      ) : null}

      <Button asChild variant="ghost">
        <Link href="/dashboard/letters">← Letters &amp; docs</Link>
      </Button>
    </div>
  )
}

function FirmCard({ firm, onIntro }: { firm: DemoFirm; onIntro: () => void }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
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
      <CardContent className="space-y-3 flex-1">
        <p className="text-sm text-muted-foreground">{firm.blurb}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-muted/50 py-2 px-1">
            <p className="text-muted-foreground">Win rate</p>
            <p className="font-semibold text-foreground">{firm.winRatePct}%</p>
          </div>
          <div className="rounded-md bg-muted/50 py-2 px-1">
            <p className="text-muted-foreground">Avg recovery</p>
            <p className="font-semibold text-foreground">${firm.avgRecoveryK}k</p>
          </div>
          <div className="rounded-md bg-muted/50 py-2 px-1 flex flex-col items-center justify-center">
            <Clock className="h-3 w-3 text-muted-foreground mb-0.5" />
            <p className="font-semibold text-foreground">{firm.responseHrs}h</p>
            <p className="text-[10px] text-muted-foreground">SLA</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          {firm.intakeFeeLabel}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" type="button" onClick={onIntro}>
          Request intro (demo)
        </Button>
      </CardFooter>
    </Card>
  )
}

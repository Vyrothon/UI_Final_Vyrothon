import { prototypeTracker, DISCLAIMER_SHORT } from "@/lib/clearclaim-prototype-data"
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TrackerPage() {
  return (
    <DashboardPageFrame
      eyebrow="Claim tracker"
      title="Correspondence log"
      description='Correspondence log (Implementation "Claim Tracker") — hardcoded events.'
      disclaimer={DISCLAIMER_SHORT}
    >
      <ul className="space-y-4">
        {prototypeTracker.map((ev) => (
          <li key={ev.id}>
            <Card className="border border-border shadow-sm">
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wide">
                    {ev.direction}
                  </Badge>
                  <CardTitle className="text-base leading-snug">{ev.title}</CardTitle>
                  <CardDescription className="mt-1">{ev.at}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{ev.detail}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </DashboardPageFrame>
  )
}

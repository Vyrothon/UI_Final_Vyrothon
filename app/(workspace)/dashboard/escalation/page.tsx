import { prototypeEscalation, DISCLAIMER_SHORT } from "@/lib/clearclaim-prototype-data"
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function EscalationPage() {
  return (
    <DashboardPageFrame
      eyebrow="Dispute ladder"
      title="Escalation path"
      description="complete_doc §4.6 — static ladder. Production would drive deadlines from a scheduler + claim state."
      disclaimer={DISCLAIMER_SHORT}
    >
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6 pt-8">
          <ol className="space-y-0 border-l-2 border-border pl-6">
            {prototypeEscalation.map((step) => (
              <li key={step.level} className="relative pb-10 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[29px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background text-xs font-bold",
                    step.status === "done" && "border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400",
                    step.status === "current" && "border-primary text-primary",
                    step.status === "upcoming" && "border-muted-foreground/35 text-muted-foreground",
                  )}
                >
                  {step.level}
                </span>
                <p className="font-semibold">
                  Level {step.level}: {step.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                {step.due ? <p className="mt-2 text-xs text-muted-foreground">Due / anchor: {step.due}</p> : null}
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/80">{step.status}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </DashboardPageFrame>
  )
}

import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type MaxWidth = "3xl" | "4xl" | "5xl"

export function DashboardPageFrame({
  title,
  description,
  eyebrow,
  maxWidth = "3xl",
  backHref = "/dashboard",
  backLabel = "Back to intake",
  disclaimer,
  children,
}: {
  title: string
  description?: ReactNode
  eyebrow?: string
  maxWidth?: MaxWidth
  backHref?: string
  backLabel?: string
  disclaimer?: string
  children: ReactNode
}) {
  const mw: Record<MaxWidth, string> = {
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  }

  return (
    <div className={cn("mx-auto space-y-8", mw[maxWidth])}>
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
        {eyebrow ? (
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className={cn("text-2xl font-medium tracking-tight md:text-3xl", eyebrow ? "mt-1" : "mt-4")}>{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p> : null}
        {disclaimer ? <p className="mt-4 text-xs text-muted-foreground/90">{disclaimer}</p> : null}
      </div>
      {children}
    </div>
  )
}

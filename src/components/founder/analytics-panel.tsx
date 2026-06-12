import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface AnalyticsPanelProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
  dense?: boolean
}

export function AnalyticsPanel({
  title,
  description,
  action,
  className,
  children,
  dense,
}: AnalyticsPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/60 bg-card/30",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border/40 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <div className={cn(dense ? "p-0" : "px-4 py-4 sm:px-5 sm:py-5")}>
        {children}
      </div>
    </section>
  )
}

"use client"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import type { ActionItem } from "@/types/report"

interface ActionPlanProps {
  items: ActionItem[]
}

export function ActionPlan({ items }: ActionPlanProps) {
  const { messages } = useLocale()

  return (
    <ReportSection
      title={messages.report.actionPlan}
      description={messages.report.actionPlanDescription}
    >
      <ol className="space-y-3">
        {items.map((item) => (
          <li
            key={item.priority}
            className="flex gap-4 rounded-xl border border-border/60 bg-muted/20 p-4"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background font-mono text-xs font-medium">
              {item.priority}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.timeframe}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </ReportSection>
  )
}

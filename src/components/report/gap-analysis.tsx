"use client"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { GapItem } from "@/types/report"
import { cn } from "@/lib/utils"

interface GapAnalysisProps {
  gaps: GapItem[]
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  const { messages } = useLocale()

  const impactConfig = {
    high: {
      label: messages.report.impact.high,
      className: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    },
    medium: {
      label: messages.report.impact.medium,
      className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
    low: {
      label: messages.report.impact.low,
      className: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    },
  }

  return (
    <ReportSection
      title={messages.report.gapAnalysis}
      description={messages.report.gapAnalysisDescription}
      trackingId="gap_analysis"
    >
      <div className="space-y-3">
        {gaps.map((gap) => {
          const config = impactConfig[gap.impact]
          return (
            <div
              key={gap.area}
              className="rounded-xl border border-border/60 bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{gap.area}</h3>
                <Badge
                  variant="outline"
                  className={cn("font-mono text-[10px] uppercase", config.className)}
                >
                  {config.label}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {gap.description}
              </p>
            </div>
          )
        })}
      </div>
    </ReportSection>
  )
}

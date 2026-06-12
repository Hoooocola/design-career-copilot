"use client"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import type { CompetencyOverview } from "@/types/framework"

interface CompetencyOverviewProps {
  data: CompetencyOverview
}

export function CompetencyOverviewPanel({ data }: CompetencyOverviewProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework

  return (
    <ReportSection
      title={fw.competencyOverview}
      description={fw.competencyOverviewDescription}
    >
      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/20 py-8">
          <span className="text-4xl font-semibold tabular-nums">
            {data.overallReadiness}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fw.overallReadiness}
          </span>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              {fw.topStrengths}
            </p>
            <ul className="mt-2 space-y-1.5">
              {data.topStrengths.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-rose-400">
              {fw.criticalGaps}
            </p>
            <ul className="mt-2 space-y-1.5">
              {data.criticalGaps.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border/60 border-l-2 border-l-primary/50 bg-muted/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {fw.reviewerVerdict}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.reviewerVerdict}
            </p>
          </div>
        </div>
      </div>
    </ReportSection>
  )
}

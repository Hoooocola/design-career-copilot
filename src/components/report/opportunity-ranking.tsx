"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { OpportunityItem, OpportunityPriority } from "@/types/report"
import { cn } from "@/lib/utils"

interface OpportunityRankingProps {
  opportunities: OpportunityItem[]
}

export function OpportunityRanking({ opportunities }: OpportunityRankingProps) {
  const { messages } = useLocale()
  const roadmap = messages.report.careerUpgradeRoadmap

  const priorityLabels: Record<OpportunityPriority, string> = {
    high: roadmap.priorityHigh,
    medium: roadmap.priorityMedium,
    low: roadmap.priorityLow,
  }

  const priorityStyles: Record<OpportunityPriority, string> = {
    high: "border-[var(--workspace-danger)]/25 bg-[var(--workspace-danger-muted)] text-[var(--workspace-danger)]",
    medium:
      "border-[var(--workspace-warning)]/25 bg-[var(--workspace-warning-muted)] text-[var(--workspace-warning)]",
    low: "border-[var(--workspace-accent)]/25 bg-[var(--workspace-accent-muted)] text-[var(--workspace-accent)]",
  }

  return (
    <ReportSection
      title={roadmap.title}
      description={roadmap.description}
      trackingId="opportunity_ranking"
    >
      <div className="space-y-4">
        {opportunities.map((item, index) => (
          <ReportCard key={`${item.title}-${index}`} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="report-caption">
                  {roadmap.opportunityLabel} {index + 1}
                </p>
                <h4 className="mt-1 text-base font-semibold text-[var(--workspace-text-primary)]">
                  {item.title}
                </h4>
              </div>
              <span
                className={cn(
                  "rounded-md border px-2.5 py-0.5 text-xs font-medium",
                  priorityStyles[item.priority]
                )}
              >
                {priorityLabels[item.priority]}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <RoadmapMetric label={roadmap.currentGap} value={item.weakness} span />
              <RoadmapMetric
                label={roadmap.hiringImpact}
                value={`${item.impact}/5`}
              />
              <RoadmapMetric
                label={roadmap.expectedScoreImprovement}
                value={item.expectedOutcome}
                span
              />
              <RoadmapMetric label={roadmap.effort} value={`${item.effort}/5`} />
            </dl>
          </ReportCard>
        ))}
      </div>
    </ReportSection>
  )
}

function RoadmapMetric({
  label,
  value,
  span,
}: {
  label: string
  value: string
  span?: boolean
}) {
  return (
    <div className={cn(span && "sm:col-span-2")}>
      <dt className="report-caption">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-[var(--workspace-text-primary)]">{value}</dd>
    </div>
  )
}

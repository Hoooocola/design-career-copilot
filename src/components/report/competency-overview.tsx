"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
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
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <ReportCard className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-5xl font-semibold tabular-nums text-[var(--workspace-text-primary)]">
            {data.overallReadiness}
          </span>
          <span className="report-caption mt-2">{fw.overallReadiness}</span>
        </ReportCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricPanel title={fw.topStrengths} items={data.topStrengths} variant="positive" />
          <MetricPanel title={fw.criticalGaps} items={data.criticalGaps} variant="negative" />
        </div>
      </div>
    </ReportSection>
  )
}

function MetricPanel({
  title,
  items,
  variant,
}: {
  title: string
  items: string[]
  variant: "positive" | "negative"
}) {
  return (
    <ReportCard
      className={
        variant === "positive"
          ? "bg-[var(--workspace-success-muted)]"
          : "bg-[var(--workspace-danger-muted)]"
      }
    >
      <p
        className={
          variant === "positive"
            ? "text-xs font-semibold uppercase tracking-wider text-[var(--workspace-success)]"
            : "text-xs font-semibold uppercase tracking-wider text-[var(--workspace-danger)]"
        }
      >
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
            {item}
          </li>
        ))}
      </ul>
    </ReportCard>
  )
}

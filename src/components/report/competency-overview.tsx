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
          <span className="text-5xl font-semibold tabular-nums text-[var(--report-text)]">
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
          ? "bg-[var(--report-positive-bg)]"
          : "bg-[var(--report-negative-bg)]"
      }
    >
      <p
        className={
          variant === "positive"
            ? "text-xs font-semibold uppercase tracking-wider text-[var(--report-positive)]"
            : "text-xs font-semibold uppercase tracking-wider text-[var(--report-negative)]"
        }
      >
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--report-text-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </ReportCard>
  )
}

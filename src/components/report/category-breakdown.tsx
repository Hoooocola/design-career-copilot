"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { CategoryScore, DimensionScore } from "@/types/framework"
import type { CategoryId, DimensionId } from "@/types/framework"
import { cn } from "@/lib/utils"

interface CategoryBreakdownProps {
  categories: CategoryScore[]
  dimensionScores: DimensionScore[]
}

const CATEGORY_ORDER: CategoryId[] = [
  "product_strategy",
  "experience_craft",
  "systems_technical",
  "communication_process",
]

export function CategoryBreakdown({
  categories,
  dimensionScores,
}: CategoryBreakdownProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework
  const scoreMap = new Map(dimensionScores.map((d) => [d.dimensionId, d]))

  const ordered = CATEGORY_ORDER.map((id) => {
    const cat = categories.find((c) => c.categoryId === id)
    return {
      id,
      score: cat?.score ?? 0,
      dimensionIds: cat?.dimensionIds ?? [],
    }
  })

  return (
    <ReportSection
      title={fw.categoryBreakdown}
      description={fw.categoryBreakdownDescription}
    >
      <div className="space-y-5">
        {ordered.map((cat) => (
          <ReportCard key={cat.id}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--workspace-text-primary)]">
                {fw.categories[cat.id]}
              </h3>
              <span className="font-mono text-sm tabular-nums text-[var(--workspace-text-secondary)]">
                {cat.score}%
              </span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--workspace-border)]">
              <div
                className="h-full rounded-full bg-[var(--workspace-accent)] transition-all"
                style={{ width: `${cat.score}%` }}
              />
            </div>
            <div className="space-y-2">
              {cat.dimensionIds.map((dimId) => {
                const dim = scoreMap.get(dimId)
                const pct = dim ? (dim.score / 5) * 100 : 0
                return (
                  <DimensionRow
                    key={dimId}
                    label={fw.dimensions[dimId as DimensionId]}
                    score={dim?.score ?? 0}
                    pct={pct}
                    labelKey={dim?.label}
                    scoreLabels={fw.scoreLabels}
                  />
                )
              })}
            </div>
          </ReportCard>
        ))}
      </div>
    </ReportSection>
  )
}

function DimensionRow({
  label,
  score,
  pct,
  labelKey,
  scoreLabels,
}: {
  label: string
  score: number
  pct: number
  labelKey?: string
  scoreLabels: Record<string, string>
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 truncate text-sm text-[var(--workspace-text-secondary)]">
        {label}
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--workspace-border)]">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            score >= 4
              ? "bg-[var(--workspace-success)]"
              : score >= 3
                ? "bg-[var(--workspace-accent)]"
                : score >= 2
                  ? "bg-[var(--workspace-warning)]"
                  : "bg-[var(--workspace-danger)]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-xs uppercase text-[var(--workspace-text-muted)]">
        {labelKey ? scoreLabels[labelKey] : "—"}
      </span>
    </div>
  )
}

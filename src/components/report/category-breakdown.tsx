"use client"

import { ReportSection } from "@/components/report/report-section"
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
      <div className="space-y-6">
        {ordered.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-border/60 bg-muted/20 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{fw.categories[cat.id]}</h3>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {cat.score}%
              </span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/80 transition-all"
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
          </div>
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
      <span className="w-36 shrink-0 truncate text-xs text-muted-foreground">
        {label}
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/80">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            score >= 4
              ? "bg-emerald-500/70"
              : score >= 3
                ? "bg-sky-500/70"
                : score >= 2
                  ? "bg-amber-500/70"
                  : "bg-rose-500/70"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-mono text-[10px] uppercase text-muted-foreground">
        {labelKey ? scoreLabels[labelKey] : "—"}
      </span>
    </div>
  )
}

"use client"

import { useLocale } from "@/components/providers/locale-provider"
import { ReportCard } from "@/components/report/report-primitives"
import { computeTopPercentile } from "@/lib/report/metrics"
import type {
  BenchmarkDimensionId,
  BenchmarkPercentileItem,
  PortfolioBenchmark,
} from "@/types/report"
import { cn } from "@/lib/utils"

interface CompetitivePositionProps {
  data: PortfolioBenchmark
  embedded?: boolean
}

const PREVIEW_COUNT = 4

export function CompetitivePosition({ data, embedded }: CompetitivePositionProps) {
  const { messages } = useLocale()
  const cp = messages.report.competitivePosition
  const bm = messages.report.benchmark
  const topPercentile = computeTopPercentile(data)

  const sorted = [...data.percentileRanking].sort(
    (a, b) => b.percentile - a.percentile
  )
  const preview = sorted.slice(0, PREVIEW_COUNT)

  return (
    <section id="competitive-position" className="space-y-4">
      {!embedded && (
        <div>
          <h3 className="report-h3">{cp.title}</h3>
          <p className="report-body mt-1 text-[0.9375rem]">{cp.description}</p>
        </div>
      )}

      <ReportCard className="overflow-hidden p-0">
        {/* Comparison group + headline */}
        <div className="grid gap-4 border-b border-[var(--workspace-border)] px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
          <div>
            <p className="report-caption">{cp.comparisonGroup}</p>
            <p className="mt-1 text-base font-semibold text-[var(--workspace-text-primary)]">
              {data.cohortLabel}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--workspace-accent)]/20 bg-[var(--workspace-accent-muted)] px-4 py-3 text-center sm:text-right">
            <p className="report-caption text-[var(--workspace-accent)]">
              {cp.overallStanding}
            </p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-[var(--workspace-accent)]">
              {messages.report.score.benchmark.replace("{percent}", String(topPercentile))}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          {/* Percentile preview */}
          <div className="border-b border-[var(--workspace-border)] px-6 py-5 lg:border-b-0 lg:border-r sm:px-8">
            <p className="report-caption">{cp.percentileRanking}</p>
            <ul className="mt-4 space-y-3">
              {preview.map((item) => (
                <PercentilePreviewRow
                  key={item.dimensionId}
                  item={item}
                  label={bm.dimensions[item.dimensionId as BenchmarkDimensionId]}
                  tierTopLabel={bm.tierTop}
                  tierBottomLabel={bm.tierBottom}
                />
              ))}
            </ul>
            {sorted.length > PREVIEW_COUNT && (
              <p className="mt-3 text-xs text-[var(--workspace-text-muted)]">
                {cp.moreDimensions.replace("{count}", String(sorted.length - PREVIEW_COUNT))}
              </p>
            )}
          </div>

          {/* Strongest areas */}
          <div className="px-6 py-5 sm:px-8">
            <p className="report-caption">{cp.strongestAreas}</p>
            <ul className="mt-4 space-y-2.5">
              {data.strongestAreas.map((area, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[0.9375rem] leading-snug text-[var(--workspace-text-primary)]"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--workspace-success)]" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-6 py-3 sm:px-8">
          <p className="text-xs text-[var(--workspace-text-muted)]">{cp.methodologyNote}</p>
        </div>
      </ReportCard>
    </section>
  )
}

function PercentilePreviewRow({
  item,
  label,
  tierTopLabel,
  tierBottomLabel,
}: {
  item: BenchmarkPercentileItem
  label: string
  tierTopLabel: string
  tierBottomLabel: string
}) {
  const tierLabel =
    item.tier === "top"
      ? `${tierTopLabel} ${item.tierPercent}%`
      : `${tierBottomLabel} ${item.tierPercent}%`

  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--workspace-text-primary)]">{label}</span>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
            item.tier === "top"
              ? "bg-[var(--workspace-accent-muted)] text-[var(--workspace-accent)]"
              : "bg-[var(--workspace-danger-muted)] text-[var(--workspace-danger)]"
          )}
        >
          {tierLabel}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--workspace-border)]">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            item.tier === "top" ? "bg-[var(--workspace-accent)]" : "bg-[var(--workspace-danger)]"
          )}
          style={{ width: `${item.percentile}%` }}
        />
      </div>
    </li>
  )
}

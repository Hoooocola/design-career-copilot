"use client"

import { ArrowDown, ArrowUp } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type {
  BenchmarkDimensionId,
  BenchmarkPercentileItem,
  PortfolioBenchmark,
} from "@/types/report"
import { cn } from "@/lib/utils"

interface BenchmarkAnalysisProps {
  data: PortfolioBenchmark
  embedded?: boolean
}

export function BenchmarkAnalysis({ data, embedded }: BenchmarkAnalysisProps) {
  const { messages } = useLocale()
  const bm = messages.report.benchmark

  const sorted = [...data.percentileRanking].sort(
    (a, b) => b.percentile - a.percentile
  )

  const content = (
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-5 py-4">
          <p className="report-caption">{bm.cohortComparison}</p>
          <p className="mt-1.5 text-base font-medium tracking-tight text-[var(--workspace-text-primary)]">
            {data.cohortLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
            {bm.cohortNote}
          </p>
          <Badge
            variant="outline"
            className="mt-3 border-[var(--workspace-border)] font-mono text-[10px] uppercase tracking-wider text-[var(--workspace-text-muted)]"
          >
            {bm.simulatedData}
          </Badge>
        </div>

        <section className="overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface-raised)]">
          <header className="border-b border-[var(--workspace-border)] px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight text-[var(--workspace-text-primary)]">
              {bm.percentileRanking}
            </h3>
            <p className="mt-1 text-xs text-[var(--workspace-text-secondary)]">
              {bm.percentileRankingHint}
            </p>
          </header>
          <div className="divide-y divide-[var(--workspace-border)]/60">
            {sorted.map((item) => (
              <PercentileRow
                key={item.dimensionId}
                item={item}
                label={bm.dimensions[item.dimensionId as BenchmarkDimensionId]}
                tierTopLabel={bm.tierTop}
                tierBottomLabel={bm.tierBottom}
              />
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <AnalysisBlock
            title={bm.strongestAreas}
            icon={<ArrowUp className="size-3.5 text-[var(--workspace-success)]" />}
            variant="positive"
            items={data.strongestAreas}
          />
          <AnalysisBlock
            title={bm.weakestAreas}
            icon={<ArrowDown className="size-3.5 text-[var(--workspace-danger)]" />}
            variant="negative"
            items={data.weakestAreas}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InsightBlock
            title={bm.competitiveAdvantage}
            label={bm.keyInsight}
            content={data.competitiveAdvantage}
            variant="accent"
          />
          <InsightBlock
            title={bm.improvementPotential}
            label={bm.strategicImplication}
            content={data.improvementPotential}
            variant="caution"
          />
        </div>
      </div>
  )

  if (embedded) return content

  return (
    <ReportSection
      title={bm.detailedTitle}
      description={bm.detailedDescription}
      trackingId="benchmark"
    >
      {content}
    </ReportSection>
  )
}

function PercentileRow({
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
    <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(140px,180px)_1fr_auto] sm:items-center">
      <span className="text-sm font-medium text-[var(--workspace-text-primary)]">{label}</span>
      <div className="space-y-1.5">
        <div className="relative h-2 overflow-hidden rounded-sm bg-[var(--workspace-border)]">
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{
              width: `${item.percentile}%`,
              backgroundColor:
                item.tier === "top"
                  ? "var(--workspace-accent)"
                  : "var(--workspace-danger)",
            }}
          />
          <div
            className="absolute inset-y-0 w-px bg-[var(--workspace-border)]"
            style={{ left: "50%" }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--workspace-text-muted)]">
          <span>0</span>
          <span>{tierBottomLabel}</span>
          <span>{tierTopLabel}</span>
          <span>100</span>
        </div>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "w-fit shrink-0 font-mono text-[10px] uppercase tracking-wider",
          item.tier === "top"
            ? "border-[var(--workspace-accent)]/25 bg-[var(--workspace-accent-muted)] text-[var(--workspace-accent)]"
            : "border-[var(--workspace-danger)]/25 bg-[var(--workspace-danger-muted)] text-[var(--workspace-danger)]"
        )}
      >
        {tierLabel}
      </Badge>
    </div>
  )
}

function AnalysisBlock({
  title,
  icon,
  variant,
  items,
}: {
  title: string
  icon: React.ReactNode
  variant: "positive" | "negative"
  items: string[]
}) {
  const variantClass = {
    positive: "border-[var(--workspace-success)]/20 bg-[var(--workspace-success-muted)]",
    negative: "border-[var(--workspace-danger)]/20 bg-[var(--workspace-danger-muted)]",
  }[variant]

  return (
    <section className={cn("rounded-xl border p-5", variantClass)}>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold tracking-tight text-[var(--workspace-text-primary)]">
          {title}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-2.5 text-sm leading-relaxed text-[var(--workspace-text-secondary)]"
          >
            <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--workspace-text-muted)]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function InsightBlock({
  title,
  label,
  content,
  variant,
}: {
  title: string
  label: string
  content: string
  variant: "accent" | "caution"
}) {
  const accentBar =
    variant === "accent" ? "bg-[var(--workspace-accent)]" : "bg-[var(--workspace-warning)]"

  return (
    <section className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-5">
      <p className="report-caption">{label}</p>
      <h3 className="mt-2 text-sm font-semibold tracking-tight text-[var(--workspace-text-primary)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-[1.7] text-[var(--workspace-text-secondary)]">
        {content}
      </p>
      <div className={cn("mt-4 h-0.5 w-12 rounded-full opacity-60", accentBar)} />
    </section>
  )
}

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
}

export function BenchmarkAnalysis({ data }: BenchmarkAnalysisProps) {
  const { messages } = useLocale()
  const bm = messages.report.benchmark

  const sorted = [...data.percentileRanking].sort(
    (a, b) => b.percentile - a.percentile
  )

  return (
    <ReportSection
      title={bm.detailedTitle}
      description={bm.detailedDescription}
      trackingId="benchmark"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)] px-5 py-4">
          <p className="report-caption">{bm.cohortComparison}</p>
          <p className="mt-1.5 text-base font-medium tracking-tight text-[var(--report-text)]">
            {data.cohortLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--report-text-muted)]">
            {bm.cohortNote}
          </p>
          <Badge
            variant="outline"
            className="mt-3 border-[var(--report-border)] font-mono text-[10px] uppercase tracking-wider text-[var(--report-text-subtle)]"
          >
            {bm.simulatedData}
          </Badge>
        </div>

        <section className="overflow-hidden rounded-xl border border-[var(--report-border)] bg-[var(--report-card)]">
          <header className="border-b border-[var(--report-border)] px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight text-[var(--report-text)]">
              {bm.percentileRanking}
            </h3>
            <p className="mt-1 text-xs text-[var(--report-text-muted)]">
              {bm.percentileRankingHint}
            </p>
          </header>
          <div className="divide-y divide-[var(--report-border)]/60">
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
            icon={<ArrowUp className="size-3.5 text-[var(--report-positive)]" />}
            variant="positive"
            items={data.strongestAreas}
          />
          <AnalysisBlock
            title={bm.weakestAreas}
            icon={<ArrowDown className="size-3.5 text-[var(--report-negative)]" />}
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
      <span className="text-sm font-medium text-[var(--report-text)]">{label}</span>
      <div className="space-y-1.5">
        <div className="relative h-2 overflow-hidden rounded-sm bg-[var(--report-border)]">
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{
              width: `${item.percentile}%`,
              backgroundColor:
                item.tier === "top"
                  ? "var(--report-accent)"
                  : "var(--report-negative)",
            }}
          />
          <div
            className="absolute inset-y-0 w-px bg-[var(--report-border-strong)]"
            style={{ left: "50%" }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--report-text-subtle)]">
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
            ? "border-[var(--report-accent)]/25 bg-[var(--report-accent-muted)] text-[var(--report-accent)]"
            : "border-[var(--report-negative)]/25 bg-[var(--report-negative-bg)] text-[var(--report-negative)]"
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
    positive: "border-[var(--report-positive)]/20 bg-[var(--report-positive-bg)]",
    negative: "border-[var(--report-negative)]/20 bg-[var(--report-negative-bg)]",
  }[variant]

  return (
    <section className={cn("rounded-xl border p-5", variantClass)}>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold tracking-tight text-[var(--report-text)]">
          {title}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-2.5 text-sm leading-relaxed text-[var(--report-text-muted)]"
          >
            <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--report-text-subtle)]" />
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
    variant === "accent" ? "bg-[var(--report-accent)]" : "bg-[var(--report-caution)]"

  return (
    <section className="rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)] p-5">
      <p className="report-caption">{label}</p>
      <h3 className="mt-2 text-sm font-semibold tracking-tight text-[var(--report-text)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-[1.7] text-[var(--report-text-muted)]">
        {content}
      </p>
      <div className={cn("mt-4 h-0.5 w-12 rounded-full opacity-60", accentBar)} />
    </section>
  )
}

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
      title={bm.title}
      description={bm.description}
      trackingId="benchmark"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)] px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {bm.cohortComparison}
          </p>
          <p className="mt-1.5 text-base font-medium tracking-tight">
            {data.cohortLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {bm.cohortNote}
          </p>
          <Badge
            variant="outline"
            className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            {bm.simulatedData}
          </Badge>
        </div>

        <section className="rounded-xl border border-border/60 bg-background">
          <header className="border-b border-border/40 px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight">
              {bm.percentileRanking}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {bm.percentileRankingHint}
            </p>
          </header>
          <div className="divide-y divide-border/30">
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
            icon={<ArrowUp className="size-3.5 text-emerald-400" />}
            accent="border-emerald-500/20"
            items={data.strongestAreas}
          />
          <AnalysisBlock
            title={bm.weakestAreas}
            icon={<ArrowDown className="size-3.5 text-rose-400" />}
            accent="border-rose-500/20"
            items={data.weakestAreas}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InsightBlock
            title={bm.competitiveAdvantage}
            label={bm.keyInsight}
            content={data.competitiveAdvantage}
            variant="advantage"
          />
          <InsightBlock
            title={bm.improvementPotential}
            label={bm.strategicImplication}
            content={data.improvementPotential}
            variant="potential"
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
      <span className="text-sm font-medium">{label}</span>
      <div className="space-y-1.5">
        <div className="relative h-2 overflow-hidden rounded-sm bg-muted/80">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-sm",
              item.tier === "top" ? "bg-sky-500/80" : "bg-rose-500/70"
            )}
            style={{ width: `${item.percentile}%` }}
          />
          <div
            className="absolute inset-y-0 w-px bg-border/80"
            style={{ left: "50%" }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
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
            ? "border-sky-500/25 bg-sky-500/10 text-sky-400"
            : "border-rose-500/25 bg-rose-500/10 text-rose-400"
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
  accent,
  items,
}: {
  title: string
  icon: React.ReactNode
  accent: string
  items: string[]
}) {
  return (
    <section className={cn("rounded-xl border bg-muted/10 p-5", accent)}>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/40" />
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
  variant: "advantage" | "potential"
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-muted/10 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <h3 className="mt-2 text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">
        {content}
      </p>
      <div
        className={cn(
          "mt-4 h-0.5 w-12 rounded-full",
          variant === "advantage" ? "bg-sky-500/60" : "bg-amber-500/60"
        )}
      />
    </section>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { buildImprovementScenarios } from "@/lib/simulator/build-scenarios"
import { simulateImprovement } from "@/lib/simulator/simulate-improvement"
import type { PortfolioReport } from "@/types/report"
import type { ImprovementScenario } from "@/types/simulator"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ImprovementSimulatorProps {
  report: PortfolioReport
  persona: ReviewerPersona
}

export function ImprovementSimulator({
  report,
  persona,
}: ImprovementSimulatorProps) {
  const { messages, locale } = useLocale()
  const sim = messages.report.improvementSimulator
  const fw = messages.report.framework
  const hm = messages.report.heatmap

  const scenarios = useMemo(
    () => buildImprovementScenarios(report, persona, locale),
    [report, persona, locale]
  )

  const [selectedId, setSelectedId] = useState<string>(
    scenarios[0]?.id ?? ""
  )

  useEffect(() => {
    if (!scenarios.some((scenario) => scenario.id === selectedId)) {
      setSelectedId(scenarios[0]?.id ?? "")
    }
  }, [scenarios, selectedId])

  const activeScenario =
    scenarios.find((s) => s.id === selectedId) ?? scenarios[0]

  const projection = useMemo(() => {
    if (!activeScenario) return null
    const dimensionLabel =
      hm.shortLabels[activeScenario.primaryDimensionId] ??
      fw.dimensions[activeScenario.primaryDimensionId]
    return simulateImprovement(
      report,
      activeScenario,
      persona,
      locale,
      dimensionLabel
    )
  }, [activeScenario, report, persona, locale, fw, hm])

  if (!activeScenario || !projection) return null

  return (
    <ReportSection title={sim.title} description={sim.description}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-2">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {sim.actionsLabel}
          </p>
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              active={scenario.id === activeScenario.id}
              onSelect={() => setSelectedId(scenario.id)}
              impactLabel={sim.impact}
              effortLabel={sim.effort}
              roiHint={sim.bestRoi}
              isTopRoi={scenario.id === scenarios[0]?.id}
            />
          ))}
          <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
            {sim.disclaimer}
          </p>
        </div>

        <div className="report-card p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400/90" />
              <p className="text-sm font-semibold tracking-tight">
                {sim.projectionTitle}
              </p>
            </div>
            <ConfidenceBadge
              level={projection.confidence}
              labels={sim.confidence}
            />
          </div>

          <div className="space-y-4">
            <ProjectionRow
              label={`${projection.dimensionLabel} ${sim.scoreLabel}`}
              before={projection.dimensionScoreBefore}
              after={projection.dimensionScoreAfter}
              currentLabel={sim.current}
              projectedLabel={sim.projected}
            />
            <ProjectionRow
              label={sim.jobMatch}
              before={projection.matchScoreBefore}
              after={projection.matchScoreAfter}
              currentLabel={sim.current}
              projectedLabel={sim.projected}
              suffix="%"
            />
            <BenchmarkRow
              label={sim.benchmark}
              before={projection.benchmarkBefore}
              after={projection.benchmarkAfter}
              currentLabel={sim.current}
              projectedLabel={sim.projected}
            />
          </div>

          <div className="mt-5 rounded-lg border border-border/40 bg-background/40 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {sim.rationaleLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {projection.rationale}
            </p>
          </div>
        </div>
      </div>
    </ReportSection>
  )
}

function ScenarioCard({
  scenario,
  active,
  onSelect,
  impactLabel,
  effortLabel,
  roiHint,
  isTopRoi,
}: {
  scenario: ImprovementScenario
  active: boolean
  onSelect: () => void
  impactLabel: string
  effortLabel: string
  roiHint: string
  isTopRoi: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border px-4 py-3.5 text-left transition-colors",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border/60 bg-muted/15 hover:border-border hover:bg-muted/25"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug">{scenario.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {scenario.description}
          </p>
        </div>
        {isTopRoi && (
          <Badge
            variant="outline"
            className="shrink-0 border-emerald-500/25 bg-emerald-500/10 font-mono text-[9px] uppercase tracking-wider text-emerald-400"
          >
            <TrendingUp className="mr-1 size-3" />
            {roiHint}
          </Badge>
        )}
      </div>
      <div className="mt-3 flex gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>
          {impactLabel} {scenario.impact}/5
        </span>
        <span>
          {effortLabel} {scenario.effort}/5
        </span>
      </div>
    </button>
  )
}

function ProjectionRow({
  label,
  before,
  after,
  currentLabel,
  projectedLabel,
  suffix = "",
}: {
  label: string
  before: number
  after: number
  currentLabel: string
  projectedLabel: string
  suffix?: string
}) {
  const delta = after - before

  return (
    <div className="rounded-lg border border-border/40 bg-background/50 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <MetricBlock label={currentLabel} value={before} suffix={suffix} />
        <ArrowRight className="mb-1 size-4 text-muted-foreground/50" />
        <MetricBlock
          label={projectedLabel}
          value={after}
          suffix={suffix}
          highlight
        />
        {delta > 0 && (
          <span className="mb-0.5 font-mono text-xs text-emerald-400">
            +{delta}
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function BenchmarkRow({
  label,
  before,
  after,
  currentLabel,
  projectedLabel,
}: {
  label: string
  before: { label: string }
  after: { label: string }
  currentLabel: string
  projectedLabel: string
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/50 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
            {currentLabel}
          </p>
          <p className="font-mono text-xl font-semibold tabular-nums">
            {before.label}
          </p>
        </div>
        <ArrowRight className="mb-1 size-4 text-muted-foreground/50" />
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
            {projectedLabel}
          </p>
          <p className="font-mono text-xl font-semibold tabular-nums text-emerald-400">
            {after.label}
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricBlock({
  label,
  value,
  suffix,
  highlight,
}: {
  label: string
  value: number
  suffix?: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-xl font-semibold tabular-nums",
          highlight && "text-emerald-400"
        )}
      >
        {value}
        {suffix}
      </p>
    </div>
  )
}

function ConfidenceBadge({
  level,
  labels,
}: {
  level: "high" | "medium" | "low"
  labels: Record<"high" | "medium" | "low", string>
}) {
  const styles = {
    high: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    medium: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    low: "border-muted-foreground/25 bg-muted text-muted-foreground",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[10px] uppercase tracking-wider",
        styles[level]
      )}
    >
      {labels[level]}
    </Badge>
  )
}

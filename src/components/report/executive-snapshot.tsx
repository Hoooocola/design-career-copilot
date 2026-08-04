"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { ReportMetaLabel } from "@/components/report/report-primitives"
import {
  buildReportScoreMetrics,
  computeTopPercentile,
  getReadinessBand,
} from "@/lib/report/metrics"
import type { PortfolioBenchmark, PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ExecutiveSnapshotProps {
  report: PortfolioReport
  portfolioFileName?: string
  persona: ReviewerPersona
  benchmark: PortfolioBenchmark
}

function getPrimaryRecommendation(report: PortfolioReport) {
  const sorted = [...report.actionPlan].sort((a, b) => a.priority - b.priority)
  if (sorted[0]) return sorted[0]
  if (report.opportunityRanking[0]) {
    const opp = report.opportunityRanking[0]
    return {
      priority: 1,
      title: opp.title,
      description: opp.expectedOutcome,
      timeframe: "",
    }
  }
  return null
}

export function ExecutiveSnapshot({ report, benchmark }: ExecutiveSnapshotProps) {
  const { messages } = useLocale()
  const snap = messages.report.snapshot
  const scoreLabels = messages.report.score
  const metrics = buildReportScoreMetrics(report)
  const band = getReadinessBand(metrics.score)
  const topPercentile = computeTopPercentile(benchmark)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const strengths = report.framework.competencyOverview.topStrengths
  const risks = report.framework.competencyOverview.criticalGaps
  const topStrength = strengths[0]
  const topRisk = risks[0]
  const primaryRec = getPrimaryRecommendation(report)
  const aiJudgment =
    report.framework.competencyOverview.reviewerVerdict ?? report.executiveSummary

  return (
    <div className="space-y-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20 xl:gap-24">
        <div className="space-y-8">
          <div>
            <p className="workspace-label">{snap.careerReadiness}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-6xl font-semibold tabular-nums tracking-tight text-[var(--workspace-text-primary)]">
                {metrics.score}
              </span>
              <span className="text-xl text-[var(--workspace-text-muted)]">
                {scoreLabels.outOf}
              </span>
            </div>
            <p className="mt-2 text-lg font-medium text-[var(--workspace-accent)]">
              {scoreLabels.bands[band]}
            </p>
          </div>

          <div>
            <p className="workspace-label">{snap.benchmark}</p>
            <p className="mt-2 text-base font-medium text-[var(--workspace-text-primary)]">
              {scoreLabels.benchmark.replace("{percent}", String(topPercentile))}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
              {benchmark.cohortLabel}
            </p>
          </div>
        </div>

        <div className="space-y-9">
          <div>
            <p className="workspace-label">{snap.aiJudgment}</p>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--workspace-text-primary)]">
              {aiJudgment}
            </p>
          </div>

          <div className="space-y-7">
            <JudgmentRow label={snap.strongestSignal} value={topStrength} />
            <JudgmentRow label={snap.criticalRisk} value={topRisk} />
            {primaryRec && (
              <JudgmentRow
                label={snap.primaryRecommendation}
                value={primaryRec.title}
                detail={primaryRec.description}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="group flex items-center gap-2 text-sm text-[var(--workspace-text-muted)] transition-colors duration-200 hover:text-[var(--workspace-text-secondary)]"
          aria-expanded={detailsOpen}
        >
          {detailsOpen ? snap.hideSupportingDetails : snap.showSupportingDetails}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              detailsOpen && "rotate-180"
            )}
          />
        </button>

        {detailsOpen && (
          <div className="mt-6 space-y-6 border-t border-[color-mix(in_oklch,var(--workspace-border)_60%,transparent)] pt-6">
            <dl className="grid gap-6 sm:grid-cols-3">
              <DetailMetric
                label={scoreLabels.confidence}
                value={scoreLabels.confidenceLevels[metrics.confidence]}
              />
              <DetailMetric
                label={scoreLabels.evidenceCoverage}
                value={`${metrics.evidenceCoverage}%`}
              />
              <DetailMetric
                label={scoreLabels.readinessBand}
                value={`${metrics.readiness} / 100`}
              />
            </dl>

            {(strengths.length > 1 || risks.length > 1) && (
              <div className="grid gap-6 sm:grid-cols-2">
                {strengths.length > 1 && (
                  <DetailList title={snap.topStrengths} items={strengths.slice(1)} />
                )}
                {risks.length > 1 && (
                  <DetailList title={snap.criticalRisks} items={risks.slice(1)} />
                )}
              </div>
            )}

            <p className="max-w-3xl text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
              {report.executiveSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function JudgmentRow({
  label,
  value,
  detail,
}: {
  label: string
  value?: string
  detail?: string
}) {
  return (
    <div>
      <p className="workspace-label">{label}</p>
      <p className="mt-2 text-base leading-relaxed text-[var(--workspace-text-primary)]">
        {value ?? "—"}
      </p>
      {detail && (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {detail}
        </p>
      )}
    </div>
  )
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <ReportMetaLabel>{label}</ReportMetaLabel>
      <p className="mt-1 text-sm font-medium tabular-nums text-[var(--workspace-text-primary)]">
        {value}
      </p>
    </div>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <ReportMetaLabel>{title}</ReportMetaLabel>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

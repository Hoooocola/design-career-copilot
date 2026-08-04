"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
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
      <div className="max-w-3xl space-y-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-decision tabular-nums">{metrics.score}</span>
          <span className="text-2xl text-[var(--workspace-text-muted)]">/</span>
          <span className="text-xl font-medium text-[var(--workspace-text-primary)] sm:text-2xl">
            {scoreLabels.bands[band]}
          </span>
        </div>

        <p className="text-reasoning max-w-2xl text-[var(--workspace-text-secondary)]">
          {aiJudgment}
        </p>

        <div className="space-y-5">
          {topStrength && (
            <VerdictItem label={snap.strongestSignal} value={topStrength} />
          )}
          {topRisk && (
            <VerdictItem
              label={snap.hiringRisk}
              value={topRisk}
              tone="risk"
            />
          )}
          {primaryRec && (
            <VerdictItem
              label={snap.nextBestAction}
              value={primaryRec.title}
              detail={primaryRec.description}
            />
          )}
        </div>

        <div className="space-y-1 border-t border-[color-mix(in_oklch,var(--workspace-border)_50%,transparent)] pt-6">
          <p className="text-metadata">
            {snap.evidenceConfidence}{" "}
            <span className="text-[var(--workspace-text-secondary)]">
              {scoreLabels.confidenceLevels[metrics.confidence]}
            </span>
          </p>
          <p className="text-metadata">
            {snap.evidenceConfidenceHint.replace(
              "{coverage}",
              String(metrics.evidenceCoverage)
            )}
          </p>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="flex items-center gap-2 text-metadata transition-colors duration-200 hover:text-[var(--workspace-text-secondary)]"
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
          <div className="mt-5 space-y-5 border-t border-[color-mix(in_oklch,var(--workspace-border)_50%,transparent)] pt-5">
            <p className="text-metadata">
              {scoreLabels.benchmark.replace("{percent}", String(topPercentile))}
              {" · "}
              {benchmark.cohortLabel}
            </p>

            <dl className="grid gap-4 sm:grid-cols-3">
              <SupportingMetric
                label={scoreLabels.readinessBand}
                value={`${metrics.readiness} / 100`}
              />
              <SupportingMetric
                label={scoreLabels.evidenceCoverage}
                value={`${metrics.evidenceCoverage}%`}
              />
              <SupportingMetric
                label={scoreLabels.confidence}
                value={scoreLabels.confidenceLevels[metrics.confidence]}
              />
            </dl>

            {(strengths.length > 1 || risks.length > 1) && (
              <div className="grid gap-5 sm:grid-cols-2">
                {strengths.length > 1 && (
                  <SupportingList title={snap.topStrengths} items={strengths.slice(1)} />
                )}
                {risks.length > 1 && (
                  <SupportingList title={snap.criticalRisks} items={risks.slice(1)} />
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

function VerdictItem({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail?: string
  tone?: "risk"
}) {
  return (
    <div>
      <p className="text-metadata">{label}</p>
      <p
        className={cn(
          "mt-1 text-reasoning",
          tone === "risk"
            ? "text-[var(--workspace-text-primary)]"
            : "text-[var(--workspace-text-primary)]"
        )}
      >
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {detail}
        </p>
      )}
    </div>
  )
}

function SupportingMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-metadata">{label}</p>
      <p className="mt-1 text-sm tabular-nums text-[var(--workspace-text-primary)]">
        {value}
      </p>
    </div>
  )
}

function SupportingList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-metadata">{title}</p>
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

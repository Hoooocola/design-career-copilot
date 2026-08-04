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
  const careerVerdict =
    report.framework.competencyOverview.reviewerVerdict ?? report.executiveSummary

  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16 xl:gap-24">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-decision tabular-nums">{metrics.score}</span>
              <span className="text-verdict-band text-[var(--workspace-text-muted)]">
                {scoreLabels.outOf}
              </span>
            </div>
            <p className="text-verdict-band font-medium text-[var(--workspace-text-primary)]">
              {scoreLabels.bands[band]}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-metadata">
              {scoreLabels.readinessBand}{" "}
              <span className="tabular-nums text-[var(--workspace-text-secondary)]">
                {metrics.readiness}/100
              </span>
            </p>
          </div>

          <div className="space-y-2 border-t border-[color-mix(in_oklch,var(--workspace-border)_45%,transparent)] pt-6">
            <p className="text-metadata">
              {snap.evidenceConfidence}{" "}
              <span className="font-medium text-[var(--workspace-text-secondary)]">
                {scoreLabels.confidenceLevels[metrics.confidence]}
              </span>
            </p>
            <p className="text-metadata leading-relaxed">
              {snap.portfolioSignalsAnalyzed.replace(
                "{coverage}",
                String(metrics.evidenceCoverage)
              )}
            </p>
          </div>
        </div>

        <div className="space-y-8 lg:pt-1">
          <div className="space-y-4">
            <p className="text-metadata">{snap.careerVerdict}</p>
            <p className="text-verdict-judgment max-w-2xl leading-relaxed text-[var(--workspace-text-primary)]">
              {careerVerdict}
            </p>
          </div>

          <div className="space-y-6">
            {topStrength && (
              <VerdictItem label={snap.strongestSignal} value={topStrength} />
            )}
            {topRisk && <VerdictItem label={snap.hiringRisk} value={topRisk} />}
            {primaryRec && (
              <VerdictItem
                label={snap.nextBestAction}
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
          <div className="mt-5 space-y-5 border-t border-[color-mix(in_oklch,var(--workspace-border)_45%,transparent)] pt-5">
            <p className="text-metadata">
              {scoreLabels.benchmark.replace("{percent}", String(topPercentile))}
              {" · "}
              {benchmark.cohortLabel}
            </p>

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
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div>
      <p className="text-metadata">{label}</p>
      <p className="mt-1.5 text-[1.0625rem] leading-relaxed text-[var(--workspace-text-primary)]">
        {value}
      </p>
      {detail && (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {detail}
        </p>
      )}
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

"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { ReportCard, ReportMetaLabel } from "@/components/report/report-primitives"
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

export function ExecutiveSnapshot({
  report,
  portfolioFileName,
  benchmark,
}: ExecutiveSnapshotProps) {
  const { messages } = useLocale()
  const snap = messages.report.snapshot
  const scoreLabels = messages.report.score
  const cp = messages.report.competitivePosition
  const metrics = buildReportScoreMetrics(report)
  const band = getReadinessBand(metrics.score)
  const topPercentile = computeTopPercentile(benchmark)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const roleLabel =
    report.meta?.targetRole &&
    report.meta.targetRole in messages.report.roles
      ? messages.report.roles[
          report.meta.targetRole as keyof typeof messages.report.roles
        ]
      : report.meta?.targetRole?.replace(/_/g, " ")

  const strengths = report.framework.competencyOverview.topStrengths
  const risks = report.framework.competencyOverview.criticalGaps
  const topStrength = strengths[0]
  const topRisk = risks[0]
  const primaryRec = getPrimaryRecommendation(report)
  const verdict = report.framework.competencyOverview.reviewerVerdict

  return (
    <div className="space-y-4">
      <ReportCard className="overflow-hidden p-0">
        {(portfolioFileName || roleLabel) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--report-border)] bg-[var(--report-paper)] px-6 py-3 sm:px-8">
            {portfolioFileName && (
              <ProfileField label={snap.candidateProfile} value={portfolioFileName} />
            )}
            {roleLabel && <ProfileField label={snap.targetRole} value={roleLabel} />}
          </div>
        )}

        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[var(--report-border)]">
          <ReadinessPanel
            score={metrics.score}
            readiness={metrics.readiness}
            bandLabel={scoreLabels.bands[band]}
            outOfLabel={scoreLabels.outOf}
            roleReadinessLabel={snap.roleReadiness}
            readinessScoreLabel={scoreLabels.readinessBand}
          />
          <CompetitivePanel
            label={snap.competitivePosition}
            standingLabel={cp.overallStanding}
            standingValue={scoreLabels.benchmark.replace("{percent}", String(topPercentile))}
            cohortLabel={cp.comparisonGroup}
            cohortValue={benchmark.cohortLabel}
          />
        </div>

        <div className="grid gap-px bg-[var(--report-border)] sm:grid-cols-2">
          <SignalCard
            label={snap.strongestSignal}
            value={topStrength}
            variant="positive"
            moreCount={strengths.length > 1 ? strengths.length - 1 : 0}
            moreLabel={snap.additionalItems}
          />
          <SignalCard
            label={snap.biggestHiringRisk}
            value={topRisk}
            variant="negative"
            moreCount={risks.length > 1 ? risks.length - 1 : 0}
            moreLabel={snap.additionalItems}
          />
        </div>

        {primaryRec && (
          <div className="border-t border-[var(--report-border)] bg-[var(--report-accent-muted)] px-6 py-5 sm:px-8">
            <p className="report-caption text-[var(--report-accent)]">
              {snap.primaryRecommendation}
            </p>
            <p className="mt-1.5 text-base font-semibold text-[var(--report-text)]">
              {primaryRec.title}
            </p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--report-text-muted)]">
              {primaryRec.description}
            </p>
          </div>
        )}
      </ReportCard>

      <div className="overflow-hidden rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)]">
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-[var(--report-card)]"
          aria-expanded={detailsOpen}
        >
          <span className="text-sm text-[var(--report-text-subtle)]">
            {snap.supportingDetails}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--report-text-subtle)]">
            {detailsOpen ? snap.hideSupportingDetails : snap.showSupportingDetails}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                detailsOpen && "rotate-180"
              )}
            />
          </span>
        </button>

        {detailsOpen && (
          <div className="space-y-4 border-t border-[var(--report-border)] px-5 py-4 sm:px-6">
            <dl className="grid gap-3 sm:grid-cols-3">
              <SecondaryMetric
                label={scoreLabels.confidence}
                value={scoreLabels.confidenceLevels[metrics.confidence]}
              />
              <SecondaryMetric
                label={scoreLabels.evidenceCoverage}
                value={`${metrics.evidenceCoverage}%`}
              />
              <SecondaryMetric
                label={scoreLabels.readinessBand}
                value={`${metrics.readiness} / 100`}
              />
            </dl>

            {verdict && (
              <div className="border-t border-[var(--report-border)] pt-4">
                <ReportMetaLabel>{snap.reviewerVerdict}</ReportMetaLabel>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--report-text-muted)]">
                  {verdict}
                </p>
              </div>
            )}

            {(strengths.length > 1 || risks.length > 1) && (
              <div className="grid gap-4 border-t border-[var(--report-border)] pt-4 sm:grid-cols-2">
                {strengths.length > 1 && (
                  <CompactList
                    title={snap.topStrengths}
                    items={strengths.slice(1)}
                    variant="positive"
                  />
                )}
                {risks.length > 1 && (
                  <CompactList
                    title={snap.criticalRisks}
                    items={risks.slice(1)}
                    variant="negative"
                  />
                )}
              </div>
            )}

            <p className="text-sm leading-relaxed text-[var(--report-text-muted)]">
              {report.executiveSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="report-caption">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--report-text)]">{value}</p>
    </div>
  )
}

function ReadinessPanel({
  score,
  readiness,
  bandLabel,
  outOfLabel,
  roleReadinessLabel,
  readinessScoreLabel,
}: {
  score: number
  readiness: number
  bandLabel: string
  outOfLabel: string
  roleReadinessLabel: string
  readinessScoreLabel: string
}) {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-7">
      <p className="report-caption">{roleReadinessLabel}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-[var(--report-text)]">
          {score}
        </span>
        <span className="text-lg text-[var(--report-text-subtle)]">{outOfLabel}</span>
      </div>
      <p className="mt-2 text-base font-semibold text-[var(--report-accent)]">{bandLabel}</p>
      <p className="mt-3 text-sm text-[var(--report-text-muted)]">
        {readinessScoreLabel}:{" "}
        <span className="font-medium tabular-nums text-[var(--report-text)]">
          {readiness}/100
        </span>
      </p>
    </div>
  )
}

function CompetitivePanel({
  label,
  standingLabel,
  standingValue,
  cohortLabel,
  cohortValue,
}: {
  label: string
  standingLabel: string
  standingValue: string
  cohortLabel: string
  cohortValue: string
}) {
  return (
    <div className="border-t border-[var(--report-border)] px-6 py-6 sm:border-t-0 sm:px-8 sm:py-7">
      <p className="report-caption">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--report-accent)]">
        {standingValue}
      </p>
      <p className="mt-1 text-xs text-[var(--report-text-subtle)]">{standingLabel}</p>
      <div className="mt-4 border-t border-[var(--report-border)] pt-3">
        <p className="report-caption">{cohortLabel}</p>
        <p className="mt-1 text-sm font-medium text-[var(--report-text)]">{cohortValue}</p>
      </div>
    </div>
  )
}

function SignalCard({
  label,
  value,
  variant,
  moreCount,
  moreLabel,
}: {
  label: string
  value?: string
  variant: "positive" | "negative"
  moreCount: number
  moreLabel: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center bg-[var(--report-card)] px-6 py-5 sm:px-7",
        variant === "positive" && "border-l-[3px] border-l-[var(--report-positive)]",
        variant === "negative" && "border-l-[3px] border-l-[var(--report-negative)]"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          variant === "positive"
            ? "text-[var(--report-positive)]"
            : "text-[var(--report-negative)]"
        )}
      >
        {label}
      </p>
      <p className="mt-2 text-[0.9375rem] font-medium leading-snug text-[var(--report-text)]">
        {value ?? "—"}
      </p>
      {moreCount > 0 && (
        <p className="mt-2 text-xs text-[var(--report-text-subtle)]">
          {moreLabel.replace("{count}", String(moreCount))}
        </p>
      )}
    </div>
  )
}

function SecondaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--report-border)] bg-[var(--report-card)] px-3 py-2.5">
      <dt className="text-xs text-[var(--report-text-subtle)]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium tabular-nums text-[var(--report-text-muted)]">
        {value}
      </dd>
    </div>
  )
}

function CompactList({
  title,
  items,
  variant,
}: {
  title: string
  items: string[]
  variant: "positive" | "negative"
}) {
  return (
    <div>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          variant === "positive"
            ? "text-[var(--report-positive)]"
            : "text-[var(--report-negative)]"
        )}
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-[var(--report-text-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

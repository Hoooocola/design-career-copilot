"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { useLocale } from "@/components/providers/locale-provider"
import { ReportCard, ReportMetaLabel } from "@/components/report/report-primitives"
import {
  buildReportScoreMetrics,
  getReadinessBand,
} from "@/lib/report/metrics"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ExecutiveSnapshotProps {
  report: PortfolioReport
  portfolioFileName?: string
  persona: ReviewerPersona
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
}: ExecutiveSnapshotProps) {
  const { messages } = useLocale()
  const snap = messages.report.snapshot
  const scoreLabels = messages.report.score
  const metrics = buildReportScoreMetrics(report)
  const band = getReadinessBand(metrics.score)
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
      {/* ── Above the fold ── */}
      <ReportCard className="overflow-hidden p-0">
        {/* Profile strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--report-border)] bg-[var(--report-paper)] px-6 py-4 sm:px-8">
          {portfolioFileName && (
            <ProfileField label={snap.candidateProfile} value={portfolioFileName} />
          )}
          {roleLabel && <ProfileField label={snap.targetRole} value={roleLabel} />}
        </div>

        {/* Hero grid: Score | Strength + Risk */}
        <div className="grid lg:grid-cols-[minmax(200px,240px)_1fr]">
          <ScoreHero
            score={metrics.score}
            bandLabel={scoreLabels.bands[band]}
            outOfLabel={scoreLabels.outOf}
            matchScoreLabel={snap.matchScore}
            readinessLabel={scoreLabels.readinessBand}
          />

          <div className="grid gap-px bg-[var(--report-border)] sm:grid-cols-2">
            <SignalCard
              label={snap.topStrength}
              value={topStrength}
              variant="positive"
              moreCount={strengths.length > 1 ? strengths.length - 1 : 0}
              moreLabel={snap.additionalItems}
            />
            <SignalCard
              label={snap.criticalRisk}
              value={topRisk}
              variant="negative"
              moreCount={risks.length > 1 ? risks.length - 1 : 0}
              moreLabel={snap.additionalItems}
            />
          </div>
        </div>

        {/* Primary recommendation */}
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

      {/* ── Supporting details (de-emphasized) ── */}
      <div className="rounded-xl border border-[var(--report-border)] bg-[var(--report-paper)]">
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

            <p className="text-xs leading-relaxed text-[var(--report-text-subtle)]">
              {scoreLabels.benchmark.replace("{percent}", String(metrics.topPercentile))}
              {" · "}
              {messages.report.matchScoreBasis}
            </p>

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

function ScoreHero({
  score,
  bandLabel,
  outOfLabel,
  matchScoreLabel,
  readinessLabel,
}: {
  score: number
  bandLabel: string
  outOfLabel: string
  matchScoreLabel: string
  readinessLabel: string
}) {
  return (
    <div className="flex flex-col justify-center border-b border-[var(--report-border)] px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r">
      <p className="report-caption">{matchScoreLabel}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-6xl font-semibold tabular-nums tracking-tight text-[var(--report-text)]">
          {score}
        </span>
        <span className="text-xl text-[var(--report-text-subtle)]">{outOfLabel}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-[var(--report-accent)]">{bandLabel}</p>
      <p className="mt-1 text-xs text-[var(--report-text-subtle)]">{readinessLabel}</p>
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
        "flex flex-col justify-center bg-[var(--report-card)] px-6 py-6 sm:px-7",
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

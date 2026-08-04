"use client"

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

export function ExecutiveSnapshot({
  report,
  portfolioFileName,
  persona,
}: ExecutiveSnapshotProps) {
  const { messages } = useLocale()
  const snap = messages.report.snapshot
  const scoreLabels = messages.report.score
  const metrics = buildReportScoreMetrics(report)
  const band = getReadinessBand(metrics.score)

  const roleLabel =
    report.meta?.targetRole &&
    report.meta.targetRole in messages.report.roles
      ? messages.report.roles[
          report.meta.targetRole as keyof typeof messages.report.roles
        ]
      : report.meta?.targetRole?.replace(/_/g, " ")

  const seniorityLabel = report.meta?.seniority
    ? snap.seniority[report.meta.seniority as keyof typeof snap.seniority] ??
      report.meta.seniority
    : undefined

  return (
    <div className="space-y-6">
      <ReportCard className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <ProfileChip label={snap.reviewerLens}>
                {messages.report.reviewerPersonas[persona]}
              </ProfileChip>
              {roleLabel && (
                <ProfileChip label={snap.targetRole}>{roleLabel}</ProfileChip>
              )}
              {seniorityLabel && (
                <ProfileChip label={snap.seniorityLabel}>{seniorityLabel}</ProfileChip>
              )}
              {portfolioFileName && (
                <ProfileChip label={snap.candidateProfile}>
                  {portfolioFileName}
                </ProfileChip>
              )}
            </div>

            <div>
              <ReportMetaLabel>{snap.overallAssessment}</ReportMetaLabel>
              <p className="report-body mt-3 text-base leading-relaxed text-[var(--report-text)]">
                {report.executiveSummary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StrengthList
                title={snap.topStrengths}
                items={report.framework.competencyOverview.topStrengths}
                variant="positive"
              />
              <StrengthList
                title={snap.criticalRisks}
                items={report.framework.competencyOverview.criticalGaps}
                variant="negative"
              />
            </div>
          </div>

          <ScorePanel
            metrics={metrics}
            bandLabel={scoreLabels.bands[band]}
            matchBasis={messages.report.matchScoreBasis}
            labels={scoreLabels}
          />
        </div>
      </ReportCard>

      <ReportCard accent>
        <ReportMetaLabel>{snap.reviewerVerdict}</ReportMetaLabel>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--report-text-muted)]">
          {report.framework.competencyOverview.reviewerVerdict}
        </p>
      </ReportCard>
    </div>
  )
}

function ProfileChip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--report-border)] bg-[var(--report-paper)] px-3 py-2">
      <p className="report-caption">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--report-text)]">{children}</p>
    </div>
  )
}

function StrengthList({
  title,
  items,
  variant,
}: {
  title: string
  items: string[]
  variant: "positive" | "negative"
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3",
        variant === "positive"
          ? "border-[var(--report-positive)]/20 bg-[var(--report-positive-bg)]"
          : "border-[var(--report-negative)]/20 bg-[var(--report-negative-bg)]"
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
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--report-text-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScorePanel({
  metrics,
  bandLabel,
  matchBasis,
  labels,
}: {
  metrics: ReturnType<typeof buildReportScoreMetrics>
  bandLabel: string
  matchBasis: string
  labels: {
    outOf: string
    readinessBand: string
    benchmark: string
    confidence: string
    evidenceCoverage: string
    confidenceLevels: { high: string; medium: string; low: string }
  }
}) {
  return (
    <div className="flex flex-col justify-between border-t border-[var(--report-border)] bg-[var(--report-paper)] p-6 lg:border-t-0 lg:border-l">
      <div className="text-center lg:text-left">
        <p className="report-caption">{labels.readinessBand}</p>
        <div className="mt-3 flex items-baseline justify-center gap-1 lg:justify-start">
          <span className="text-5xl font-semibold tabular-nums tracking-tight text-[var(--report-text)]">
            {metrics.score}
          </span>
          <span className="text-lg text-[var(--report-text-subtle)]">{labels.outOf}</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-[var(--report-accent)]">{bandLabel}</p>
        <p className="mt-1 text-sm text-[var(--report-text-muted)]">
          {labels.benchmark.replace("{percent}", String(metrics.topPercentile))}
        </p>
      </div>

      <dl className="mt-6 space-y-3 border-t border-[var(--report-border)] pt-5">
        <MetricRow
          label={labels.confidence}
          value={labels.confidenceLevels[metrics.confidence]}
        />
        <MetricRow
          label={labels.evidenceCoverage}
          value={`${metrics.evidenceCoverage}%`}
        />
        <MetricRow label={labels.readinessBand} value={`${metrics.readiness} / 100`} />
      </dl>

      <p className="mt-5 text-xs leading-relaxed text-[var(--report-text-subtle)]">
        {matchBasis}
      </p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="text-[var(--report-text-muted)]">{label}</dt>
      <dd className="font-medium tabular-nums text-[var(--report-text)]">{value}</dd>
    </div>
  )
}

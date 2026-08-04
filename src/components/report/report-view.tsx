"use client"

import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { ActionPlan } from "@/components/report/action-plan"
import { BenchmarkAnalysis } from "@/components/report/benchmark-analysis"
import { CompetitivePosition } from "@/components/report/competitive-position"
import { CategoryBreakdown } from "@/components/report/category-breakdown"
import { CompetencyHeatmap } from "@/components/report/competency-heatmap"
import { CompetencyOverviewPanel } from "@/components/report/competency-overview"
import { ConsensusConflictPanel } from "@/components/report/consensus-conflict"
import { EvidenceInsights } from "@/components/report/evidence-insights"
import { ExecutiveSnapshot } from "@/components/report/executive-snapshot"
import { GapAnalysis } from "@/components/report/gap-analysis"
import { ImprovementRoadmap } from "@/components/report/improvement-roadmap"
import { ImprovementSimulator } from "@/components/report/improvement-simulator"
import { FeedbackEntry } from "@/components/feedback/feedback-entry"
import { ReportEngagementTracker } from "@/components/report/report-engagement-tracker"
import { OpportunityRanking } from "@/components/report/opportunity-ranking"
import { ReviewTracePanel } from "@/components/report/review-trace"
import { PersonaSelector } from "@/components/report/persona-selector"
import { ReportChapter, ReportDivider } from "@/components/report/report-primitives"
import { ReportDocumentHeader } from "@/components/report/report-document-header"
import { ReportStickyNav } from "@/components/report/report-sticky-nav"
import { SkillCoverage } from "@/components/report/skill-coverage"
import { SkillRadarChart } from "@/components/report/skill-radar-chart"
import { StrengthsWeaknesses } from "@/components/report/strengths-weaknesses"
import { useLocale } from "@/components/providers/locale-provider"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ReportViewProps {
  report: PortfolioReport
  portfolioFileName?: string
  assessmentDate: Date
  persona: ReviewerPersona
  onPersonaChange: (persona: ReviewerPersona) => void
  isRefreshing?: boolean
}

export function ReportView({
  report,
  portfolioFileName,
  assessmentDate,
  persona,
  onPersonaChange,
  isRefreshing,
}: ReportViewProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework
  const chapters = messages.report.chapters

  const roleLabel =
    report.meta?.targetRole &&
    report.meta.targetRole in messages.report.roles
      ? messages.report.roles[
          report.meta.targetRole as keyof typeof messages.report.roles
        ]
      : report.meta?.targetRole?.replace(/_/g, " ")

  return (
    <div className="report-canvas min-h-screen">
      <ReportEngagementTracker
        resetKey={`${persona}-${report.matchScore}-${report.meta?.source ?? "unknown"}`}
      />
      <ReportStickyNav />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--report-text-muted)] transition-colors hover:text-[var(--report-text)]"
        >
          <ArrowLeft className="size-3.5" />
          {messages.report.newAnalysis}
        </Link>

        <div className="report-paper overflow-hidden rounded-2xl border border-[var(--report-border-strong)] shadow-[0_1px_3px_rgba(23,26,32,0.06)]">
          <ReportDocumentHeader assessmentDate={assessmentDate} />

          <header className="border-b border-[var(--report-border)] px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="report-caption mb-2">{messages.report.documentTitle}</p>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--report-text)] sm:text-2xl">
                  {messages.report.title}
                </h2>
                {portfolioFileName && (
                  <p className="mt-2 text-base text-[var(--report-text-muted)]">
                    {portfolioFileName}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {report.meta?.source === "mock" && (
                  <StatusBadge label={messages.report.demoMode} variant="caution" />
                )}
                <StatusBadge label={messages.report.reviewerPersonas[persona]} />
                {roleLabel && <StatusBadge label={roleLabel} />}
                {report.meta?.source !== "mock" && (
                  <StatusBadge label={messages.report.aiGenerated} variant="accent" />
                )}
              </div>
            </div>
          </header>

          <div className="border-b border-[var(--report-border)] px-6 py-6 sm:px-10">
            <p className="report-caption">{fw.switchReviewer}</p>
            <p className="mt-1 text-sm text-[var(--report-text-muted)]">
              {messages.report.switchReviewerHint}
            </p>
            <div className="mt-4">
              <PersonaSelector
                value={persona}
                onChange={onPersonaChange}
                disabled={isRefreshing}
                compact
              />
            </div>
            {isRefreshing && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[var(--report-text-muted)]">
                <Loader2 className="size-3.5 animate-spin" />
                {fw.regeneratingPersona}
              </div>
            )}
          </div>

          <div className="space-y-16 px-6 py-10 sm:px-10 sm:py-12">
            <div id="overview">
              <ReportChapter
                id="overview-inner"
                number={1}
                title={chapters.snapshot.title}
                subtitle={chapters.snapshot.subtitle}
              >
                <ExecutiveSnapshot
                  report={report}
                  portfolioFileName={portfolioFileName}
                  persona={persona}
                />
                <CompetitivePosition data={report.benchmark} />
                <StrengthsWeaknesses
                  strengths={report.strengths}
                  weaknesses={report.weaknesses}
                />
              </ReportChapter>
            </div>

            <ReportDivider />

            <div id="capability">
              <ReportChapter
                id="capability-inner"
                number={2}
                title={chapters.capability.title}
                subtitle={chapters.capability.subtitle}
              >
                <CompetencyOverviewPanel data={report.framework.competencyOverview} />
                <div className="grid gap-8 lg:grid-cols-2">
                  <SkillRadarChart categories={report.framework.categoryBreakdown} />
                  <CategoryBreakdown
                    categories={report.framework.categoryBreakdown}
                    dimensionScores={report.framework.dimensionScores}
                  />
                </div>
                <CompetencyHeatmap
                  dimensionScores={report.framework.dimensionScores}
                  evidenceInsights={report.framework.evidenceInsights}
                />
                <SkillCoverage skills={report.skillCoverage} />
              </ReportChapter>
            </div>

            <ReportDivider />

            <div id="evidence">
              <ReportChapter
                id="evidence-inner"
                number={3}
                title={chapters.evidence.title}
                subtitle={chapters.evidence.subtitle}
              >
                <EvidenceInsights insights={report.framework.evidenceInsights} />
                <ReviewTracePanel traces={report.reviewTrace} />
                <div id="gaps">
                  <GapAnalysis gaps={report.gapAnalysis} />
                </div>
                <ConsensusConflictPanel data={report.consensusConflict} />
              </ReportChapter>
            </div>

            <ReportDivider />

            <div id="action-plan">
              <ReportChapter
                id="action-inner"
                number={4}
                title={chapters.action.title}
                subtitle={chapters.action.subtitle}
              >
                <OpportunityRanking opportunities={report.opportunityRanking} />
                <ImprovementSimulator report={report} persona={persona} />
                <ActionPlan items={report.actionPlan} />
                <ImprovementRoadmap data={report.improvementRoadmap} />
              </ReportChapter>
            </div>

            <ReportDivider />

            <div id="methodology">
              <BenchmarkAnalysis data={report.benchmark} />
            </div>

            <div className="border-t border-[var(--report-border)] pt-8">
              <FeedbackEntry />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({
  label,
  variant = "neutral",
}: {
  label: string
  variant?: "neutral" | "accent" | "caution"
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-xs font-medium",
        variant === "accent" &&
          "border-[var(--report-accent)]/25 bg-[var(--report-accent-muted)] text-[var(--report-accent)]",
        variant === "caution" &&
          "border-[var(--report-caution)]/25 bg-[var(--report-caution-bg)] text-[var(--report-caution)]",
        variant === "neutral" &&
          "border-[var(--report-border)] bg-[var(--report-card)] text-[var(--report-text-muted)]"
      )}
    >
      {label}
    </span>
  )
}

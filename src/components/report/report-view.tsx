"use client"

import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { ActionPlan } from "@/components/report/action-plan"
import { BenchmarkAnalysis } from "@/components/report/benchmark-analysis"
import { CategoryBreakdown } from "@/components/report/category-breakdown"
import { CompetencyHeatmap } from "@/components/report/competency-heatmap"
import { CompetencyOverviewPanel } from "@/components/report/competency-overview"
import { ConsensusConflictPanel } from "@/components/report/consensus-conflict"
import { EvidenceInsights } from "@/components/report/evidence-insights"
import { ExecutiveSummary } from "@/components/report/executive-summary"
import { GapAnalysis } from "@/components/report/gap-analysis"
import { ImprovementRoadmap } from "@/components/report/improvement-roadmap"
import { ImprovementSimulator } from "@/components/report/improvement-simulator"
import { FeedbackEntry } from "@/components/feedback/feedback-entry"
import { ReportEngagementTracker } from "@/components/report/report-engagement-tracker"
import { MatchScore } from "@/components/report/match-score"
import { OpportunityRanking } from "@/components/report/opportunity-ranking"
import { ReviewTracePanel } from "@/components/report/review-trace"
import { PersonaSelector } from "@/components/report/persona-selector"
import { SkillCoverage } from "@/components/report/skill-coverage"
import { SkillRadarChart } from "@/components/report/skill-radar-chart"
import { StrengthsWeaknesses } from "@/components/report/strengths-weaknesses"
import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

interface ReportViewProps {
  report: PortfolioReport
  portfolioFileName?: string
  persona: ReviewerPersona
  onPersonaChange: (persona: ReviewerPersona) => void
  isRefreshing?: boolean
}

export function ReportView({
  report,
  portfolioFileName,
  persona,
  onPersonaChange,
  isRefreshing,
}: ReportViewProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework

  const roleLabel =
    report.meta?.targetRole &&
    report.meta.targetRole in messages.report.roles
      ? messages.report.roles[
          report.meta.targetRole as keyof typeof messages.report.roles
        ]
      : report.meta?.targetRole?.replace(/_/g, " ")

  const personaLabel = messages.report.reviewerPersonas[persona]

  return (
    <PageContainer size="wide" className="py-10 sm:py-14">
      <ReportEngagementTracker
        resetKey={`${persona}-${report.matchScore}-${report.meta?.source ?? "unknown"}`}
      />
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            {messages.report.newAnalysis}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {messages.report.title}
          </h1>
          {portfolioFileName && (
            <p className="mt-1 text-sm text-muted-foreground">
              {portfolioFileName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {report.meta?.source === "mock" && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider text-amber-400"
            >
              {messages.report.demoMode}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="font-mono text-[10px] uppercase tracking-wider"
          >
            {personaLabel}
          </Badge>
          {roleLabel && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {roleLabel}
            </Badge>
          )}
          {report.meta?.source !== "mock" && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {messages.report.aiGenerated}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-10 rounded-xl border border-border/60 bg-card/50 p-4 sm:p-5">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {fw.switchReviewer}
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          {messages.report.switchReviewerHint}
        </p>
        <PersonaSelector
          value={persona}
          onChange={onPersonaChange}
          disabled={isRefreshing}
          compact
        />
        {isRefreshing && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            {fw.regeneratingPersona}
          </div>
        )}
      </div>

      <div className="space-y-10">
        <CompetencyOverviewPanel data={report.framework.competencyOverview} />
        <Separator className="bg-border/50" />

        <div className="grid gap-10 lg:grid-cols-2">
          <SkillRadarChart categories={report.framework.categoryBreakdown} />
          <CategoryBreakdown
            categories={report.framework.categoryBreakdown}
            dimensionScores={report.framework.dimensionScores}
          />
        </div>
        <Separator className="bg-border/50" />

        <CompetencyHeatmap
          dimensionScores={report.framework.dimensionScores}
          evidenceInsights={report.framework.evidenceInsights}
        />
        <Separator className="bg-border/50" />

        <BenchmarkAnalysis data={report.benchmark} />
        <Separator className="bg-border/50" />

        <ConsensusConflictPanel data={report.consensusConflict} />
        <Separator className="bg-border/50" />

        <EvidenceInsights insights={report.framework.evidenceInsights} />
        <Separator className="bg-border/50" />

        <ExecutiveSummary summary={report.executiveSummary} />
        <Separator className="bg-border/50" />
        <MatchScore score={report.matchScore} />
        <Separator className="bg-border/50" />
        <ReviewTracePanel traces={report.reviewTrace} />
        <Separator className="bg-border/50" />
        <SkillCoverage skills={report.skillCoverage} />
        <Separator className="bg-border/50" />
        <StrengthsWeaknesses
          strengths={report.strengths}
          weaknesses={report.weaknesses}
        />
        <Separator className="bg-border/50" />
        <OpportunityRanking opportunities={report.opportunityRanking} />
        <Separator className="bg-border/50" />
        <ImprovementSimulator report={report} persona={persona} />
        <Separator className="bg-border/50" />
        <GapAnalysis gaps={report.gapAnalysis} />
        <Separator className="bg-border/50" />
        <ActionPlan items={report.actionPlan} />
        <Separator className="bg-border/50" />
        <ImprovementRoadmap data={report.improvementRoadmap} />
        <Separator className="bg-border/50" />
        <FeedbackEntry />
      </div>
    </PageContainer>
  )
}

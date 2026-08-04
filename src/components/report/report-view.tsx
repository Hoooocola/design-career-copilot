"use client"

import { Loader2 } from "lucide-react"

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
import { ReportChapter, ReportDivider } from "@/components/report/report-primitives"
import { SkillCoverage } from "@/components/report/skill-coverage"
import { SkillRadarChart } from "@/components/report/skill-radar-chart"
import { StrengthsWeaknesses } from "@/components/report/strengths-weaknesses"
import { ReportWorkspace } from "@/components/report/workspace/report-workspace"
import { WorkspaceHeader } from "@/components/report/workspace/workspace-header"
import { WorkspaceNav } from "@/components/report/workspace/workspace-nav"
import { useLocale } from "@/components/providers/locale-provider"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

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
  const chapters = messages.report.chapters

  const roleLabel =
    report.meta?.targetRole &&
    report.meta.targetRole in messages.report.roles
      ? messages.report.roles[
          report.meta.targetRole as keyof typeof messages.report.roles
        ]
      : report.meta?.targetRole?.replace(/_/g, " ")

  return (
    <ReportWorkspace
      header={
        <WorkspaceHeader
          portfolioFileName={portfolioFileName}
          targetRoleLabel={roleLabel}
          assessmentDate={assessmentDate}
          persona={persona}
          onPersonaChange={onPersonaChange}
          isRefreshing={isRefreshing}
          isDemo={report.meta?.source === "mock"}
          isAiGenerated={report.meta?.source !== "mock"}
        />
      }
      nav={<WorkspaceNav />}
    >
      <ReportEngagementTracker
        resetKey={`${persona}-${report.matchScore}-${report.meta?.source ?? "unknown"}`}
      />

      <div className="space-y-16">
        <div id="career-position">
          <ReportChapter
            id="career-position-inner"
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

        <div id="capability-map">
          <ReportChapter
            id="capability-map-inner"
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

        <div id="evidence-quality">
          <ReportChapter
            id="evidence-quality-inner"
            number={3}
            title={chapters.evidence.title}
            subtitle={chapters.evidence.subtitle}
          >
            <EvidenceInsights insights={report.framework.evidenceInsights} />
            <ReviewTracePanel traces={report.reviewTrace} />
            <GapAnalysis gaps={report.gapAnalysis} />
            <ConsensusConflictPanel data={report.consensusConflict} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <ReportChapter
          id="action-inner"
          number={4}
          title={chapters.action.title}
          subtitle={chapters.action.subtitle}
        >
          <div id="priority-opportunities" className="space-y-8">
            <OpportunityRanking opportunities={report.opportunityRanking} />
            <ImprovementSimulator report={report} persona={persona} />
          </div>
          <div id="career-action-plan" className="space-y-8 pt-8">
            <ActionPlan items={report.actionPlan} />
            <ImprovementRoadmap data={report.improvementRoadmap} />
          </div>
        </ReportChapter>

        <ReportDivider />

        <div id="methodology">
          <BenchmarkAnalysis data={report.benchmark} />
        </div>

        <div className="border-t border-[var(--workspace-border)] pt-8">
          <FeedbackEntry />
        </div>
      </div>
    </ReportWorkspace>
  )
}

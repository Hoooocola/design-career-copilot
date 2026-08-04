"use client"

import { ActionPlan } from "@/components/report/action-plan"
import { BenchmarkAnalysis } from "@/components/report/benchmark-analysis"
import { CompetitivePosition } from "@/components/report/competitive-position"
import { CategoryBreakdown } from "@/components/report/category-breakdown"
import { CompetencyHeatmap } from "@/components/report/competency-heatmap"
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
  const ch = messages.report.chapters
  const ws = messages.report.workspace

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
            title={ch.careerPosition.title}
            subtitle={ch.careerPosition.subtitle}
          >
            <ExecutiveSnapshot
              report={report}
              portfolioFileName={portfolioFileName}
              persona={persona}
            />
            <CompetitivePosition data={report.benchmark} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <div id="capability-map">
          <ReportChapter
            id="capability-map-inner"
            number={2}
            title={ch.capabilityMap.title}
            subtitle={ch.capabilityMap.subtitle}
          >
            <CompetencyHeatmap
              dimensionScores={report.framework.dimensionScores}
              evidenceInsights={report.framework.evidenceInsights}
            />
            <div className="grid gap-8 lg:grid-cols-2">
              <SkillRadarChart categories={report.framework.categoryBreakdown} />
              <CategoryBreakdown
                categories={report.framework.categoryBreakdown}
                dimensionScores={report.framework.dimensionScores}
              />
            </div>
            <SkillCoverage skills={report.skillCoverage} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <div id="evidence-quality">
          <ReportChapter
            id="evidence-quality-inner"
            number={3}
            title={ch.evidenceQuality.title}
            subtitle={ch.evidenceQuality.subtitle}
          >
            <EvidenceInsights insights={report.framework.evidenceInsights} />
            <ReviewTracePanel traces={report.reviewTrace} />
            <ConsensusConflictPanel data={report.consensusConflict} />
            <GapAnalysis gaps={report.gapAnalysis} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <div id="priority-opportunities">
          <ReportChapter
            id="priority-opportunities-inner"
            number={4}
            title={ch.priorityOpportunities.title}
            subtitle={ch.priorityOpportunities.subtitle}
          >
            <OpportunityRanking opportunities={report.opportunityRanking} />
            <ImprovementSimulator report={report} persona={persona} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <div id="career-action-plan">
          <ReportChapter
            id="career-action-plan-inner"
            number={5}
            title={ch.careerActionPlan.title}
            subtitle={ch.careerActionPlan.subtitle}
          >
            <ActionPlan items={report.actionPlan} />
            <ImprovementRoadmap data={report.improvementRoadmap} />
          </ReportChapter>
        </div>

        <ReportDivider />

        <div id="methodology">
          <ReportChapter
            id="methodology-inner"
            appendix
            sectionLabel={ws.appendix}
            title={ch.methodology.title}
            subtitle={ch.methodology.subtitle}
          >
            <BenchmarkAnalysis data={report.benchmark} />
          </ReportChapter>
        </div>

        <div className="border-t border-[var(--workspace-border)] pt-8">
          <FeedbackEntry />
        </div>
      </div>
    </ReportWorkspace>
  )
}

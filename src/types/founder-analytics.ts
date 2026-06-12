import type { EngagementSectionId } from "@/types/engagement"
import type { ReviewerPersona } from "@/types/reviewer"

export type FunnelStepId =
  | "upload_pdf"
  | "submit_jd"
  | "start_analysis"
  | "view_report"
  | "open_roadmap"

export interface FunnelStepMetric {
  id: FunnelStepId
  count: number
  conversionRate: number
  dropOffRate: number
}

export type FounderSectionId = Exclude<
  EngagementSectionId,
  "opportunity_ranking"
>

export interface SectionEngagementMetric {
  id: FounderSectionId
  viewers: number
  avgDwellMs: number
  totalDwellMs: number
}

export interface ReviewerUsageMetric {
  persona: ReviewerPersona
  usageCount: number
  avgDwellMs: number
}

export interface FeedbackSummaryMetric {
  helpfulRate: number
  actionabilityRate: number
  totalResponses: number
  helpfulCount: number
  actionabilityCount: number
}

export interface FounderAnalyticsOverview {
  totalSessions: number
  activeUsers7d: number
  reportCompletionRate: number
  feedbackSubmissionRate: number
  avgReportDwellMs: number
}

export interface FounderAnalyticsData {
  periodLabel: string
  lastUpdated: string
  source: "live" | "empty"
  overview: FounderAnalyticsOverview
  funnel: FunnelStepMetric[]
  sectionEngagement: SectionEngagementMetric[]
  reviewerUsage: ReviewerUsageMetric[]
  feedback: FeedbackSummaryMetric
}

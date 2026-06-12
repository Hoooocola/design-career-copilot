import type { EngagementSectionId } from "@/types/engagement"
import type { ReviewerPersona } from "@/types/reviewer"

export type AnalyticsEventType =
  | "session_started"
  | "portfolio_uploaded"
  | "jd_submitted"
  | "analysis_completed"
  | "persona_switched"
  | "report_section_viewed"
  | "roadmap_viewed"
  | "feedback_submitted"

export type AnalyticsMetadataValue = string | number | boolean | null

export interface AnalyticsEvent {
  id: string
  sessionId: string
  timestamp: number
  eventType: AnalyticsEventType
  metadata?: Record<string, AnalyticsMetadataValue>
}

export interface AnalyticsEventStore {
  version: 1
  events: AnalyticsEvent[]
}

export interface PersonaUsageMetric {
  persona: ReviewerPersona
  count: number
}

export interface ModulePopularityMetric {
  sectionId: EngagementSectionId | "roadmap"
  count: number
}

export interface BetaMetrics {
  totalVisitors: number
  analysisCompletionRate: number
  feedbackSubmissionRate: number
  personaDistribution: PersonaUsageMetric[]
  popularModules: ModulePopularityMetric[]
  avgSessionDurationMs: number
  eventCount: number
  source: "live" | "empty"
}

import type { FounderAnalyticsData } from "@/types/founder-analytics"

export interface FounderAnalyticsSnapshot {
  captured_at: string
  period: string
  overview: FounderAnalyticsData["overview"]
  funnel: FounderAnalyticsData["funnel"]
  section_engagement: FounderAnalyticsData["sectionEngagement"]
  reviewer_usage: FounderAnalyticsData["reviewerUsage"]
  feedback: FounderAnalyticsData["feedback"]
}

/**
 * Shape for PostHog group analytics / dashboard import.
 * Call when wiring `posthog.capture('founder_analytics_snapshot', payload)`.
 */
export function toPostHogSnapshot(
  data: FounderAnalyticsData
): FounderAnalyticsSnapshot {
  return {
    captured_at: new Date().toISOString(),
    period: data.periodLabel,
    overview: data.overview,
    funnel: data.funnel,
    section_engagement: data.sectionEngagement,
    reviewer_usage: data.reviewerUsage,
    feedback: data.feedback,
  }
}

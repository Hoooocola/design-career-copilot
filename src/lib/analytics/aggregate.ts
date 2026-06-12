import type {
  AnalyticsEvent,
  BetaMetrics,
  ModulePopularityMetric,
  PersonaUsageMetric,
} from "@/types/analytics"
import type { EngagementSectionId } from "@/types/engagement"
import type {
  FounderAnalyticsData,
  FounderSectionId,
  FunnelStepId,
  FunnelStepMetric,
} from "@/types/founder-analytics"
import type { ReviewerPersona } from "@/types/reviewer"

const PERSONA_IDS: ReviewerPersona[] = [
  "hr_reviewer",
  "design_lead",
  "ai_product_lead",
  "design_engineer",
]

const FOUNDER_SECTION_IDS: FounderSectionId[] = [
  "executive_summary",
  "heatmap",
  "benchmark",
  "consensus",
  "gap_analysis",
  "roadmap",
]

const FUNNEL_STEP_IDS: FunnelStepId[] = [
  "upload_pdf",
  "submit_jd",
  "start_analysis",
  "view_report",
  "open_roadmap",
]

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function uniqueSessions(events: AnalyticsEvent[]): Set<string> {
  return new Set(events.map((event) => event.sessionId))
}

function sessionsWithEvent(
  events: AnalyticsEvent[],
  eventType: AnalyticsEvent["eventType"]
): Set<string> {
  return new Set(
    events.filter((event) => event.eventType === eventType).map((e) => e.sessionId)
  )
}

function rate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return Math.round((numerator / denominator) * 1000) / 10
}

function sessionsStartedAnalysis(events: AnalyticsEvent[]): Set<string> {
  const jdSessions = sessionsWithEvent(events, "jd_submitted")
  const progressed = new Set<string>()

  for (const event of events) {
    if (
      event.eventType === "analysis_completed" ||
      event.eventType === "report_section_viewed" ||
      event.eventType === "persona_switched" ||
      event.eventType === "roadmap_viewed"
    ) {
      progressed.add(event.sessionId)
    }
  }

  return new Set([...jdSessions].filter((sessionId) => progressed.has(sessionId)))
}

function buildFunnelSteps(events: AnalyticsEvent[]): FunnelStepMetric[] {
  const stepSessions: Record<FunnelStepId, Set<string>> = {
    upload_pdf: sessionsWithEvent(events, "portfolio_uploaded"),
    submit_jd: sessionsWithEvent(events, "jd_submitted"),
    start_analysis: sessionsStartedAnalysis(events),
    view_report: sessionsWithEvent(events, "analysis_completed"),
    open_roadmap: sessionsWithEvent(events, "roadmap_viewed"),
  }

  const counts = FUNNEL_STEP_IDS.map((id) => stepSessions[id].size)

  return FUNNEL_STEP_IDS.map((id, index) => {
    const count = counts[index]
    const previous = index === 0 ? count : counts[index - 1]
    const conversionRate = index === 0 ? (count > 0 ? 100 : 0) : rate(count, previous)
    const dropOffRate =
      index === 0 ? 0 : Math.round((100 - conversionRate) * 10) / 10

    return { id, count, conversionRate, dropOffRate }
  })
}

function countActiveSessions7d(events: AnalyticsEvent[]): number {
  const cutoff = Date.now() - SEVEN_DAYS_MS
  return uniqueSessions(events.filter((event) => event.timestamp >= cutoff)).size
}

function countSectionViewers(
  events: AnalyticsEvent[],
  sectionId: FounderSectionId
): number {
  const sessions = new Set<string>()

  for (const event of events) {
    if (sectionId === "roadmap") {
      if (event.eventType === "roadmap_viewed") {
        sessions.add(event.sessionId)
      }
      continue
    }

    if (
      event.eventType === "report_section_viewed" &&
      event.metadata?.sectionId === sectionId
    ) {
      sessions.add(event.sessionId)
    }
  }

  return sessions.size
}

function buildEmptyFounderAnalytics(): FounderAnalyticsData {
  return {
    periodLabel: "all",
    lastUpdated: new Date().toISOString(),
    source: "empty",
    overview: {
      totalSessions: 0,
      activeUsers7d: 0,
      reportCompletionRate: 0,
      avgReportDwellMs: 0,
      feedbackSubmissionRate: 0,
    },
    funnel: FUNNEL_STEP_IDS.map((id) => ({
      id,
      count: 0,
      conversionRate: 0,
      dropOffRate: 0,
    })),
    sectionEngagement: FOUNDER_SECTION_IDS.map((id) => ({
      id,
      viewers: 0,
      avgDwellMs: 0,
      totalDwellMs: 0,
    })),
    reviewerUsage: PERSONA_IDS.map((persona) => ({
      persona,
      usageCount: 0,
      avgDwellMs: 0,
    })),
    feedback: {
      helpfulRate: 0,
      actionabilityRate: 0,
      totalResponses: 0,
      helpfulCount: 0,
      actionabilityCount: 0,
    },
  }
}

export function buildFounderAnalytics(events: AnalyticsEvent[]): FounderAnalyticsData {
  if (!events.length) {
    return buildEmptyFounderAnalytics()
  }

  const metrics = buildBetaMetrics(events)
  const feedbackSessions = sessionsWithEvent(events, "feedback_submitted")
  const lastUpdated = new Date(
    Math.max(...events.map((event) => event.timestamp))
  ).toISOString()

  return {
    periodLabel: "all",
    lastUpdated,
    source: "live",
    overview: {
      totalSessions: metrics.totalVisitors,
      activeUsers7d: countActiveSessions7d(events),
      reportCompletionRate: metrics.analysisCompletionRate,
      avgReportDwellMs: metrics.avgSessionDurationMs,
      feedbackSubmissionRate: metrics.feedbackSubmissionRate,
    },
    funnel: buildFunnelSteps(events),
    sectionEngagement: FOUNDER_SECTION_IDS.map((id) => ({
      id,
      viewers: countSectionViewers(events, id),
      avgDwellMs: 0,
      totalDwellMs: 0,
    })),
    reviewerUsage: metrics.personaDistribution.map((item) => ({
      persona: item.persona,
      usageCount: item.count,
      avgDwellMs: 0,
    })),
    feedback: {
      helpfulRate: 0,
      actionabilityRate: 0,
      totalResponses: feedbackSessions.size,
      helpfulCount: 0,
      actionabilityCount: 0,
    },
  }
}

export function buildBetaMetrics(events: AnalyticsEvent[]): BetaMetrics {
  if (!events.length) {
    return {
      totalVisitors: 0,
      analysisCompletionRate: 0,
      feedbackSubmissionRate: 0,
      personaDistribution: PERSONA_IDS.map((persona) => ({
        persona,
        count: 0,
      })),
      popularModules: [],
      avgSessionDurationMs: 0,
      eventCount: 0,
      source: "empty",
    }
  }

  const allSessions = uniqueSessions(events)
  const startedSessions = sessionsWithEvent(events, "session_started")
  const uploadedSessions = sessionsWithEvent(events, "portfolio_uploaded")
  const completedSessions = sessionsWithEvent(events, "analysis_completed")
  const feedbackSessions = sessionsWithEvent(events, "feedback_submitted")

  const funnelBase = startedSessions.size || uploadedSessions.size || allSessions.size

  const personaCounts = new Map<ReviewerPersona, number>(
    PERSONA_IDS.map((persona) => [persona, 0])
  )

  for (const event of events) {
    if (event.eventType === "persona_switched") {
      const persona = event.metadata?.persona as ReviewerPersona | undefined
      if (persona && personaCounts.has(persona)) {
        personaCounts.set(persona, (personaCounts.get(persona) ?? 0) + 1)
      }
    }
    if (event.eventType === "analysis_completed") {
      const persona = event.metadata?.persona as ReviewerPersona | undefined
      if (persona && personaCounts.has(persona)) {
        personaCounts.set(persona, (personaCounts.get(persona) ?? 0) + 1)
      }
    }
  }

  const moduleCounts = new Map<string, number>()

  for (const event of events) {
    if (event.eventType === "report_section_viewed") {
      const sectionId = event.metadata?.sectionId
      if (typeof sectionId === "string") {
        moduleCounts.set(sectionId, (moduleCounts.get(sectionId) ?? 0) + 1)
      }
    }
    if (event.eventType === "roadmap_viewed") {
      moduleCounts.set("roadmap", (moduleCounts.get("roadmap") ?? 0) + 1)
    }
  }

  const popularModules: ModulePopularityMetric[] = [...moduleCounts.entries()]
    .map(([sectionId, count]) => ({
      sectionId: sectionId as EngagementSectionId | "roadmap",
      count,
    }))
    .sort((a, b) => b.count - a.count)

  const durations: number[] = []
  const bySession = new Map<string, number[]>()

  for (const event of events) {
    const list = bySession.get(event.sessionId) ?? []
    list.push(event.timestamp)
    bySession.set(event.sessionId, list)
  }

  for (const timestamps of bySession.values()) {
    if (timestamps.length < 2) continue
    const min = Math.min(...timestamps)
    const max = Math.max(...timestamps)
    durations.push(Math.max(0, max - min))
  }

  const avgSessionDurationMs = durations.length
    ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
    : 0

  const personaDistribution: PersonaUsageMetric[] = PERSONA_IDS.map(
    (persona) => ({
      persona,
      count: personaCounts.get(persona) ?? 0,
    })
  ).sort((a, b) => b.count - a.count)

  return {
    totalVisitors: allSessions.size,
    analysisCompletionRate: rate(completedSessions.size, funnelBase),
    feedbackSubmissionRate: rate(
      feedbackSessions.size,
      completedSessions.size || funnelBase
    ),
    personaDistribution,
    popularModules,
    avgSessionDurationMs,
    eventCount: events.length,
    source: "live",
  }
}

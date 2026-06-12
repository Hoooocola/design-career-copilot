import type { EngagementSectionId, ReportEngagementSession } from "@/types/engagement"

export interface AnalyticsEvent {
  event: string
  properties: Record<string, string | number | boolean | undefined>
  timestamp: number
}

/**
 * Maps a local engagement session to PostHog-style events.
 * Wire to `posthog.capture()` when analytics is enabled.
 */
export function toPostHogEvents(session: ReportEngagementSession): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [
    {
      event: "report_page_entered",
      properties: {
        pathname: session.pathname,
        session_id: session.id,
      },
      timestamp: session.pageEnteredAt,
    },
  ]

  for (const record of Object.values(session.sections)) {
    if (!record) continue

    for (const [index, visit] of record.visits.entries()) {
      events.push({
        event: "report_section_entered",
        properties: {
          session_id: session.id,
          section_id: record.sectionId as EngagementSectionId,
          visit_index: index,
        },
        timestamp: visit.enteredAt,
      })

      if (visit.leftAt !== undefined) {
        events.push({
          event: "report_section_left",
          properties: {
            session_id: session.id,
            section_id: record.sectionId as EngagementSectionId,
            visit_index: index,
            dwell_ms: visit.dwellMs,
          },
          timestamp: visit.leftAt,
        })
      }
    }

    if (record.totalDwellMs > 0) {
      events.push({
        event: "report_section_dwell_total",
        properties: {
          session_id: session.id,
          section_id: record.sectionId as EngagementSectionId,
          total_dwell_ms: record.totalDwellMs,
          visit_count: record.visits.length,
        },
        timestamp: session.pageLeftAt ?? Date.now(),
      })
    }
  }

  if (session.pageLeftAt !== undefined) {
    events.push({
      event: "report_page_left",
      properties: {
        pathname: session.pathname,
        session_id: session.id,
        total_page_dwell_ms: session.totalPageDwellMs,
      },
      timestamp: session.pageLeftAt,
    })
  }

  return events
}

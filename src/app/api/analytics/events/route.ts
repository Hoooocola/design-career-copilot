import { NextRequest, NextResponse } from "next/server"

import { buildBetaMetrics, buildFounderAnalytics } from "@/lib/analytics/aggregate"
import {
  appendAnalyticsEvent,
  readAnalyticsEvents,
} from "@/lib/analytics/server-store"
import {
  FOUNDER_AUTH_COOKIE,
  isFounderAuthenticated,
} from "@/lib/auth/founder-session"
import type { AnalyticsEvent, AnalyticsEventType } from "@/types/analytics"

export const runtime = "nodejs"

const VALID_EVENT_TYPES = new Set<AnalyticsEventType>([
  "session_started",
  "portfolio_uploaded",
  "jd_submitted",
  "analysis_completed",
  "persona_switched",
  "report_section_viewed",
  "roadmap_viewed",
  "feedback_submitted",
])

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyticsEvent

    if (
      !body?.sessionId ||
      !body?.eventType ||
      !VALID_EVENT_TYPES.has(body.eventType)
    ) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 })
    }

    const event: AnalyticsEvent = {
      id: body.id || crypto.randomUUID(),
      sessionId: body.sessionId,
      timestamp: body.timestamp || Date.now(),
      eventType: body.eventType,
      metadata: body.metadata,
    }

    await appendAnalyticsEvent(event)

    return NextResponse.json({ ok: true, id: event.id })
  } catch (error) {
    console.error("[analytics POST]", error)
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(FOUNDER_AUTH_COOKIE)?.value

  if (!isFounderAuthenticated(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const events = await readAnalyticsEvents()
    const metrics = buildBetaMetrics(events)
    const founder = buildFounderAnalytics(events)

    return NextResponse.json({ metrics, founder, events })
  } catch (error) {
    console.error("[analytics GET]", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}

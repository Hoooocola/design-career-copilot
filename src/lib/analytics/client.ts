"use client"

import { SESSION_KEYS } from "@/lib/constants"
import type { AnalyticsEventType, AnalyticsMetadataValue } from "@/types/analytics"

export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return ""

  const existing = sessionStorage.getItem(SESSION_KEYS.analyticsSessionId)
  if (existing) return existing

  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEYS.analyticsSessionId, id)
  return id
}

export function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  metadata?: Record<string, AnalyticsMetadataValue>
) {
  if (typeof window === "undefined") return

  const payload = {
    id: crypto.randomUUID(),
    sessionId: getAnalyticsSessionId(),
    timestamp: Date.now(),
    eventType,
    metadata,
  }

  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // best-effort for beta analytics
  })
}

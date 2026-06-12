"use client"

import { useEffect, useRef } from "react"

import { trackAnalyticsEvent } from "@/lib/analytics/client"

export function AnalyticsBootstrap() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackAnalyticsEvent("session_started", {
      path: window.location.pathname,
    })
  }, [])

  return null
}

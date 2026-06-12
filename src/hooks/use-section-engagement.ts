"use client"

import { useEffect, useRef } from "react"

import { trackAnalyticsEvent } from "@/lib/analytics/client"
import {
  SECTION_VISIBILITY_THRESHOLD,
  TRACKED_SECTION_IDS,
} from "@/lib/engagement/constants"
import {
  createEngagementSession,
  finalizeEngagementSession,
  persistEngagementSession,
  recordSectionEnter,
  recordSectionLeave,
} from "@/lib/engagement/storage"
import type { EngagementSectionId, ReportEngagementSession } from "@/types/engagement"

interface UseSectionEngagementOptions {
  pathname: string
  enabled?: boolean
  resetKey?: string
}

function isTrackedSectionId(value: string): value is EngagementSectionId {
  return TRACKED_SECTION_IDS.includes(value as EngagementSectionId)
}

export function useSectionEngagement({
  pathname,
  enabled = true,
  resetKey,
}: UseSectionEngagementOptions) {
  const sessionRef = useRef<ReportEngagementSession | null>(null)
  const activeSectionsRef = useRef<Set<EngagementSectionId>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!enabled) return

    const startSession = () => {
      activeSectionsRef.current = new Set()
      syncSession(createEngagementSession(pathname))
    }

    const flushSession = (leftAt = Date.now()) => {
      const current = sessionRef.current
      if (!current) return

      const finalized = finalizeEngagementSession(
        current,
        leftAt,
        [...activeSectionsRef.current]
      )
      persistEngagementSession(finalized)
      sessionRef.current = null
      activeSectionsRef.current.clear()
    }

    const syncSession = (session: ReportEngagementSession) => {
      sessionRef.current = session
      persistEngagementSession(session)
    }

    const handleSectionEnter = (sectionId: EngagementSectionId) => {
      if (activeSectionsRef.current.has(sectionId) || !sessionRef.current) return
      activeSectionsRef.current.add(sectionId)

      if (sectionId === "roadmap") {
        trackAnalyticsEvent("roadmap_viewed", { sectionId })
      } else {
        trackAnalyticsEvent("report_section_viewed", { sectionId })
      }

      syncSession(
        recordSectionEnter(sessionRef.current, sectionId, Date.now())
      )
    }

    const handleSectionLeave = (sectionId: EngagementSectionId) => {
      if (!activeSectionsRef.current.has(sectionId) || !sessionRef.current) return
      activeSectionsRef.current.delete(sectionId)
      syncSession(
        recordSectionLeave(sessionRef.current, sectionId, Date.now())
      )
    }

    syncSession(createEngagementSession(pathname))

    const observeSections = () => {
      observerRef.current?.disconnect()

      const elements = document.querySelectorAll("[data-engagement-section]")
      if (!elements.length) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const rawId = entry.target.getAttribute("data-engagement-section")
            if (!rawId || !isTrackedSectionId(rawId)) continue

            const isVisible =
              entry.isIntersecting &&
              entry.intersectionRatio >= SECTION_VISIBILITY_THRESHOLD

            if (isVisible) {
              handleSectionEnter(rawId)
            } else if (activeSectionsRef.current.has(rawId)) {
              handleSectionLeave(rawId)
            }
          }
        },
        {
          threshold: [0, SECTION_VISIBILITY_THRESHOLD, 0.5, 0.75],
        }
      )

      elements.forEach((element) => observerRef.current?.observe(element))
    }

    const rafId = requestAnimationFrame(observeSections)

    const handlePageLeave = () => {
      flushSession(Date.now())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handlePageLeave()
        startSession()
      }
    }

    window.addEventListener("pagehide", handlePageLeave)
    window.addEventListener("beforeunload", handlePageLeave)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId)
      observerRef.current?.disconnect()
      window.removeEventListener("pagehide", handlePageLeave)
      window.removeEventListener("beforeunload", handlePageLeave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      flushSession(Date.now())
    }
  }, [enabled, pathname, resetKey])
}

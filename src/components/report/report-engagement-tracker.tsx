"use client"

import { useSectionEngagement } from "@/hooks/use-section-engagement"

interface ReportEngagementTrackerProps {
  resetKey?: string
}

export function ReportEngagementTracker({ resetKey }: ReportEngagementTrackerProps) {
  useSectionEngagement({
    pathname: "/report",
    resetKey,
  })

  return null
}

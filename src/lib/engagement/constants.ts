import type { EngagementSectionId } from "@/types/engagement"

export const ENGAGEMENT_STORAGE_KEY = "dcc-report-engagement"

export const MAX_STORED_SESSIONS = 30

/** Section must be at least this visible to count as "entered" */
export const SECTION_VISIBILITY_THRESHOLD = 0.25

export const TRACKED_SECTION_IDS: EngagementSectionId[] = [
  "executive_summary",
  "heatmap",
  "benchmark",
  "consensus",
  "gap_analysis",
  "opportunity_ranking",
  "roadmap",
]

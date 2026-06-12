import { SESSION_KEYS } from "@/lib/constants"
import type { ReviewerPersona } from "@/types/reviewer"
import { DEFAULT_REVIEWER_PERSONA, isReviewerPersona } from "@/lib/reviewer"

export function ensureReportId(): string {
  if (typeof window === "undefined") return ""

  const existing = sessionStorage.getItem(SESSION_KEYS.reportId)
  if (existing) return existing

  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEYS.reportId, id)
  return id
}

export function getFeedbackContext() {
  if (typeof window === "undefined") {
    return { reportId: "", persona: DEFAULT_REVIEWER_PERSONA, hasReport: false }
  }

  const reportRaw = sessionStorage.getItem(SESSION_KEYS.report)
  const personaRaw = sessionStorage.getItem(SESSION_KEYS.reviewerPersona)
  const persona =
    personaRaw && isReviewerPersona(personaRaw)
      ? personaRaw
      : DEFAULT_REVIEWER_PERSONA

  return {
    reportId: ensureReportId(),
    persona: persona as ReviewerPersona,
    hasReport: Boolean(reportRaw),
  }
}

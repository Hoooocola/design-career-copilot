import {
  FEEDBACK_STORAGE_KEY,
  MAX_FEEDBACK_SUBMISSIONS,
} from "@/lib/feedback/constants"
import type { FeedbackStore, FeedbackSubmission } from "@/types/feedback"

function readStore(): FeedbackStore {
  if (typeof window === "undefined") {
    return { version: 1, submissions: [] }
  }

  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    if (!raw) return { version: 1, submissions: [] }
    const parsed = JSON.parse(raw) as FeedbackStore
    if (parsed.version !== 1 || !Array.isArray(parsed.submissions)) {
      return { version: 1, submissions: [] }
    }
    return parsed
  } catch {
    return { version: 1, submissions: [] }
  }
}

function writeStore(store: FeedbackStore) {
  if (typeof window === "undefined") return
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(store))
}

export function getFeedbackSubmissions(): FeedbackSubmission[] {
  return readStore().submissions
}

export function saveFeedbackSubmission(submission: FeedbackSubmission) {
  const store = readStore()
  const submissions = [
    submission,
    ...store.submissions.filter((item) => item.id !== submission.id),
  ].slice(0, MAX_FEEDBACK_SUBMISSIONS)
  writeStore({ version: 1, submissions })
}

export function hasFeedbackForReport(reportId: string): boolean {
  return readStore().submissions.some((item) => item.reportId === reportId)
}

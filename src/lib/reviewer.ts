import {
  REVIEWER_PERSONAS,
  type ReviewerPersona,
} from "@/types/reviewer"

export function isReviewerPersona(value: string): value is ReviewerPersona {
  return (REVIEWER_PERSONAS as string[]).includes(value)
}

export const DEFAULT_REVIEWER_PERSONA: ReviewerPersona = "design_lead"

import type {
  PayFeatureId,
  PriceTierId,
  ValueFeatureId,
} from "@/types/feedback"

export const FEEDBACK_STORAGE_KEY = "dcc-feedback-submissions"

export const MAX_FEEDBACK_SUBMISSIONS = 200

export const VALUE_FEATURE_IDS: ValueFeatureId[] = [
  "executive_summary",
  "match_score",
  "radar",
  "heatmap",
  "benchmark",
  "consensus_conflict",
  "review_trace",
  "opportunity_ranking",
  "gap_analysis",
  "improvement_simulator",
  "action_plan",
  "career_roadmap",
  "persona_comparison",
]

export const PAY_FEATURE_IDS: PayFeatureId[] = [
  "portfolio_review",
  "jd_match",
  "multi_persona_review",
  "review_trace",
  "benchmark_analysis",
  "gap_analysis",
  "opportunity_ranking",
  "improvement_simulator",
  "career_roadmap",
  "portfolio_rewrite",
  "mock_interview",
  "career_coach",
  "ai_job_search",
]

export const PRICE_TIER_IDS: PriceTierId[] = [
  "free_only",
  "5",
  "10",
  "20",
  "50",
  "100_plus",
]

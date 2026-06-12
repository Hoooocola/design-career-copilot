import type { Locale } from "@/lib/i18n"
import type { ReviewerPersona } from "@/types/reviewer"

export type ValueFeatureId =
  | "executive_summary"
  | "match_score"
  | "radar"
  | "heatmap"
  | "benchmark"
  | "consensus_conflict"
  | "review_trace"
  | "opportunity_ranking"
  | "gap_analysis"
  | "improvement_simulator"
  | "action_plan"
  | "career_roadmap"
  | "persona_comparison"

export type PayFeatureId =
  | "portfolio_review"
  | "jd_match"
  | "multi_persona_review"
  | "review_trace"
  | "benchmark_analysis"
  | "gap_analysis"
  | "opportunity_ranking"
  | "improvement_simulator"
  | "career_roadmap"
  | "portfolio_rewrite"
  | "mock_interview"
  | "career_coach"
  | "ai_job_search"

export type PricingModelId =
  | "one_time"
  | "monthly"
  | "annual"
  | "pay_per_portfolio"
  | "school_license"
  | "company_license"

export type PriceTierId =
  | "free_only"
  | "5"
  | "10"
  | "20"
  | "50"
  | "100_plus"

export type PortfolioModifyIntent =
  | "definitely"
  | "probably"
  | "not_sure"
  | "no"

export type PayIntent = "yes" | "maybe" | "no"

export type PmfDisappointment = "very" | "somewhat" | "not"

export type StarRating = 1 | 2 | 3 | 4 | 5

export interface FeedbackSubmission {
  id: string
  reportId: string
  persona: ReviewerPersona
  locale: Locale
  timestamp: number
  accuracyScore: StarRating
  trustScore: StarRating
  mostAccurateConclusion: string
  leastAccurateConclusion: string
  mostValuableFeatures: ValueFeatureId[]
  leastUsefulFeature: ValueFeatureId | null
  mostTimeSpentSection: ValueFeatureId | null
  learnedSomethingNew: "yes" | "no" | null
  whatLearned: string
  actionabilityScore: StarRating
  willModifyPortfolio: PortfolioModifyIntent | null
  mostLikelyRecommendation: string
  firstThingToChange: string
  wouldPay: PayIntent | null
  willingToPayFeatures: PayFeatureId[]
  whyPayForFeature: string
  pricingModel: PricingModelId | null
  priceWillingness: PriceTierId | null
  pmfDisappointment: PmfDisappointment | null
  npsScore: number | null
  oneImprovement: string
}

export interface FeedbackStore {
  version: 1
  submissions: FeedbackSubmission[]
}

export interface FeedbackTrendPoint {
  date: string
  count: number
}

export interface FeedbackAnalytics {
  feedbackCount: number
  avgTrustScore: number
  avgAccuracyScore: number
  avgActionabilityScore: number
  mostValuableFeature: ValueFeatureId | null
  leastValuableFeature: ValueFeatureId | null
  mostWillingToPayFeature: PayFeatureId | null
  priceDistribution: { tier: PriceTierId; count: number }[]
  npsScore: number
  pmfScore: number
  trend: FeedbackTrendPoint[]
  valuableFeatureCounts: { id: ValueFeatureId; count: number }[]
  payFeatureCounts: { id: PayFeatureId; count: number }[]
  source: "live" | "empty"
}

export type ApplicableRole =
  | "ai_product_designer"
  | "ai_ux_designer"
  | "design_engineer"

export type ScoreLabel =
  | "not_evident"
  | "emerging"
  | "competent"
  | "strong"
  | "exceptional"

export type RecommendationTier = "strong_yes" | "yes" | "mixed" | "no"

export type EvidenceConfidence = "high" | "medium" | "low"

export type EvidenceTag = "primary" | "secondary" | "inferred" | "absent"

export type SkillLevel = "strong" | "partial" | "missing"

export type GapImpact = "high" | "medium" | "low"

export interface DimensionScore {
  dimension_id: string
  score: number
  label: ScoreLabel
  evidence_cited: string[]
  gaps: string[]
}

export interface SkillCoverageEntry {
  skill: string
  source: "jd_required" | "jd_nice_to_have"
  level: SkillLevel
  mapped_dimensions: string[]
  evidence: string | null
}

export interface GapAnalysisEntry {
  area: string
  dimension_id: string
  impact: GapImpact
  description: string
  jd_requirement: string | null
}

export interface ActionPlanEntry {
  priority: number
  title: string
  description: string
  dimension_id: string
  timeframe: string
}

export interface RubricReviewOutput {
  meta: {
    target_role: ApplicableRole
    seniority: "junior" | "mid" | "senior" | "staff"
    evidence_confidence: EvidenceConfidence
    recommendation_tier: RecommendationTier
  }
  executive_summary: string
  match_score: number
  dimension_scores: DimensionScore[]
  skill_coverage: SkillCoverageEntry[]
  strengths: string[]
  weaknesses: string[]
  gap_analysis: GapAnalysisEntry[]
  action_plan: ActionPlanEntry[]
  dealbreakers_triggered: string[]
  reviewer_notes: string
}

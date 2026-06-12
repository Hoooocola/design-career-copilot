export type DimensionId =
  | "problem_framing_strategy"
  | "user_research_discovery"
  | "interaction_ux_design"
  | "visual_craft_quality"
  | "systems_thinking_scalability"
  | "technical_fluency_implementation"
  | "collaboration_communication"
  | "impact_outcomes"
  | "ai_product_sense"
  | "process_storytelling"
  | "portfolio_presentation"

export type CategoryId =
  | "product_strategy"
  | "experience_craft"
  | "systems_technical"
  | "communication_process"

export type ScoreLabel =
  | "not_evident"
  | "emerging"
  | "competent"
  | "strong"
  | "exceptional"

export type EvidenceType = "primary" | "secondary" | "inferred" | "absent"

export interface DimensionScore {
  dimensionId: DimensionId
  score: number
  label: ScoreLabel
}

export interface CategoryScore {
  categoryId: CategoryId
  score: number
  dimensionIds: DimensionId[]
}

export interface CompetencyOverview {
  overallReadiness: number
  topStrengths: string[]
  criticalGaps: string[]
  reviewerVerdict: string
}

export interface EvidenceInsight {
  dimensionId: DimensionId
  insight: string
  evidence: string
  evidenceType: EvidenceType
  recommendation: string
}

export interface ReviewFramework {
  competencyOverview: CompetencyOverview
  dimensionScores: DimensionScore[]
  categoryBreakdown: CategoryScore[]
  evidenceInsights: EvidenceInsight[]
}

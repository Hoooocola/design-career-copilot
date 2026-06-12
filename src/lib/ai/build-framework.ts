import { computeCategoryBreakdown } from "@/lib/framework/categories"
import type {
  CompetencyOverview,
  DimensionScore,
  EvidenceInsight,
  ReviewFramework,
} from "@/types/framework"

export function buildReviewFramework(input: {
  competencyOverview: CompetencyOverview
  dimensionScores: DimensionScore[]
  evidenceInsights: EvidenceInsight[]
}): ReviewFramework {
  return {
    competencyOverview: input.competencyOverview,
    dimensionScores: input.dimensionScores,
    categoryBreakdown: computeCategoryBreakdown(input.dimensionScores),
    evidenceInsights: input.evidenceInsights,
  }
}

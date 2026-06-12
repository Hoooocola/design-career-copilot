import type { CategoryId, DimensionId } from "@/types/framework"

export const DIMENSION_IDS: DimensionId[] = [
  "problem_framing_strategy",
  "user_research_discovery",
  "interaction_ux_design",
  "visual_craft_quality",
  "systems_thinking_scalability",
  "technical_fluency_implementation",
  "collaboration_communication",
  "impact_outcomes",
  "ai_product_sense",
  "process_storytelling",
  "portfolio_presentation",
]

export const FRAMEWORK_CATEGORIES: {
  id: CategoryId
  dimensionIds: DimensionId[]
}[] = [
  {
    id: "product_strategy",
    dimensionIds: [
      "problem_framing_strategy",
      "impact_outcomes",
      "ai_product_sense",
    ],
  },
  {
    id: "experience_craft",
    dimensionIds: [
      "user_research_discovery",
      "interaction_ux_design",
      "visual_craft_quality",
    ],
  },
  {
    id: "systems_technical",
    dimensionIds: [
      "systems_thinking_scalability",
      "technical_fluency_implementation",
    ],
  },
  {
    id: "communication_process",
    dimensionIds: [
      "collaboration_communication",
      "process_storytelling",
      "portfolio_presentation",
    ],
  },
]

export function computeCategoryBreakdown(
  dimensionScores: { dimensionId: DimensionId; score: number }[]
) {
  const scoreMap = new Map(dimensionScores.map((d) => [d.dimensionId, d.score]))

  return FRAMEWORK_CATEGORIES.map((cat) => {
    const scores = cat.dimensionIds
      .map((id) => scoreMap.get(id) ?? 0)
      .filter((s) => s > 0)
    const avg =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / 5) * 100)
        : 0

    return {
      categoryId: cat.id,
      score: avg,
      dimensionIds: cat.dimensionIds,
    }
  })
}

export function scoreToLabel(score: number): import("@/types/framework").ScoreLabel {
  if (score >= 5) return "exceptional"
  if (score >= 4) return "strong"
  if (score >= 3) return "competent"
  if (score >= 2) return "emerging"
  return "not_evident"
}

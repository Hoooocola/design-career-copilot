import type { DimensionId } from "@/types/framework"
import type { BenchmarkDimensionId } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

export interface ImprovementScenario {
  id: string
  title: string
  description: string
  primaryDimensionId: DimensionId
  benchmarkDimensionId: BenchmarkDimensionId
  secondaryDimensionIds: DimensionId[]
  impact: 1 | 2 | 3 | 4 | 5
  effort: 1 | 2 | 3 | 4 | 5
  liftFactor: number
}

export interface BenchmarkProjection {
  label: string
  tier: "top" | "bottom"
  tierPercent: number
}

export interface ImprovementSimulation {
  scenarioId: string
  dimensionLabel: string
  dimensionScoreBefore: number
  dimensionScoreAfter: number
  matchScoreBefore: number
  matchScoreAfter: number
  benchmarkBefore: BenchmarkProjection
  benchmarkAfter: BenchmarkProjection
  confidence: "high" | "medium" | "low"
  rationale: string
  roiScore: number
}

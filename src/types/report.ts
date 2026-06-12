import type { ReviewFramework } from "@/types/framework"
import type { ReviewerPersona } from "@/types/reviewer"

export interface SkillCoverageItem {
  skill: string
  required: boolean
  demonstrated: boolean
  level: "strong" | "partial" | "missing"
}

export interface GapItem {
  area: string
  impact: "high" | "medium" | "low"
  description: string
}

export interface ActionItem {
  priority: number
  title: string
  description: string
  timeframe: string
}

export type OpportunityPriority = "high" | "medium" | "low"

export interface OpportunityItem {
  title: string
  weakness: string
  impact: 1 | 2 | 3 | 4 | 5
  effort: 1 | 2 | 3 | 4 | 5
  priority: OpportunityPriority
  expectedOutcome: string
}

export interface ConsensusItem {
  capability: string
  detail?: string
}

export interface ConflictViewpoint {
  persona: ReviewerPersona
  viewpoint: string
}

export interface ConflictItem {
  topic: string
  viewpoints: ConflictViewpoint[]
}

export interface ConsensusConflictAnalysis {
  consensus: ConsensusItem[]
  conflicts: ConflictItem[]
}

export type BenchmarkDimensionId =
  | "research"
  | "storytelling"
  | "ai_workflow"
  | "validation"
  | "business_thinking"
  | "visual_design"
  | "interaction_design"

export type BenchmarkTier = "top" | "bottom"

export interface BenchmarkPercentileItem {
  dimensionId: BenchmarkDimensionId
  percentile: number
  tier: BenchmarkTier
  tierPercent: number
}

export interface PortfolioBenchmark {
  cohortLabel: string
  percentileRanking: BenchmarkPercentileItem[]
  strongestAreas: string[]
  weakestAreas: string[]
  competitiveAdvantage: string
  improvementPotential: string
  source: "simulated"
}

export interface RoadmapWeekPlan {
  week: 1 | 2 | 3 | 4
  keyTask: string
  estimatedTime: string
  expectedBenefit: string
}

export interface CareerImprovementRoadmap {
  summary: string
  derivedFrom: ("portfolio_analysis" | "gap_analysis" | "benchmark")[]
  weeks: RoadmapWeekPlan[]
}

export interface ReviewTraceItem {
  id: string
  label: string
  conclusion: string
  supportingEvidence: string[]
  missingEvidence: string[]
  reasoningProcess: string
  confidenceScore: number
  recommendation: string
}

export interface PortfolioReport {
  executiveSummary: string
  matchScore: number
  framework: ReviewFramework
  skillCoverage: SkillCoverageItem[]
  strengths: string[]
  weaknesses: string[]
  opportunityRanking: OpportunityItem[]
  consensusConflict: ConsensusConflictAnalysis
  benchmark: PortfolioBenchmark
  improvementRoadmap: CareerImprovementRoadmap
  reviewTrace: ReviewTraceItem[]
  gapAnalysis: GapItem[]
  actionPlan: ActionItem[]
  meta?: {
    targetRole: string
    seniority: string
    recommendationTier: string
    evidenceConfidence: string
    reviewerPersona?: ReviewerPersona
    source?: "ai" | "mock"
    locale?: "en" | "zh"
  }
}

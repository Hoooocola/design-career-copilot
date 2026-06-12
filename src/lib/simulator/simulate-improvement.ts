import { REVIEWER_PERSONAS } from "@/lib/ai/personas"
import { buildCompetencyHeatmap } from "@/lib/framework/build-competency-heatmap"
import type { Locale } from "@/lib/i18n"
import type { DimensionId } from "@/types/framework"
import type {
  BenchmarkProjection,
  ImprovementScenario,
  ImprovementSimulation,
} from "@/types/simulator"
import type { PortfolioBenchmark } from "@/types/report"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

const DEFAULT_WEIGHT = 0.08

function getDimensionStrength(
  report: PortfolioReport,
  dimensionId: DimensionId
): number {
  const rows = buildCompetencyHeatmap(
    report.framework.dimensionScores,
    report.framework.evidenceInsights
  )
  return rows.find((r) => r.dimensionId === dimensionId)?.visualStrength ?? 30
}

function computeLiftFactor(scenario: ImprovementScenario): number {
  const effortDamping = 1 - (scenario.effort - 1) * 0.06
  const impactBoost = scenario.impact / 5
  return Math.min(0.75, scenario.liftFactor * effortDamping * (0.85 + impactBoost * 0.15))
}

function computeMatchDelta(
  dimensionDelta: number,
  scenario: ImprovementScenario,
  persona: ReviewerPersona
): number {
  const weights = REVIEWER_PERSONAS[persona].weightAdjustments
  const primaryWeight = weights[scenario.primaryDimensionId] ?? DEFAULT_WEIGHT

  let secondaryWeight = 0
  for (const dimId of scenario.secondaryDimensionIds) {
    secondaryWeight += (weights[dimId] ?? DEFAULT_WEIGHT) * 0.35
  }

  const spillover = 1 + scenario.impact * 0.04
  return Math.round(dimensionDelta * (primaryWeight + secondaryWeight) * spillover)
}

function compositeBenchmarkTier(
  benchmark: PortfolioBenchmark
): BenchmarkProjection {
  const items = benchmark.percentileRanking
  if (!items.length) {
    return { label: "Top 50%", tier: "top", tierPercent: 50 }
  }

  const tierPercents = items.map((item) => item.tierPercent)
  const avg = Math.round(
    tierPercents.reduce((sum, value) => sum + value, 0) / tierPercents.length
  )

  const weakest = [...items].sort((a, b) => a.percentile - b.percentile)[0]
  const blended = Math.round(avg * 0.4 + weakest.tierPercent * 0.6)

  return {
    label: `Top ${blended}%`,
    tier: blended <= 50 ? "top" : "bottom",
    tierPercent: blended,
  }
}

function projectBenchmark(
  before: BenchmarkProjection,
  dimensionDelta: number,
  matchDelta: number
): BenchmarkProjection {
  const rawDrop = Math.round(dimensionDelta * 0.38 + matchDelta * 0.55)
  const tierPercent = Math.max(8, before.tierPercent - rawDrop)
  return {
    label: `Top ${tierPercent}%`,
    tier: "top",
    tierPercent,
  }
}

function deriveConfidence(
  scenario: ImprovementScenario,
  dimensionBefore: number
): "high" | "medium" | "low" {
  if (scenario.impact >= 4 && scenario.effort <= 3 && dimensionBefore < 45) {
    return "high"
  }
  if (scenario.impact >= 3 && scenario.effort <= 4) return "medium"
  return "low"
}

function buildRationale(
  scenario: ImprovementScenario,
  dimensionDelta: number,
  matchDelta: number,
  locale: Locale
): string {
  if (locale === "zh") {
    return `基于 Rubric 权重估算：补齐「${scenario.title}」预计将该维度视觉强度提升约 ${dimensionDelta} 分，并通过 Persona 权重传导至岗位匹配分（约 +${matchDelta}）。高影响维度在 AI 岗位中通常触发复合排名跃升。`
  }
  return `Rule-based rubric estimate: "${scenario.title}" is projected to lift this dimension's visual strength by ~${dimensionDelta} pts, with persona-weighted spillover to job match (~+${matchDelta}). High-impact dimensions often compound into benchmark rank shifts for AI roles.`
}

export function simulateImprovement(
  report: PortfolioReport,
  scenario: ImprovementScenario,
  persona: ReviewerPersona,
  locale: Locale,
  dimensionLabel: string
): ImprovementSimulation {
  const dimensionBefore = getDimensionStrength(report, scenario.primaryDimensionId)
  const lift = computeLiftFactor(scenario)
  const gap = 100 - dimensionBefore
  const dimensionAfter = Math.round(
    Math.min(94, dimensionBefore + gap * lift)
  )
  const dimensionDelta = dimensionAfter - dimensionBefore

  const matchBefore = report.matchScore
  const matchDelta = computeMatchDelta(dimensionDelta, scenario, persona)
  const matchAfter = Math.min(96, matchBefore + Math.max(4, matchDelta))

  const benchmarkBefore = compositeBenchmarkTier(report.benchmark)
  const benchmarkAfter = projectBenchmark(
    benchmarkBefore,
    dimensionDelta,
    matchAfter - matchBefore
  )

  const roiScore = scenario.impact * 2 - scenario.effort

  return {
    scenarioId: scenario.id,
    dimensionLabel,
    dimensionScoreBefore: dimensionBefore,
    dimensionScoreAfter: dimensionAfter,
    matchScoreBefore: matchBefore,
    matchScoreAfter: matchAfter,
    benchmarkBefore,
    benchmarkAfter,
    confidence: deriveConfidence(scenario, dimensionBefore),
    rationale: buildRationale(
      scenario,
      dimensionDelta,
      matchAfter - matchBefore,
      locale
    ),
    roiScore,
  }
}

import { DIMENSION_IDS } from "@/lib/framework/categories"
import type {
  DimensionId,
  DimensionScore,
  EvidenceInsight,
  EvidenceType,
  ScoreLabel,
} from "@/types/framework"

export type CoverageTier = "strong" | "moderate" | "weak" | "none"

export interface CompetencyHeatmapRow {
  dimensionId: DimensionId
  score: number
  scoreLabel: ScoreLabel
  coverage: number
  coverageTier: CoverageTier
  visualStrength: number
}

const EVIDENCE_COVERAGE: Record<EvidenceType, number> = {
  primary: 95,
  secondary: 72,
  inferred: 42,
  absent: 8,
}

function scoreFallbackCoverage(score: number): number {
  if (score >= 4) return 58
  if (score >= 3) return 44
  if (score >= 2) return 28
  return 12
}

function coverageTier(value: number): CoverageTier {
  if (value >= 75) return "strong"
  if (value >= 50) return "moderate"
  if (value >= 25) return "weak"
  return "none"
}

function computeVisualStrength(score: number, coverage: number): number {
  return Math.round((score / 5) * 100 * 0.65 + coverage * 0.35)
}

function resolveCoverage(
  dimensionId: DimensionId,
  score: number,
  evidenceByDimension: Map<DimensionId, EvidenceType>
): number {
  const evidenceType = evidenceByDimension.get(dimensionId)
  if (!evidenceType) return scoreFallbackCoverage(score)
  return EVIDENCE_COVERAGE[evidenceType]
}

export function buildCompetencyHeatmap(
  dimensionScores: DimensionScore[],
  evidenceInsights: EvidenceInsight[]
): CompetencyHeatmapRow[] {
  const scoreMap = new Map(
    dimensionScores.map((item) => [item.dimensionId, item])
  )
  const evidenceMap = new Map<DimensionId, EvidenceType>()

  for (const insight of evidenceInsights) {
    if (!evidenceMap.has(insight.dimensionId)) {
      evidenceMap.set(insight.dimensionId, insight.evidenceType)
    }
  }

  const rows = DIMENSION_IDS.map((dimensionId) => {
    const dim = scoreMap.get(dimensionId)
    const score = dim?.score ?? 1
    const scoreLabel = dim?.label ?? "not_evident"
    const coverage = resolveCoverage(dimensionId, score, evidenceMap)

    return {
      dimensionId,
      score,
      scoreLabel,
      coverage,
      coverageTier: coverageTier(coverage),
      visualStrength: computeVisualStrength(score, coverage),
    }
  })

  return rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.visualStrength - a.visualStrength
  })
}

export function strengthColor(value: number): string {
  if (value >= 80) return "oklch(0.62 0.17 155)"
  if (value >= 60) return "oklch(0.58 0.14 245)"
  if (value >= 40) return "oklch(0.72 0.14 75)"
  return "oklch(0.58 0.18 25)"
}

export function strengthBg(value: number): string {
  if (value >= 80) return "bg-emerald-500/20"
  if (value >= 60) return "bg-sky-500/20"
  if (value >= 40) return "bg-amber-500/20"
  return "bg-rose-500/20"
}

/** Solid cell fill for true heatmap — opacity scales with intensity */
export function heatmapCellBackground(value: number): string {
  const v = Math.min(100, Math.max(0, value)) / 100
  const alpha = 0.22 + v * 0.62
  if (value >= 80) return `oklch(0.62 0.17 155 / ${alpha})`
  if (value >= 60) return `oklch(0.58 0.14 245 / ${alpha})`
  if (value >= 40) return `oklch(0.72 0.14 75 / ${alpha})`
  return `oklch(0.58 0.18 25 / ${alpha})`
}

export function heatmapCellTextClass(value: number): string {
  if (value >= 72) return "text-foreground font-medium"
  return "text-foreground/90"
}

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

function heatmapTierColor(value: number): string {
  if (value < 40) return "var(--workspace-danger)"
  return "var(--workspace-text-primary)"
}

export function strengthColor(value: number): string {
  if (value < 40) return "var(--workspace-danger)"
  return "var(--workspace-text-muted)"
}

export function strengthBg(value: number): string {
  if (value < 40) return "bg-[var(--workspace-danger-muted)]"
  return "bg-[var(--workspace-surface-raised)]"
}

/** Solid cell fill for true heatmap — neutral scale with danger for gaps */
export function heatmapCellBackground(value: number): string {
  const v = Math.min(100, Math.max(0, value)) / 100
  if (value < 40) {
    const mix = Math.round(10 + (1 - v) * 18)
    return `color-mix(in oklch, var(--workspace-danger) ${mix}%, var(--workspace-surface-raised))`
  }
  const mix = Math.round(6 + v * 16)
  return `color-mix(in oklch, var(--workspace-text-primary) ${mix}%, var(--workspace-surface-raised))`
}

export function heatmapCellTextClass(value: number): string {
  if (value >= 72) return "font-medium text-[var(--workspace-text-primary)]"
  return "text-[var(--workspace-text-primary)]"
}

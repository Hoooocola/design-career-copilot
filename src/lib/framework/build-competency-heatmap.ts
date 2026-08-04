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

const REPORT_HEATMAP = {
  positive: "#1a7f5a",
  accent: "#4c7dff",
  caution: "#b8860b",
  negative: "#c0392b",
} as const

function heatmapTierColor(value: number): string {
  if (value >= 80) return REPORT_HEATMAP.positive
  if (value >= 60) return REPORT_HEATMAP.accent
  if (value >= 40) return REPORT_HEATMAP.caution
  return REPORT_HEATMAP.negative
}

function withAlpha(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function strengthColor(value: number): string {
  return heatmapTierColor(value)
}

export function strengthBg(value: number): string {
  if (value >= 80) return "bg-[var(--report-positive-bg)]"
  if (value >= 60) return "bg-[var(--report-accent-muted)]"
  if (value >= 40) return "bg-[var(--report-caution-bg)]"
  return "bg-[var(--report-negative-bg)]"
}

/** Solid cell fill for true heatmap — opacity scales with intensity */
export function heatmapCellBackground(value: number): string {
  const v = Math.min(100, Math.max(0, value)) / 100
  const alpha = 0.22 + v * 0.62
  return withAlpha(heatmapTierColor(value), alpha)
}

export function heatmapCellTextClass(value: number): string {
  if (value >= 72) return "font-medium text-[var(--report-text)]"
  return "text-[var(--report-text)]"
}

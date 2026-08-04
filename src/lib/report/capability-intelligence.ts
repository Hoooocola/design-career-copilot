import { buildCompetencyHeatmap, type CompetencyHeatmapRow } from "@/lib/framework/build-competency-heatmap"
import type { DimensionId, DimensionScore, EvidenceInsight } from "@/types/framework"
import type { GapItem, OpportunityItem, SkillCoverageItem } from "@/types/report"

export interface RoleAlignmentView {
  requirements: string[]
  matched: string[]
  needsDevelopment: string[]
}

export interface StrengthSignalView {
  index: number
  capability: string
  summary: string
  evidence: string
}

export interface GrowthSignalView {
  index: number
  capability: string
  summary: string
  whyItMatters: string
  hiringImpact: string
}

export interface CapabilityIntelligenceView {
  roleAlignment: RoleAlignmentView
  strengthSignals: StrengthSignalView[]
  growthSignals: GrowthSignalView[]
}

function dimensionLabel(
  row: CompetencyHeatmapRow,
  labels: Record<DimensionId, string>,
  shortLabels: Partial<Record<DimensionId, string>>
) {
  return shortLabels[row.dimensionId] ?? labels[row.dimensionId]
}

function findEvidenceForDimension(
  dimensionId: DimensionId,
  insights: EvidenceInsight[]
): string | undefined {
  const match = insights.find((item) => item.dimensionId === dimensionId)
  if (!match) return undefined
  return match.insight || match.evidence
}

function formatHiringImpact(
  opportunity: OpportunityItem | undefined,
  gap: GapItem | undefined,
  labels: { high: string; medium: string; low: string; score: string }
): string {
  if (opportunity) {
    return labels.score.replace("{impact}", String(opportunity.impact))
  }
  if (gap) {
    return labels[gap.impact]
  }
  return labels.medium
}

export function buildCapabilityIntelligenceView(input: {
  skillCoverage: SkillCoverageItem[]
  topStrengths: string[]
  criticalGaps: string[]
  dimensionScores: DimensionScore[]
  evidenceInsights: EvidenceInsight[]
  gapAnalysis: GapItem[]
  opportunityRanking: OpportunityItem[]
  dimensionLabels: Record<DimensionId, string>
  shortDimensionLabels: Partial<Record<DimensionId, string>>
  impactLabels: { high: string; medium: string; low: string; score: string }
}): CapabilityIntelligenceView {
  const rows = buildCompetencyHeatmap(input.dimensionScores, input.evidenceInsights)
  const gapRows = [...rows].reverse()
  const requiredSkills = input.skillCoverage.filter((item) => item.required)

  const roleAlignment: RoleAlignmentView = {
    requirements: requiredSkills.map((item) => item.skill),
    matched: requiredSkills
      .filter((item) => item.level === "strong")
      .map((item) => item.skill),
    needsDevelopment: requiredSkills
      .filter((item) => item.level === "partial" || item.level === "missing")
      .map((item) => item.skill),
  }

  const strengthSignals = input.topStrengths.slice(0, 3).map((summary, index) => {
    const row = rows[index]
    const capability = row
      ? dimensionLabel(row, input.dimensionLabels, input.shortDimensionLabels)
      : summary.split(" ").slice(0, 3).join(" ")
    const evidence =
      (row && findEvidenceForDimension(row.dimensionId, input.evidenceInsights)) ??
      summary

    return {
      index: index + 1,
      capability,
      summary,
      evidence,
    }
  })

  const growthSignals = input.criticalGaps.slice(0, 3).map((summary, index) => {
    const row = gapRows[index]
    const gap = input.gapAnalysis[index]
    const opportunity = input.opportunityRanking[index]
    const capability = row
      ? dimensionLabel(row, input.dimensionLabels, input.shortDimensionLabels)
      : gap?.area ?? summary.split(" ").slice(0, 3).join(" ")

    return {
      index: index + 1,
      capability,
      summary,
      whyItMatters: gap?.description ?? summary,
      hiringImpact: formatHiringImpact(opportunity, gap, input.impactLabels),
    }
  })

  return {
    roleAlignment,
    strengthSignals,
    growthSignals,
  }
}

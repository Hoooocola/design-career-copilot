import { buildCompetencyHeatmap } from "@/lib/framework/build-competency-heatmap"
import { computePriorityScore } from "@/lib/ai/build-opportunity-ranking"
import {
  DIMENSION_TO_BENCHMARK,
  SCENARIO_TEMPLATES,
  type ScenarioTemplate,
} from "@/lib/simulator/scenario-templates"
import type { Locale } from "@/lib/i18n"
import type { DimensionId } from "@/types/framework"
import type { ImprovementScenario } from "@/types/simulator"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

function templateToScenario(
  template: ScenarioTemplate,
  locale: Locale
): ImprovementScenario {
  return {
    id: template.id,
    title: locale === "zh" ? template.titles.zh : template.titles.en,
    description:
      locale === "zh" ? template.descriptions.zh : template.descriptions.en,
    primaryDimensionId: template.dimensionId,
    benchmarkDimensionId: template.benchmarkDimensionId,
    secondaryDimensionIds: template.secondaryDimensionIds ?? [],
    impact: template.impact,
    effort: template.effort,
    liftFactor: template.liftFactor,
  }
}

function isRelevantTemplate(
  template: ScenarioTemplate,
  persona: ReviewerPersona
): boolean {
  if (!template.personas?.length) return true
  return template.personas.includes(persona)
}

function weakestDimensions(
  report: PortfolioReport,
  limit: number
): DimensionId[] {
  const rows = buildCompetencyHeatmap(
    report.framework.dimensionScores,
    report.framework.evidenceInsights
  )
  return rows
    .slice()
    .sort((a, b) => a.visualStrength - b.visualStrength)
    .slice(0, limit)
    .map((row) => row.dimensionId)
}

function opportunityDimensionHints(
  report: PortfolioReport
): DimensionId[] {
  const hints: DimensionId[] = []
  const text = [
    ...report.weaknesses,
    ...report.opportunityRanking.map((o) => `${o.title} ${o.weakness}`),
  ]
    .join(" ")
    .toLowerCase()

  if (/ai|workflow|trust|probabilistic|prompt/.test(text)) {
    hints.push("ai_product_sense")
  }
  if (/research|discovery|synthesis|interview/.test(text)) {
    hints.push("user_research_discovery")
  }
  if (/system|component|token|scalab/.test(text)) {
    hints.push("systems_thinking_scalability")
  }
  if (/code|prototype|repo|implement|engineer/.test(text)) {
    hints.push("technical_fluency_implementation")
  }
  if (/collaborat|cross-functional|stakeholder|pm|engineering/.test(text)) {
    hints.push("collaboration_communication")
  }
  if (/strateg|business|impact|metric|outcome|validat/.test(text)) {
    hints.push("problem_framing_strategy", "impact_outcomes")
  }
  if (/story|narrative|process/.test(text)) {
    hints.push("process_storytelling")
  }
  if (/interaction|state|flow|ux/.test(text)) {
    hints.push("interaction_ux_design")
  }

  return hints
}

export function buildImprovementScenarios(
  report: PortfolioReport,
  persona: ReviewerPersona,
  locale: Locale
): ImprovementScenario[] {
  const weak = weakestDimensions(report, 5)
  const hints = opportunityDimensionHints(report)
  const priorityDims = [...new Set([...weak, ...hints])]

  const selectedTemplates: ScenarioTemplate[] = []

  for (const dimId of priorityDims) {
    const match = SCENARIO_TEMPLATES.find(
      (t) => t.dimensionId === dimId && isRelevantTemplate(t, persona)
    )
    if (match && !selectedTemplates.some((t) => t.id === match.id)) {
      selectedTemplates.push(match)
    }
  }

  for (const template of SCENARIO_TEMPLATES) {
    if (selectedTemplates.length >= 5) break
    if (!isRelevantTemplate(template, persona)) continue
    if (selectedTemplates.some((t) => t.id === template.id)) continue
    if (weak.includes(template.dimensionId)) {
      selectedTemplates.push(template)
    }
  }

  if (selectedTemplates.length < 4) {
    for (const template of SCENARIO_TEMPLATES) {
      if (selectedTemplates.length >= 5) break
      if (!isRelevantTemplate(template, persona)) continue
      if (!selectedTemplates.some((t) => t.id === template.id)) {
        selectedTemplates.push(template)
      }
    }
  }

  let scenarios = selectedTemplates.map((t) => templateToScenario(t, locale))

  const topOpportunity = [...report.opportunityRanking].sort(
    (a, b) => computePriorityScore(b) - computePriorityScore(a)
  )[0]

  if (topOpportunity && scenarios.length > 0) {
    const matchIndex = scenarios.findIndex((scenario) => {
      const text = `${topOpportunity.title} ${topOpportunity.weakness}`.toLowerCase()
      if (scenario.primaryDimensionId === "ai_product_sense") {
        return /ai|workflow|trust|prompt/.test(text)
      }
      if (scenario.primaryDimensionId === "user_research_discovery") {
        return /research|discovery|synthesis/.test(text)
      }
      if (scenario.primaryDimensionId === "systems_thinking_scalability") {
        return /system|component|library/.test(text)
      }
      if (scenario.primaryDimensionId === "technical_fluency_implementation") {
        return /code|prototype|repo|implement/.test(text)
      }
      if (scenario.primaryDimensionId === "collaboration_communication") {
        return /collaborat|cross-functional|stakeholder/.test(text)
      }
      return false
    })

    const targetIndex = matchIndex >= 0 ? matchIndex : 0
    scenarios[targetIndex] = {
      ...scenarios[targetIndex],
      title: topOpportunity.title,
      description: topOpportunity.expectedOutcome,
      impact: topOpportunity.impact,
      effort: topOpportunity.effort,
    }
  }

  return scenarios.sort((a, b) => {
    const roiA = a.impact * 2 - a.effort
    const roiB = b.impact * 2 - b.effort
    return roiB - roiA
  })
}

export function getDimensionBenchmarkId(
  dimensionId: DimensionId
): import("@/types/report").BenchmarkDimensionId {
  return DIMENSION_TO_BENCHMARK[dimensionId]
}

import { getPersonaPromptBlock } from "@/lib/ai/personas"
import { rubric } from "@/lib/ai/rubric"
import type { Locale } from "@/lib/i18n"
import type { ReviewerPersona } from "@/types/reviewer"

const RUBRIC_SUMMARY = {
  philosophy: rubric.meta.review_philosophy,
  evidence_hierarchy: rubric.meta.evidence_hierarchy,
  scoring_scale: rubric.scoring_scale,
  role_profiles: rubric.role_profiles,
  dimensions: rubric.dimensions.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    what_design_lead_asks: d.what_design_lead_asks,
    judgment_criteria: d.judgment_criteria,
    evidence_to_extract: d.evidence_to_extract,
    red_flags: d.red_flags,
    green_flags: d.green_flags,
  })),
  evaluation_synthesis: rubric.evaluation_synthesis,
  framework_categories: [
    {
      id: "product_strategy",
      dimensions: ["problem_framing_strategy", "impact_outcomes", "ai_product_sense"],
    },
    {
      id: "experience_craft",
      dimensions: [
        "user_research_discovery",
        "interaction_ux_design",
        "visual_craft_quality",
      ],
    },
    {
      id: "systems_technical",
      dimensions: [
        "systems_thinking_scalability",
        "technical_fluency_implementation",
      ],
    },
    {
      id: "communication_process",
      dimensions: [
        "collaboration_communication",
        "process_storytelling",
        "portfolio_presentation",
      ],
    },
  ],
}

function getLanguageInstruction(locale: Locale): string {
  if (locale === "zh") {
    return `Write the ENTIRE report in professional Simplified Chinese (简体中文), including competencyOverview, evidenceInsights, consensusConflict, executiveSummary, strengths, weaknesses, opportunityRanking, gapAnalysis, actionPlan, and skill names where appropriate.`
  }
  return `Write the entire report in professional English. Be constructive but honest — like a reviewer in a hiring debrief.`
}

export function buildSystemPrompt(
  locale: Locale = "en",
  persona: ReviewerPersona = "design_lead"
): string {
  return `You are conducting a structured portfolio review using the Design Career Copilot Review Framework.

Your job is to simulate a REAL reviewer in a hiring panel — not generic career advice. Be direct, evidence-based, and specific.

${getPersonaPromptBlock(persona)}

## Review Rubric (11 Dimensions)
Apply this rubric strictly. Score ALL 11 dimensions 1-5 in dimensionScores.

${JSON.stringify(RUBRIC_SUMMARY, null, 2)}

## Instructions
1. Infer target_role from the job description: ai_product_designer | ai_ux_designer | design_engineer
2. Infer seniority from the job description: junior | mid | senior | staff
3. Set meta.reviewerPersona to: ${persona}
4. Score ALL 11 dimensionScores (1=not_evident, 2=emerging, 3=competent, 4=strong, 5=exceptional)
5. competencyOverview must reflect THIS persona's priorities — overallReadiness, topStrengths, criticalGaps, reviewerVerdict
6. evidenceInsights: 6-8 items. EACH must follow Insight → Evidence → Recommendation format:
   - insight: what you observe for this dimension
   - evidence: specific portfolio quote/artifact OR explicit absence (tag evidenceType: primary|secondary|inferred|absent)
   - recommendation: actionable next step
7. Apply persona-adjusted weights when computing matchScore
8. Map JD skills to skillCoverage (8-12 skills)
9. opportunityRanking: ONE item per weakness (same count as weaknesses). For each:
   - title: action-oriented improvement name
   - weakness: copy the corresponding weakness text
   - impact: 1-5 (5 = highest impact on role match)
   - effort: 1-5 (1 = lowest modification cost)
   - priority: high | medium | low — prioritize high impact + low effort combinations
   - expectedOutcome: specific benefit (e.g. match score lift, skill coverage, persona concern resolved)
   Order items so quick wins (high impact, low effort) appear first.
10. consensusConflict: Simulate ALL four reviewer personas (hr_reviewer, design_lead, ai_product_lead, design_engineer) reviewing the same portfolio:
    - consensus: 3-5 capabilities every persona would agree on (short labels + one-sentence detail)
    - conflicts: 3-5 topics where personas diverge — each topic has viewpoints from at least 2 different personas with contrasting assessments
    This section is cross-persona and should NOT change based on meta.reviewerPersona.
11. gapAnalysis: 3-5 items ranked by impact from persona lens
12. actionPlan: 4-6 prioritized steps aligned with opportunityRanking and evidenceInsights
13. If portfolio text is sparse, set evidenceConfidence to "low"
${getLanguageInstruction(locale)}`
}

export function buildUserPrompt(
  portfolioText: string,
  jobDescription: string,
  meta: { fileName: string; pageCount: number }
): string {
  return `## Job Description
${jobDescription}

## Portfolio Metadata
- File: ${meta.fileName}
- Pages: ${meta.pageCount}

## Portfolio Content (extracted from PDF)
${portfolioText || "[No text could be extracted from this PDF — it may be image-only. Base your review on metadata and note this limitation explicitly.]"}`
}

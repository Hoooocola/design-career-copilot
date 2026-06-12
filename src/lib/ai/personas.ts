import type { ReviewerPersona } from "@/types/reviewer"
import type { DimensionId } from "@/types/framework"

export interface PersonaProfile {
  id: ReviewerPersona
  title: string
  lens: string
  focusDimensions: DimensionId[]
  deemphasizedDimensions: DimensionId[]
  weightAdjustments: Partial<Record<DimensionId, number>>
}

export const REVIEWER_PERSONAS: Record<ReviewerPersona, PersonaProfile> = {
  hr_reviewer: {
    id: "hr_reviewer",
    title: "HR Reviewer",
    lens: "Evaluates portfolio clarity, communication, professionalism, and role fit signals. Less focused on deep craft or technical implementation.",
    focusDimensions: [
      "portfolio_presentation",
      "collaboration_communication",
      "process_storytelling",
      "impact_outcomes",
    ],
    deemphasizedDimensions: [
      "technical_fluency_implementation",
      "systems_thinking_scalability",
    ],
    weightAdjustments: {
      portfolio_presentation: 0.18,
      collaboration_communication: 0.16,
      process_storytelling: 0.14,
      impact_outcomes: 0.12,
      technical_fluency_implementation: 0.04,
      ai_product_sense: 0.06,
    },
  },
  design_lead: {
    id: "design_lead",
    title: "Design Lead",
    lens: "Holistic design leadership review — problem framing, craft, process, systems thinking, and measurable impact. The default senior design hiring lens.",
    focusDimensions: [
      "problem_framing_strategy",
      "interaction_ux_design",
      "impact_outcomes",
      "systems_thinking_scalability",
      "process_storytelling",
    ],
    deemphasizedDimensions: [],
    weightAdjustments: {
      problem_framing_strategy: 0.14,
      interaction_ux_design: 0.14,
      impact_outcomes: 0.12,
      systems_thinking_scalability: 0.12,
      visual_craft_quality: 0.1,
    },
  },
  ai_product_lead: {
    id: "ai_product_lead",
    title: "AI Product Lead",
    lens: "Probes AI product sense, trust/calibration UX, human-AI collaboration patterns, and whether AI is justified as the right solution.",
    focusDimensions: [
      "ai_product_sense",
      "problem_framing_strategy",
      "interaction_ux_design",
      "impact_outcomes",
      "user_research_discovery",
    ],
    deemphasizedDimensions: ["visual_craft_quality"],
    weightAdjustments: {
      ai_product_sense: 0.22,
      problem_framing_strategy: 0.14,
      interaction_ux_design: 0.14,
      impact_outcomes: 0.12,
      user_research_discovery: 0.1,
      visual_craft_quality: 0.04,
    },
  },
  design_engineer: {
    id: "design_engineer",
    title: "Design Engineer",
    lens: "Evaluates implementation fluency, design-to-code fidelity, component architecture, and whether the designer can ship production-quality AI interfaces.",
    focusDimensions: [
      "technical_fluency_implementation",
      "systems_thinking_scalability",
      "interaction_ux_design",
      "visual_craft_quality",
    ],
    deemphasizedDimensions: ["portfolio_presentation"],
    weightAdjustments: {
      technical_fluency_implementation: 0.22,
      systems_thinking_scalability: 0.18,
      interaction_ux_design: 0.14,
      visual_craft_quality: 0.1,
      portfolio_presentation: 0.03,
    },
  },
}

export function getPersonaPromptBlock(persona: ReviewerPersona): string {
  const p = REVIEWER_PERSONAS[persona]
  return `## Reviewer Persona: ${p.title}
Lens: ${p.lens}
Prioritize dimensions: ${p.focusDimensions.join(", ")}
De-emphasize: ${p.deemphasizedDimensions.join(", ") || "none"}
Weight adjustments: ${JSON.stringify(p.weightAdjustments)}

Write the review AS this persona would in a hiring debrief. The executiveSummary, reviewerVerdict, strengths, weaknesses, and evidenceInsights must reflect this persona's priorities and language.`
}

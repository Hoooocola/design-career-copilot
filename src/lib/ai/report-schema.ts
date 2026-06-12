const dimensionIdEnum = [
  "problem_framing_strategy",
  "user_research_discovery",
  "interaction_ux_design",
  "visual_craft_quality",
  "systems_thinking_scalability",
  "technical_fluency_implementation",
  "collaboration_communication",
  "impact_outcomes",
  "ai_product_sense",
  "process_storytelling",
  "portfolio_presentation",
] as const

const scoreLabelEnum = [
  "not_evident",
  "emerging",
  "competent",
  "strong",
  "exceptional",
] as const

const evidenceTypeEnum = ["primary", "secondary", "inferred", "absent"] as const

const reviewerPersonaEnum = [
  "hr_reviewer",
  "design_lead",
  "ai_product_lead",
  "design_engineer",
] as const

export const PORTFOLIO_REPORT_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    executiveSummary: {
      type: "string" as const,
      description:
        "3-5 sentence summary from the reviewer persona's perspective.",
    },
    matchScore: {
      type: "integer" as const,
      description: "Weighted match score 0-100 using persona-adjusted dimension weights.",
    },
    competencyOverview: {
      type: "object" as const,
      properties: {
        overallReadiness: {
          type: "integer" as const,
          description: "0-100 readiness score for the target role from this persona.",
        },
        topStrengths: {
          type: "array" as const,
          items: { type: "string" as const },
          description: "2-3 standout strengths this persona values most.",
        },
        criticalGaps: {
          type: "array" as const,
          items: { type: "string" as const },
          description: "2-3 critical gaps this persona would flag.",
        },
        reviewerVerdict: {
          type: "string" as const,
          description: "1-2 sentence hire/no-hire style verdict from this persona.",
        },
      },
      required: [
        "overallReadiness",
        "topStrengths",
        "criticalGaps",
        "reviewerVerdict",
      ],
      additionalProperties: false,
    },
    dimensionScores: {
      type: "array" as const,
      description: "Score all 11 rubric dimensions 1-5.",
      items: {
        type: "object" as const,
        properties: {
          dimensionId: { type: "string" as const, enum: dimensionIdEnum },
          score: { type: "integer" as const, description: "1-5" },
          label: { type: "string" as const, enum: scoreLabelEnum },
        },
        required: ["dimensionId", "score", "label"],
        additionalProperties: false,
      },
    },
    evidenceInsights: {
      type: "array" as const,
      description:
        "6-8 evidence-based insights tied to dimensions. Each must cite portfolio evidence.",
      items: {
        type: "object" as const,
        properties: {
          dimensionId: { type: "string" as const, enum: dimensionIdEnum },
          insight: {
            type: "string" as const,
            description: "What this persona observes about this dimension.",
          },
          evidence: {
            type: "string" as const,
            description: "Specific quote, artifact, or absence cited from portfolio.",
          },
          evidenceType: { type: "string" as const, enum: evidenceTypeEnum },
          recommendation: {
            type: "string" as const,
            description: "Actionable recommendation for this dimension.",
          },
        },
        required: [
          "dimensionId",
          "insight",
          "evidence",
          "evidenceType",
          "recommendation",
        ],
        additionalProperties: false,
      },
    },
    skillCoverage: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          skill: { type: "string" as const },
          required: { type: "boolean" as const },
          demonstrated: { type: "boolean" as const },
          level: {
            type: "string" as const,
            enum: ["strong", "partial", "missing"],
          },
        },
        required: ["skill", "required", "demonstrated", "level"],
        additionalProperties: false,
      },
    },
    strengths: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    weaknesses: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    opportunityRanking: {
      type: "array" as const,
      description:
        "One opportunity per weakness. Rank by high impact + low effort. Each maps a weakness to a concrete portfolio improvement.",
      items: {
        type: "object" as const,
        properties: {
          title: {
            type: "string" as const,
            description: "Action-oriented title, e.g. Improve AI Workflow Visibility",
          },
          weakness: {
            type: "string" as const,
            description: "The source weakness this opportunity addresses",
          },
          impact: {
            type: "integer" as const,
            description: "Impact on role match if fixed, 1-5 stars (5 = highest)",
          },
          effort: {
            type: "integer" as const,
            description: "Estimated effort to fix, 1-5 stars (1 = lowest cost)",
          },
          priority: {
            type: "string" as const,
            enum: ["high", "medium", "low"],
            description: "Overall priority — favor high impact + low effort",
          },
          expectedOutcome: {
            type: "string" as const,
            description:
              "Concrete expected benefit, e.g. Increase AI Product Designer role match score",
          },
        },
        required: [
          "title",
          "weakness",
          "impact",
          "effort",
          "priority",
          "expectedOutcome",
        ],
        additionalProperties: false,
      },
    },
    consensusConflict: {
      type: "object" as const,
      description:
        "Cross-persona analysis simulating all 4 reviewer lenses. Independent of the active reviewerPersona.",
      properties: {
        consensus: {
          type: "array" as const,
          description:
            "3-5 capabilities ALL four personas (HR, Design Lead, AI Product Lead, Design Engineer) would agree on.",
          items: {
            type: "object" as const,
            properties: {
              capability: {
                type: "string" as const,
                description: "Short label, e.g. Strong Research",
              },
              detail: {
                type: "string" as const,
                description: "One sentence on why all reviewers align",
              },
            },
            required: ["capability", "detail"],
            additionalProperties: false,
          },
        },
        conflicts: {
          type: "array" as const,
          description:
            "3-5 topics where reviewer personas disagree. Each must include at least 2 different personas.",
          items: {
            type: "object" as const,
            properties: {
              topic: {
                type: "string" as const,
                description: "Area of disagreement, e.g. AI Product Readiness",
              },
              viewpoints: {
                type: "array" as const,
                items: {
                  type: "object" as const,
                  properties: {
                    persona: {
                      type: "string" as const,
                      enum: reviewerPersonaEnum,
                    },
                    viewpoint: {
                      type: "string" as const,
                      description: "This persona's contrasting assessment",
                    },
                  },
                  required: ["persona", "viewpoint"],
                  additionalProperties: false,
                },
              },
            },
            required: ["topic", "viewpoints"],
            additionalProperties: false,
          },
        },
      },
      required: ["consensus", "conflicts"],
      additionalProperties: false,
    },
    gapAnalysis: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          area: { type: "string" as const },
          impact: {
            type: "string" as const,
            enum: ["high", "medium", "low"],
          },
          description: { type: "string" as const },
        },
        required: ["area", "impact", "description"],
        additionalProperties: false,
      },
    },
    actionPlan: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          priority: { type: "integer" as const },
          title: { type: "string" as const },
          description: { type: "string" as const },
          timeframe: { type: "string" as const },
        },
        required: ["priority", "title", "description", "timeframe"],
        additionalProperties: false,
      },
    },
    meta: {
      type: "object" as const,
      properties: {
        targetRole: {
          type: "string" as const,
          enum: [
            "ai_product_designer",
            "ai_ux_designer",
            "design_engineer",
          ],
        },
        seniority: {
          type: "string" as const,
          enum: ["junior", "mid", "senior", "staff"],
        },
        recommendationTier: {
          type: "string" as const,
          enum: ["strong_yes", "yes", "mixed", "no"],
        },
        evidenceConfidence: {
          type: "string" as const,
          enum: ["high", "medium", "low"],
        },
        reviewerPersona: {
          type: "string" as const,
          enum: reviewerPersonaEnum,
        },
      },
      required: [
        "targetRole",
        "seniority",
        "recommendationTier",
        "evidenceConfidence",
        "reviewerPersona",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "executiveSummary",
    "matchScore",
    "competencyOverview",
    "dimensionScores",
    "evidenceInsights",
    "skillCoverage",
    "strengths",
    "weaknesses",
    "opportunityRanking",
    "consensusConflict",
    "gapAnalysis",
    "actionPlan",
    "meta",
  ],
  additionalProperties: false,
}

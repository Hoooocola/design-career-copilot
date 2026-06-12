import type { Locale } from "@/lib/i18n"
import {
  getMockFramework,
  getPersonaMatchScore,
} from "@/lib/mock-framework"
import { buildImprovementRoadmap } from "@/lib/ai/build-improvement-roadmap"
import { buildReviewTrace } from "@/lib/ai/build-review-trace"
import { getMockBenchmark } from "@/lib/mock-benchmark"
import { getMockConsensusConflict } from "@/lib/mock-consensus-conflict"
import { getMockOpportunityRanking } from "@/lib/mock-opportunities"
import { MOCK_REPORT_ZH } from "@/lib/mock-report.zh"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import type { ApplicableRole, RecommendationTier, EvidenceConfidence } from "@/types/rubric"

export const MOCK_REPORT_EN: Omit<
  PortfolioReport,
  | "framework"
  | "opportunityRanking"
  | "consensusConflict"
  | "benchmark"
  | "improvementRoadmap"
  | "reviewTrace"
> = {
  executiveSummary:
    "Your portfolio demonstrates strong visual craft and end-to-end product thinking, with clear case studies that show measurable impact. However, the work skews toward visual execution rather than strategic systems thinking expected at the senior level. Strengthening research methodology documentation and cross-functional collaboration signals would significantly improve alignment with this role.",
  matchScore: 72,
  skillCoverage: [
    { skill: "UI Design", required: true, demonstrated: true, level: "strong" },
    { skill: "Design Systems", required: true, demonstrated: true, level: "partial" },
    { skill: "User Research", required: true, demonstrated: true, level: "partial" },
    { skill: "Prototyping", required: true, demonstrated: true, level: "strong" },
    { skill: "Stakeholder Management", required: true, demonstrated: false, level: "missing" },
    { skill: "Data-Informed Design", required: true, demonstrated: true, level: "partial" },
    { skill: "Accessibility", required: false, demonstrated: true, level: "strong" },
    { skill: "Motion Design", required: false, demonstrated: false, level: "missing" },
  ],
  strengths: [
    "Polished visual presentation with consistent typography and layout hierarchy",
    "Case studies include before/after states and clear problem framing",
    "Strong evidence of iterative design process with multiple exploration rounds",
    "Metrics and outcomes are cited in 3 of 4 featured projects",
  ],
  weaknesses: [
    "Limited documentation of user research methods and synthesis",
    "No examples of design system contribution or component library work",
    "Collaboration with engineering and PM teams is not clearly articulated",
    "Portfolio narrative focuses on aesthetics over business strategy",
  ],
  gapAnalysis: [
    {
      area: "Research Rigor",
      impact: "high",
      description:
        "The role requires leading discovery sessions and synthesizing insights. Your portfolio shows research outputs but not the methodology or decision-making process.",
    },
    {
      area: "Systems Thinking",
      impact: "high",
      description:
        "Senior designers are expected to scale patterns across products. Add a case study demonstrating component architecture or design token decisions.",
    },
    {
      area: "Cross-Functional Leadership",
      impact: "medium",
      description:
        "Stakeholder alignment and roadmap influence are key requirements. Include artifacts like workshop facilitation or prioritization frameworks.",
    },
    {
      area: "Domain Expertise",
      impact: "low",
      description:
        "The role is in fintech; your portfolio is primarily consumer social. A targeted side project could bridge this gap quickly.",
    },
  ],
  actionPlan: [
    {
      priority: 1,
      title: "Add a research-led case study",
      description:
        "Document one project with full discovery process: interview guides, affinity mapping, and how insights shaped the final design.",
      timeframe: "1–2 weeks",
    },
    {
      priority: 2,
      title: "Highlight design system contributions",
      description:
        "Create a dedicated section showing component specs, token decisions, and how your work scaled across the product.",
      timeframe: "1 week",
    },
    {
      priority: 3,
      title: "Reframe project narratives for impact",
      description:
        "Lead each case study with business context and your strategic role, not just the visual outcome.",
      timeframe: "3–5 days",
    },
    {
      priority: 4,
      title: "Build a fintech micro-project",
      description:
        "Design a focused flow (e.g., onboarding or dashboard) for a financial product to demonstrate domain relevance.",
      timeframe: "1 week",
    },
  ],
}

/** @deprecated Use getMockReport(locale) */
export const MOCK_REPORT = MOCK_REPORT_EN

export interface MockReportMeta {
  targetRole: ApplicableRole
  seniority: "junior" | "mid" | "senior" | "staff"
  recommendationTier: RecommendationTier
  evidenceConfidence: EvidenceConfidence
  source: "mock"
  locale: Locale
  reviewerPersona: ReviewerPersona
}

const PERSONA_SUMMARY_EN: Record<ReviewerPersona, string> = {
  hr_reviewer:
    "From an HR screening lens, this portfolio communicates clearly and presents a professional, hireable image. Case studies are accessible to non-designers. The primary concern is insufficient framing of cross-functional impact and team contribution — strengthen these for the next recruiting stage.",
  design_lead:
    "Your portfolio demonstrates strong visual craft and end-to-end product thinking, with clear case studies that show measurable impact. However, the work skews toward visual execution rather than strategic systems thinking expected at the senior level. Strengthening research methodology documentation and cross-functional collaboration signals would significantly improve alignment with this role.",
  ai_product_lead:
    "As an AI Product Lead, I see solid general product design fundamentals but no credible AI product work. There is no evidence of designing for probabilistic outputs, trust calibration, or human-AI collaboration. This portfolio would not pass an AI product design bar without a dedicated AI case study.",
  design_engineer:
    "This portfolio showcases strong visual and interaction design at mock fidelity, but fails the design engineer bar. There are no code repositories, live demos, component architectures, or implementation artifacts. The candidate reads as a visual/product designer, not someone who can ship production UI.",
}

const PERSONA_SUMMARY_ZH: Record<ReviewerPersona, string> = {
  hr_reviewer:
    "从 HR 筛选视角看，这份作品集沟通清晰、呈现专业，案例对非设计背景面试官友好。主要不足是跨职能影响力与个人贡献边界不够明确，建议在下一轮招聘中强化这两点。",
  design_lead:
    "你的作品集展现出扎实的视觉功底与端到端产品思维，案例研究清晰且能量化呈现影响力。但整体上更偏重视觉执行，而高级岗位所要求的战略性系统思维体现不足。若加强研究方法论文档化与跨职能协作信号，将显著提升匹配度。",
  ai_product_lead:
    "以 AI 产品负责人视角，我看到扎实的通用产品设计基础，但缺乏可信的 AI 产品工作证据。未体现针对概率式输出、信任校准或人机协作的设计能力。若无独立 AI 案例，难以通过 AI 产品设计岗位标准。",
  design_engineer:
    "作品集在高保真视觉与交互层面表现良好，但未达到设计工程师标准。缺少代码仓库、在线 Demo、组件架构与实现产物，候选人更像视觉/产品设计师，而非能交付生产级界面的构建者。",
}

export function getMockReport(
  locale: Locale,
  persona: ReviewerPersona = "design_lead"
) {
  const base = locale === "zh" ? MOCK_REPORT_ZH : MOCK_REPORT_EN
  const framework = getMockFramework(persona, locale)
  const summary =
    locale === "zh" ? PERSONA_SUMMARY_ZH[persona] : PERSONA_SUMMARY_EN[persona]

  const report = {
    ...base,
    executiveSummary: summary,
    matchScore: getPersonaMatchScore(persona),
    opportunityRanking: getMockOpportunityRanking(persona, locale),
    consensusConflict: getMockConsensusConflict(locale),
    benchmark: getMockBenchmark(locale),
    framework,
    meta: {
      targetRole: "ai_product_designer" as const,
      seniority: "senior" as const,
      recommendationTier: (persona === "ai_product_lead" || persona === "design_engineer"
        ? "mixed"
        : "yes") as RecommendationTier,
      evidenceConfidence: "low" as const,
      source: "mock" as const,
      locale,
      reviewerPersona: persona,
    },
  }

  return {
    ...report,
    improvementRoadmap: buildImprovementRoadmap(report, locale, persona),
    reviewTrace: buildReviewTrace(report, locale, persona),
  }
}

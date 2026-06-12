import { buildReviewFramework } from "@/lib/ai/build-framework"
import { computeCategoryBreakdown, scoreToLabel } from "@/lib/framework/categories"
import type { Locale } from "@/lib/i18n"
import type {
  CompetencyOverview,
  DimensionId,
  EvidenceInsight,
} from "@/types/framework"
import type { ReviewerPersona } from "@/types/reviewer"

const BASE_DIMENSION_SCORES: Record<DimensionId, number> = {
  problem_framing_strategy: 4,
  user_research_discovery: 3,
  interaction_ux_design: 4,
  visual_craft_quality: 4,
  systems_thinking_scalability: 3,
  technical_fluency_implementation: 2,
  collaboration_communication: 3,
  impact_outcomes: 4,
  ai_product_sense: 3,
  process_storytelling: 4,
  portfolio_presentation: 4,
}

const PERSONA_SCORE_DELTA: Record<
  ReviewerPersona,
  Partial<Record<DimensionId, number>>
> = {
  hr_reviewer: {
    portfolio_presentation: 1,
    collaboration_communication: 1,
    process_storytelling: 1,
    technical_fluency_implementation: -1,
    ai_product_sense: -1,
    systems_thinking_scalability: -1,
  },
  design_lead: {},
  ai_product_lead: {
    ai_product_sense: -1,
    problem_framing_strategy: 0,
    technical_fluency_implementation: -1,
    interaction_ux_design: 0,
    visual_craft_quality: -1,
  },
  design_engineer: {
    technical_fluency_implementation: -2,
    systems_thinking_scalability: -1,
    portfolio_presentation: -1,
    visual_craft_quality: 0,
    interaction_ux_design: 0,
  },
}

function clampScore(score: number) {
  return Math.min(5, Math.max(1, score))
}

function getDimensionScores(persona: ReviewerPersona) {
  const deltas = PERSONA_SCORE_DELTA[persona]
  return (Object.keys(BASE_DIMENSION_SCORES) as DimensionId[]).map(
    (dimensionId) => {
      const score = clampScore(
        BASE_DIMENSION_SCORES[dimensionId] + (deltas[dimensionId] ?? 0)
      )
      return { dimensionId, score, label: scoreToLabel(score) }
    }
  )
}

const OVERVIEW_EN: Record<ReviewerPersona, CompetencyOverview> = {
  hr_reviewer: {
    overallReadiness: 68,
    topStrengths: [
      "Clear, scannable portfolio structure with professional presentation",
      "Case study narratives are concise and easy to follow for non-designers",
    ],
    criticalGaps: [
      "Limited articulation of cross-functional collaboration and team role",
      "Business impact metrics lack context for hiring managers",
    ],
    reviewerVerdict:
      "Presentable candidate with strong communication signals. Would advance to design interview but needs sharper impact framing for HR screen.",
  },
  design_lead: {
    overallReadiness: 72,
    topStrengths: [
      "Strong visual craft with clear problem framing in case studies",
      "Evidence of iterative design process across multiple projects",
    ],
    criticalGaps: [
      "Research methodology not documented deeply enough for senior bar",
      "Systems thinking and design system contributions underrepresented",
    ],
    reviewerVerdict:
      "Solid mid-to-senior portfolio with craft strengths. Would interview with focus on strategic thinking and research depth.",
  },
  ai_product_lead: {
    overallReadiness: 58,
    topStrengths: [
      "Product thinking visible in case study structure and outcome framing",
      "Some awareness of user needs in problem statements",
    ],
    criticalGaps: [
      "No evidence of AI-specific UX: error states, trust, or probabilistic output handling",
      "AI not justified as solution approach in any featured project",
    ],
    reviewerVerdict:
      "Not ready for AI product design role as presented. Strong generalist foundation but missing AI product sense entirely.",
  },
  design_engineer: {
    overallReadiness: 54,
    topStrengths: [
      "High visual fidelity in final UI deliverables",
      "Interaction flows are complete with multiple states shown",
    ],
    criticalGaps: [
      "No code, live prototypes, or component architecture evidence",
      "Design system contribution not demonstrated at implementation level",
    ],
    reviewerVerdict:
      "Visual designer profile, not design engineer. Would not pass technical bar without shipped code or build artifacts.",
  },
}

const OVERVIEW_ZH: Record<ReviewerPersona, CompetencyOverview> = {
  hr_reviewer: {
    overallReadiness: 68,
    topStrengths: [
      "作品集结构清晰、专业度高，非设计背景面试官也能快速理解",
      "案例叙事简洁，职级与贡献描述相对清楚",
    ],
    criticalGaps: [
      "跨职能协作与个人角色边界表述不足",
      "业务影响力指标缺少 HR 可理解的上下文",
    ],
    reviewerVerdict:
      "沟通与呈现达线，可进入设计面试环节。建议在简历与作品集摘要中强化影响力叙事。",
  },
  design_lead: {
    overallReadiness: 72,
    topStrengths: [
      "视觉工艺扎实，案例问题定义清晰",
      "多个项目展示了完整的迭代设计过程",
    ],
    criticalGaps: [
      "研究方法论文档深度未达高级设计师标准",
      "系统思维与设计系统贡献体现不足",
    ],
    reviewerVerdict:
      "中高级作品集，工艺突出。建议面试重点考察战略思维与研究深度。",
  },
  ai_product_lead: {
    overallReadiness: 58,
    topStrengths: [
      "案例结构体现产品思维，有成果导向叙事",
      "问题陈述中可见一定的用户需求意识",
    ],
    criticalGaps: [
      "无 AI 专属体验设计证据：错误处理、信任校准、概率输出等",
      "未论证 AI 作为解决方案的合理性",
    ],
    reviewerVerdict:
      "以当前作品集不足以胜任 AI 产品设计岗位。通用设计基础尚可，但 AI 产品感明显缺失。",
  },
  design_engineer: {
    overallReadiness: 54,
    topStrengths: [
      "最终界面视觉完成度高",
      "交互流程较完整，包含多种状态",
    ],
    criticalGaps: [
      "无代码、可交互原型或组件架构证据",
      "未展示实现层面的设计系统贡献",
    ],
    reviewerVerdict:
      "更偏向视觉设计师而非设计工程师。缺少可验证的交付与工程协作证据。",
  },
}

const INSIGHTS_EN: Record<ReviewerPersona, EvidenceInsight[]> = {
  hr_reviewer: [
    {
      dimensionId: "portfolio_presentation",
      insight: "Portfolio is well-curated and respects reviewer time.",
      evidence:
        "Primary — 4 focused case studies with clear section headers and scannable layout across 24 pages.",
      evidenceType: "primary",
      recommendation:
        "Add a one-paragraph executive summary on the first page stating target role and strongest project.",
    },
    {
      dimensionId: "collaboration_communication",
      insight: "Team collaboration is mentioned but not evidenced.",
      evidence:
        "Absent — no team credits, workshop artifacts, or 'my role vs. team' framing in case studies.",
      evidenceType: "absent",
      recommendation:
        "Add a collaboration section per project naming PM, engineering, and research partners.",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "Metrics are cited but lack hiring-manager context.",
      evidence:
        "Secondary — '40% increase in engagement' stated in Project 2 without baseline or timeframe.",
      evidenceType: "secondary",
      recommendation:
        "Frame metrics with before/after baseline and business owner validation.",
    },
    {
      dimensionId: "process_storytelling",
      insight: "Process narrative is accessible to non-designers.",
      evidence:
        "Primary — each case follows Context → Process → Outcome structure with plain language.",
      evidenceType: "primary",
      recommendation: "Keep this structure; add timeline and team size for HR context.",
    },
    {
      dimensionId: "technical_fluency_implementation",
      insight: "Technical depth is not a hiring signal at this stage.",
      evidence: "Inferred — image-only deliverables, no engineering collaboration artifacts.",
      evidenceType: "inferred",
      recommendation: "Not critical for HR screen; defer to design panel.",
    },
    {
      dimensionId: "ai_product_sense",
      insight: "No AI project experience surfaced.",
      evidence: "Absent — no AI, ML, or copilot-related case studies in portfolio.",
      evidenceType: "absent",
      recommendation: "Clarify AI interest in cover letter if targeting AI roles.",
    },
  ],
  design_lead: [
    {
      dimensionId: "problem_framing_strategy",
      insight: "Problems are well-bounded and user-centered.",
      evidence:
        "Primary — Project 1 opens with specific user pain and scope boundaries before showing solutions.",
      evidenceType: "primary",
      recommendation: "Add rejected directions to demonstrate strategic tradeoffs.",
    },
    {
      dimensionId: "visual_craft_quality",
      insight: "Visual hierarchy supports task completion.",
      evidence:
        "Primary — consistent typographic scale and spacing rhythm across all featured screens.",
      evidenceType: "primary",
      recommendation: "Show typographic system decisions, not only final polish.",
    },
    {
      dimensionId: "user_research_discovery",
      insight: "Research influences design but methodology is thin.",
      evidence:
        "Secondary — user quotes appear in Project 3 but no interview guides or synthesis artifacts.",
      evidenceType: "secondary",
      recommendation: "Document one full discovery cycle with affinity mapping.",
    },
    {
      dimensionId: "systems_thinking_scalability",
      insight: "One-off screens dominate; system thinking is limited.",
      evidence:
        "Absent — no component specs, pattern library, or token documentation.",
      evidenceType: "absent",
      recommendation: "Add a design system contribution case or component architecture page.",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "Outcomes are present in most projects.",
      evidence:
        "Primary — metrics cited in 3 of 4 projects with before/after framing in 2.",
      evidenceType: "primary",
      recommendation: "Tie each metric directly to a specific design decision.",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "End-to-end flows are documented with edge cases.",
      evidence:
        "Primary — Project 2 shows happy path plus error, empty, and loading states.",
      evidenceType: "primary",
      recommendation: "Extend edge-case coverage to all featured projects.",
    },
  ],
  ai_product_lead: [
    {
      dimensionId: "ai_product_sense",
      insight: "No credible AI product design evidence.",
      evidence:
        "Absent — portfolio contains zero AI features, copilot flows, or probabilistic UX patterns.",
      evidenceType: "absent",
      recommendation:
        "Build a dedicated AI case study covering trust, error recovery, and human-in-the-loop design.",
    },
    {
      dimensionId: "problem_framing_strategy",
      insight: "Problem framing is product-aware but not AI-aware.",
      evidence:
        "Primary — problems are well-scoped for traditional product work in Projects 1-3.",
      evidenceType: "primary",
      recommendation:
        "For AI roles, add 'why AI vs. deterministic solution' analysis to at least one project.",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "Interaction patterns are solid for conventional UI.",
      evidence:
        "Primary — multi-step flows with clear IA in Project 2.",
      evidenceType: "primary",
      recommendation:
        "Prototype an AI interaction pattern beyond chat: streaming, confidence, edit-before-apply.",
    },
    {
      dimensionId: "user_research_discovery",
      insight: "No research on AI user mental models.",
      evidence:
        "Absent — no trust calibration, expectation-setting, or AI failure recovery studies.",
      evidenceType: "absent",
      recommendation: "Conduct and document a study on how users perceive AI-assisted outputs.",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "Traditional product metrics shown; no AI-specific outcomes.",
      evidence:
        "Secondary — engagement and conversion metrics only; no acceptance rate or edit/regenerate rates.",
      evidenceType: "secondary",
      recommendation: "If adding AI work, measure task success with AI assist, not just model accuracy.",
    },
    {
      dimensionId: "technical_fluency_implementation",
      insight: "Limited signals of AI system awareness.",
      evidence:
        "Inferred — no mention of latency, token limits, or model constraints in any case study.",
      evidenceType: "inferred",
      recommendation: "Reference API/latency tradeoffs in AI UX decisions.",
    },
  ],
  design_engineer: [
    {
      dimensionId: "technical_fluency_implementation",
      insight: "No implementation artifacts — critical gap for this role.",
      evidence:
        "Absent — portfolio is image-only; no GitHub, Storybook, CodePen, or live demo links.",
      evidenceType: "absent",
      recommendation:
        "Add 1-2 projects with shipped code, component source, and responsive implementation notes.",
    },
    {
      dimensionId: "systems_thinking_scalability",
      insight: "Component-level thinking not demonstrated.",
      evidence:
        "Absent — each screen appears custom; no variant states or reusable pattern documentation.",
      evidenceType: "absent",
      recommendation: "Document a component library with props, states, and token bindings.",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "Interaction design is strong at mock fidelity.",
      evidence:
        "Primary — detailed flows with microinteraction notes in Project 2 Figma file.",
      evidenceType: "primary",
      recommendation: "Ship one flow as interactive code to prove buildability.",
    },
    {
      dimensionId: "visual_craft_quality",
      insight: "Visual craft translates well to implementation.",
      evidence:
        "Primary — precise spacing values and typographic specs annotated in Project 1.",
      evidenceType: "primary",
      recommendation: "Show CSS/token implementation matching these specs.",
    },
    {
      dimensionId: "ai_product_sense",
      insight: "No dynamic AI UI implementation experience.",
      evidence:
        "Absent — no streaming UI, skeleton states for async AI, or real-time update patterns.",
      evidenceType: "absent",
      recommendation: "Build a coded prototype of streaming AI response UI with error boundaries.",
    },
    {
      dimensionId: "portfolio_presentation",
      insight: "Portfolio reads as designer, not builder.",
      evidence:
        "Primary — all projects presented as static PDF pages without build links.",
      evidenceType: "primary",
      recommendation: "Restructure portfolio to lead with live demos and repo links.",
    },
  ],
}

const INSIGHTS_ZH: Record<ReviewerPersona, EvidenceInsight[]> = {
  hr_reviewer: [
    {
      dimensionId: "portfolio_presentation",
      insight: "作品集策展专业，尊重面试官阅读时间。",
      evidence: "主要证据 — 4 个聚焦案例，章节清晰，24 页内结构可扫读。",
      evidenceType: "primary",
      recommendation: "首页增加一段执行摘要，说明目标岗位与最强项目。",
    },
    {
      dimensionId: "collaboration_communication",
      insight: "提及协作但缺少可验证证据。",
      evidence: "缺失 — 无团队署名、工作坊记录或「我的角色」说明。",
      evidenceType: "absent",
      recommendation: "每个项目补充与 PM、工程、研究的协作说明。",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "有数据但 HR 难以理解业务背景。",
      evidence: "次要证据 — 项目 2 称「互动提升 40%」，未给基线与时间范围。",
      evidenceType: "secondary",
      recommendation: "用前后对比基线呈现指标，并标注业务负责人验证。",
    },
    {
      dimensionId: "process_storytelling",
      insight: "过程叙事对非设计背景读者友好。",
      evidence: "主要证据 — 案例统一采用背景→过程→成果结构，语言平实。",
      evidenceType: "primary",
      recommendation: "保持该结构，补充时间线与团队规模信息。",
    },
    {
      dimensionId: "technical_fluency_implementation",
      insight: "HR 阶段不考察技术深度。",
      evidence: "推断 — 纯图片交付物，无工程协作产物。",
      evidenceType: "inferred",
      recommendation: "HR 筛选非关键项，留给设计面试环节。",
    },
    {
      dimensionId: "ai_product_sense",
      insight: "未体现 AI 项目经验。",
      evidence: "缺失 — 无 AI/ML/Copilot 相关案例。",
      evidenceType: "absent",
      recommendation: "若投递 AI 岗位，应在求职信中说明相关意向与准备。",
    },
  ],
  design_lead: [
    {
      dimensionId: "problem_framing_strategy",
      insight: "问题定义清晰且有用户中心视角。",
      evidence: "主要证据 — 项目 1 在展示方案前先界定用户痛点与范围。",
      evidenceType: "primary",
      recommendation: "补充被拒绝的方向，展示战略取舍能力。",
    },
    {
      dimensionId: "visual_craft_quality",
      insight: "视觉层级有效支撑任务完成。",
      evidence: "主要证据 — 所有项目界面保持一致的字体层级与间距节奏。",
      evidenceType: "primary",
      recommendation: "展示字体系统决策过程，而非仅最终稿。",
    },
    {
      dimensionId: "user_research_discovery",
      insight: "研究影响了设计，但方法论文档偏薄。",
      evidence: "次要证据 — 项目 3 有用户引述，但无访谈提纲或合成产物。",
      evidenceType: "secondary",
      recommendation: "完整记录一次探索周期，含亲和图等合成方法。",
    },
    {
      dimensionId: "systems_thinking_scalability",
      insight: "多为单页设计，系统思维有限。",
      evidence: "缺失 — 无组件规范、模式库或 Token 文档。",
      evidenceType: "absent",
      recommendation: "增加设计系统贡献案例或组件架构专页。",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "多数项目有成果呈现。",
      evidence: "主要证据 — 4 个项目中 3 个引用指标，2 个有前后对比。",
      evidenceType: "primary",
      recommendation: "将每项指标与具体设计决策建立因果链。",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "端到端流程完整，含边界状态。",
      evidence: "主要证据 — 项目 2 展示主路径及错误、空态、加载状态。",
      evidenceType: "primary",
      recommendation: "将边界状态覆盖扩展到所有主打项目。",
    },
  ],
  ai_product_lead: [
    {
      dimensionId: "ai_product_sense",
      insight: "缺乏可信的 AI 产品设计证据。",
      evidence: "缺失 — 作品集无任何 AI 功能、Copilot 流程或概率式 UX 模式。",
      evidenceType: "absent",
      recommendation: "构建独立 AI 案例，覆盖信任、错误恢复与人机协作检查点。",
    },
    {
      dimensionId: "problem_framing_strategy",
      insight: "问题框架有产品意识，但无 AI 视角。",
      evidence: "主要证据 — 项目 1-3 的问题定义适用于传统产品设计。",
      evidenceType: "primary",
      recommendation: "至少一个项目论证「为何用 AI 而非确定性方案」。",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "常规 UI 交互模式扎实。",
      evidence: "主要证据 — 项目 2 多步骤流程与信息架构清晰。",
      evidenceType: "primary",
      recommendation: "原型化非聊天式 AI 交互：流式输出、置信度、应用前编辑。",
    },
    {
      dimensionId: "user_research_discovery",
      insight: "未研究用户对 AI 的心智模型。",
      evidence: "缺失 — 无信任校准、预期管理或 AI 失败恢复相关研究。",
      evidenceType: "absent",
      recommendation: "开展并记录用户对 AI 辅助输出感知的研究。",
    },
    {
      dimensionId: "impact_outcomes",
      insight: "仅有传统产品指标，无 AI 专属指标。",
      evidence: "次要证据 — 仅有互动与转化数据，无采纳率或编辑/重生成率。",
      evidenceType: "secondary",
      recommendation: "AI 项目应衡量用户任务成功率，而非仅模型准确率。",
    },
    {
      dimensionId: "technical_fluency_implementation",
      insight: "AI 系统约束意识薄弱。",
      evidence: "推断 — 无延迟、Token 限制或模型能力边界相关说明。",
      evidenceType: "inferred",
      recommendation: "在 AI UX 决策中引用 API/延迟权衡。",
    },
  ],
  design_engineer: [
    {
      dimensionId: "technical_fluency_implementation",
      insight: "无实现产物 — 对该岗位是关键缺口。",
      evidence: "缺失 — 纯图片作品集，无 GitHub/Storybook/在线 Demo 链接。",
      evidenceType: "absent",
      recommendation: "增加 1-2 个含上线代码、组件源码与响应式说明的项目。",
    },
    {
      dimensionId: "systems_thinking_scalability",
      insight: "未展示组件级系统思维。",
      evidence: "缺失 — 每屏独立定制，无可复用模式或变体状态文档。",
      evidenceType: "absent",
      recommendation: "文档化组件库：Props、状态与 Token 绑定关系。",
    },
    {
      dimensionId: "interaction_ux_design",
      insight: "交互设计在高保真阶段表现良好。",
      evidence: "主要证据 — 项目 2 Figma 文件含详细流程与微交互注释。",
      evidenceType: "primary",
      recommendation: "将至少一个流程实现为可交互代码，证明可落地性。",
    },
    {
      dimensionId: "visual_craft_quality",
      insight: "视觉工艺具备可实现性。",
      evidence: "主要证据 — 项目 1 标注精确间距与字体规范。",
      evidenceType: "primary",
      recommendation: "展示与这些规范一致的 CSS/Token 实现。",
    },
    {
      dimensionId: "ai_product_sense",
      insight: "无动态 AI UI 实现经验。",
      evidence: "缺失 — 无流式 UI、AI 异步骨架屏或实时更新模式。",
      evidenceType: "absent",
      recommendation: "用代码实现流式 AI 响应 UI，含错误边界处理。",
    },
    {
      dimensionId: "portfolio_presentation",
      insight: "作品集定位更接近设计师而非构建者。",
      evidence: "主要证据 — 所有项目以静态 PDF 呈现，无构建链接。",
      evidenceType: "primary",
      recommendation: "重构作品集，以在线 Demo 与仓库链接作为首要展示。",
    },
  ],
}

export function getMockFramework(
  persona: ReviewerPersona,
  locale: Locale
) {
  const dimensionScores = getDimensionScores(persona)
  const competencyOverview =
    locale === "zh" ? OVERVIEW_ZH[persona] : OVERVIEW_EN[persona]
  const evidenceInsights =
    locale === "zh" ? INSIGHTS_ZH[persona] : INSIGHTS_EN[persona]

  return buildReviewFramework({
    competencyOverview,
    dimensionScores,
    evidenceInsights,
  })
}

export function getPersonaMatchScore(persona: ReviewerPersona) {
  const scores: Record<ReviewerPersona, number> = {
    hr_reviewer: 68,
    design_lead: 72,
    ai_product_lead: 58,
    design_engineer: 54,
  }
  return scores[persona]
}

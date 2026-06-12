import { normalizeOpportunities } from "@/lib/ai/build-opportunity-ranking"
import type { Locale } from "@/lib/i18n"
import type { OpportunityItem } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

const OPPORTUNITIES_EN: Record<ReviewerPersona, OpportunityItem[]> = {
  hr_reviewer: [
    {
      title: "Clarify Cross-Functional Contribution",
      weakness:
        "Collaboration with engineering and PM teams is not clearly articulated",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Strengthen HR screening signals for teamwork and stakeholder alignment.",
    },
    {
      title: "Lead with Business Context in Case Studies",
      weakness:
        "Portfolio narrative focuses on aesthetics over business strategy",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Improve first-impression role fit for non-design hiring managers.",
    },
    {
      title: "Add Research Process Summary Slides",
      weakness:
        "Limited documentation of user research methods and synthesis",
      impact: 3,
      effort: 3,
      priority: "medium",
      expectedOutcome:
        "Demonstrate evidence-backed design decisions to HR and hiring panel.",
    },
    {
      title: "Add a Design Systems Overview Page",
      weakness:
        "No examples of design system contribution or component library work",
      impact: 3,
      effort: 4,
      priority: "medium",
      expectedOutcome:
        "Show scalability and senior-level scope without requiring deep design review.",
    },
  ],
  design_lead: [
    {
      title: "Document Research Methodology End-to-End",
      weakness:
        "Limited documentation of user research methods and synthesis",
      impact: 5,
      effort: 3,
      priority: "high",
      expectedOutcome:
        "Close the highest-weight gap in discovery rigor for senior design roles.",
    },
    {
      title: "Reframe Case Studies Around Strategic Impact",
      weakness:
        "Portfolio narrative focuses on aesthetics over business strategy",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Elevate perceived seniority and product thinking in design lead review.",
    },
    {
      title: "Surface Cross-Functional Collaboration Artifacts",
      weakness:
        "Collaboration with engineering and PM teams is not clearly articulated",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Prove leadership beyond visual execution in hiring debrief.",
    },
    {
      title: "Add a Design System Contribution Case Study",
      weakness:
        "No examples of design system contribution or component library work",
      impact: 5,
      effort: 4,
      priority: "medium",
      expectedOutcome:
        "Increase match score for systems thinking and scalability expectations.",
    },
  ],
  ai_product_lead: [
    {
      title: "Improve AI Workflow Visibility",
      weakness:
        "Portfolio narrative focuses on aesthetics over business strategy",
      impact: 5,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Increase AI Product Designer role match score by showing AI problem framing.",
    },
    {
      title: "Add an AI Trust & Error-State Case Study",
      weakness:
        "Limited documentation of user research methods and synthesis",
      impact: 5,
      effort: 3,
      priority: "high",
      expectedOutcome:
        "Demonstrate AI-specific user mental model research and trust calibration.",
    },
    {
      title: "Show Human-in-the-Loop Interaction Patterns",
      weakness:
        "Collaboration with engineering and PM teams is not clearly articulated",
      impact: 4,
      effort: 3,
      priority: "high",
      expectedOutcome:
        "Prove ability to ship responsible AI UX with cross-functional partners.",
    },
    {
      title: "Build a Dedicated AI Product Portfolio Project",
      weakness:
        "No examples of design system contribution or component library work",
      impact: 5,
      effort: 5,
      priority: "medium",
      expectedOutcome:
        "Establish credible AI product design evidence for AI Product Lead review.",
    },
  ],
  design_engineer: [
    {
      title: "Link Live Prototypes and Repositories",
      weakness:
        "Collaboration with engineering and PM teams is not clearly articulated",
      impact: 5,
      effort: 2,
      priority: "high",
      expectedOutcome:
        "Prove implementation fluency and engineering partnership in one pass.",
    },
    {
      title: "Publish Component Specs with Code Parity",
      weakness:
        "No examples of design system contribution or component library work",
      impact: 5,
      effort: 4,
      priority: "high",
      expectedOutcome:
        "Raise technical credibility for design engineer candidacy.",
    },
    {
      title: "Add Build Artifacts to Case Studies",
      weakness:
        "Portfolio narrative focuses on aesthetics over business strategy",
      impact: 4,
      effort: 3,
      priority: "medium",
      expectedOutcome:
        "Shift narrative from mock fidelity to shipped, measurable implementation.",
    },
    {
      title: "Document Accessibility and Responsive Implementation",
      weakness:
        "Limited documentation of user research methods and synthesis",
      impact: 3,
      effort: 3,
      priority: "medium",
      expectedOutcome:
        "Show production-grade craft expected at the design engineer bar.",
    },
  ],
}

const OPPORTUNITIES_ZH: Record<ReviewerPersona, OpportunityItem[]> = {
  hr_reviewer: [
    {
      title: "明确跨职能贡献边界",
      weakness: "与工程、产品团队的协作过程未清晰呈现",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome: "强化 HR 初筛对团队协作与利益相关方对齐的感知。",
    },
    {
      title: "案例以商业背景开篇",
      weakness: "作品集叙事偏重美学，商业战略视角偏弱",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome: "提升非设计背景面试官对岗位匹配度的第一印象。",
    },
    {
      title: "补充研究过程摘要页",
      weakness: "用户研究方法与洞察合成过程文档不足",
      impact: 3,
      effort: 3,
      priority: "medium",
      expectedOutcome: "向 HR 与招聘面板展示有据可依的设计决策。",
    },
    {
      title: "增加设计系统概览页",
      weakness: "缺少设计系统贡献或组件库相关案例",
      impact: 3,
      effort: 4,
      priority: "medium",
      expectedOutcome: "在不依赖深度设计评审的情况下体现高级别工作范围。",
    },
  ],
  design_lead: [
    {
      title: "完整记录研究方法论",
      weakness: "用户研究方法与洞察合成过程文档不足",
      impact: 5,
      effort: 3,
      priority: "high",
      expectedOutcome: "弥补高级设计岗位最看重的探索严谨性差距。",
    },
    {
      title: "用战略影响力重构案例叙事",
      weakness: "作品集叙事偏重美学，商业战略视角偏弱",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome: "在设计主管评审中提升高级产品思维感知。",
    },
    {
      title: "展示跨职能协作产物",
      weakness: "与工程、产品团队的协作过程未清晰呈现",
      impact: 4,
      effort: 2,
      priority: "high",
      expectedOutcome: "证明超越视觉执行的领导力与协作能力。",
    },
    {
      title: "补充设计系统贡献案例",
      weakness: "缺少设计系统贡献或组件库相关案例",
      impact: 5,
      effort: 4,
      priority: "medium",
      expectedOutcome: "提升系统思维与可扩展性维度的匹配得分。",
    },
  ],
  ai_product_lead: [
    {
      title: "提升 AI 工作流可见度",
      weakness: "作品集叙事偏重美学，商业战略视角偏弱",
      impact: 5,
      effort: 2,
      priority: "high",
      expectedOutcome: "通过展示 AI 问题定义，提升 AI 产品设计师岗位匹配分。",
    },
    {
      title: "补充 AI 信任与异常状态案例",
      weakness: "用户研究方法与洞察合成过程文档不足",
      impact: 5,
      effort: 3,
      priority: "high",
      expectedOutcome: "展示 AI 场景下的用户心智模型研究与信任校准能力。",
    },
    {
      title: "呈现人机协作交互模式",
      weakness: "与工程、产品团队的协作过程未清晰呈现",
      impact: 4,
      effort: 3,
      priority: "high",
      expectedOutcome: "证明能与跨职能伙伴交付负责任的 AI 体验。",
    },
    {
      title: "构建独立 AI 产品作品集项目",
      weakness: "缺少设计系统贡献或组件库相关案例",
      impact: 5,
      effort: 5,
      priority: "medium",
      expectedOutcome: "为 AI 产品负责人评审建立可信的 AI 产品设计证据。",
    },
  ],
  design_engineer: [
    {
      title: "关联在线原型与代码仓库",
      weakness: "与工程、产品团队的协作过程未清晰呈现",
      impact: 5,
      effort: 2,
      priority: "high",
      expectedOutcome: "一次性证明实现能力与工程协作水平。",
    },
    {
      title: "发布与代码对齐的组件规范",
      weakness: "缺少设计系统贡献或组件库相关案例",
      impact: 5,
      effort: 4,
      priority: "high",
      expectedOutcome: "提升设计工程师岗位的技术可信度。",
    },
    {
      title: "在案例中补充构建产物",
      weakness: "作品集叙事偏重美学，商业战略视角偏弱",
      impact: 4,
      effort: 3,
      priority: "medium",
      expectedOutcome: "将叙事从高保真稿转向可交付、可衡量的实现成果。",
    },
    {
      title: "记录无障碍与响应式实现细节",
      weakness: "用户研究方法与洞察合成过程文档不足",
      impact: 3,
      effort: 3,
      priority: "medium",
      expectedOutcome: "展示设计工程师岗位要求的生产级工艺标准。",
    },
  ],
}

export function getMockOpportunityRanking(
  persona: ReviewerPersona,
  locale: Locale
): OpportunityItem[] {
  const source = locale === "zh" ? OPPORTUNITIES_ZH : OPPORTUNITIES_EN
  return normalizeOpportunities(source[persona])
}

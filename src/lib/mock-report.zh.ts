import type { PortfolioReport } from "@/types/report"

export const MOCK_REPORT_ZH: Omit<
  PortfolioReport,
  | "framework"
  | "opportunityRanking"
  | "consensusConflict"
  | "benchmark"
  | "improvementRoadmap"
  | "reviewTrace"
> = {
  executiveSummary:
    "你的作品集展现出扎实的视觉功底与端到端产品思维，案例研究清晰且能量化呈现影响力。但整体上更偏重视觉执行，而高级岗位所要求的战略性系统思维体现不足。若加强研究方法论文档化与跨职能协作信号，将显著提升与该岗位的匹配度。",
  matchScore: 72,
  skillCoverage: [
    { skill: "UI 设计", required: true, demonstrated: true, level: "strong" },
    { skill: "设计系统", required: true, demonstrated: true, level: "partial" },
    { skill: "用户研究", required: true, demonstrated: true, level: "partial" },
    { skill: "原型设计", required: true, demonstrated: true, level: "strong" },
    { skill: "利益相关方管理", required: true, demonstrated: false, level: "missing" },
    { skill: "数据驱动设计", required: true, demonstrated: true, level: "partial" },
    { skill: "无障碍设计", required: false, demonstrated: true, level: "strong" },
    { skill: "动效设计", required: false, demonstrated: false, level: "missing" },
  ],
  strengths: [
    "视觉呈现精致，版式层级与字体系统一致",
    "案例包含前后对比状态，问题定义清晰",
    "有充分的多轮探索迭代过程证据",
    "4 个主要项目中有 3 个引用了量化成果",
  ],
  weaknesses: [
    "用户研究方法与洞察合成过程文档不足",
    "缺少设计系统贡献或组件库相关案例",
    "与工程、产品团队的协作过程未清晰呈现",
    "作品集叙事偏重美学，商业战略视角偏弱",
  ],
  gapAnalysis: [
    {
      area: "研究严谨性",
      impact: "high",
      description:
        "岗位要求主导探索会议并综合洞察。你的作品集展示了研究产出，但缺少方法论与决策过程的说明。",
    },
    {
      area: "系统思维",
      impact: "high",
      description:
        "高级设计师需要在产品间扩展设计模式。建议补充一个展示组件架构或 Design Token 决策的案例。",
    },
    {
      area: "跨职能领导力",
      impact: "medium",
      description:
        "利益相关方对齐与路线图影响力是核心要求。可补充工作坊引导或优先级排序框架等协作产物。",
    },
    {
      area: "领域专业性",
      impact: "low",
      description:
        "岗位属于金融科技领域，而你的作品集以消费社交为主。一个针对性的副项目可快速弥补这一差距。",
    },
  ],
  actionPlan: [
    {
      priority: 1,
      title: "补充一个研究驱动的案例",
      description:
        "完整记录一个项目的探索过程：访谈提纲、亲和图，以及洞察如何影响最终设计方案。",
      timeframe: "1–2 周",
    },
    {
      priority: 2,
      title: "突出设计系统贡献",
      description:
        "增加专门章节，展示组件规范、Token 决策，以及设计如何在整个产品中规模化复用。",
      timeframe: "1 周",
    },
    {
      priority: 3,
      title: "用影响力重构项目叙事",
      description:
        "每个案例以商业背景和你的战略角色开篇，而非仅展示视觉成果。",
      timeframe: "3–5 天",
    },
    {
      priority: 4,
      title: "做一个金融科技微项目",
      description:
        "设计一个聚焦流程（如开户引导或数据看板），展示对金融领域的理解与相关性。",
      timeframe: "1 周",
    },
  ],
}

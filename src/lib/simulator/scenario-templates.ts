import type { DimensionId } from "@/types/framework"
import type { BenchmarkDimensionId } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

export interface ScenarioTemplate {
  id: string
  dimensionId: DimensionId
  benchmarkDimensionId: BenchmarkDimensionId
  secondaryDimensionIds?: DimensionId[]
  impact: 1 | 2 | 3 | 4 | 5
  effort: 1 | 2 | 3 | 4 | 5
  liftFactor: number
  titles: { en: string; zh: string }
  descriptions: { en: string; zh: string }
  personas?: ReviewerPersona[]
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "ai_workflow_case_study",
    dimensionId: "ai_product_sense",
    benchmarkDimensionId: "ai_workflow",
    secondaryDimensionIds: ["problem_framing_strategy", "interaction_ux_design"],
    impact: 5,
    effort: 3,
    liftFactor: 0.62,
    titles: {
      en: "Add AI Workflow Case Study",
      zh: "补充 AI 工作流案例",
    },
    descriptions: {
      en: "Dedicated case study covering prompt strategy, trust states, error recovery, and evaluation loops.",
      zh: "独立案例覆盖 Prompt 策略、信任状态、错误恢复与评估闭环。",
    },
    personas: ["ai_product_lead", "design_lead"],
  },
  {
    id: "research_methodology",
    dimensionId: "user_research_discovery",
    benchmarkDimensionId: "research",
    secondaryDimensionIds: ["problem_framing_strategy"],
    impact: 5,
    effort: 3,
    liftFactor: 0.52,
    titles: {
      en: "Document Research Methodology End-to-End",
      zh: "完整记录研究方法论",
    },
    descriptions: {
      en: "Add interview guides, synthesis artifacts, and insight-to-design traceability.",
      zh: "补充访谈提纲、洞察合成产物与洞察到设计的可追溯链路。",
    },
  },
  {
    id: "design_system_case",
    dimensionId: "systems_thinking_scalability",
    benchmarkDimensionId: "business_thinking",
    secondaryDimensionIds: ["technical_fluency_implementation"],
    impact: 5,
    effort: 4,
    liftFactor: 0.48,
    titles: {
      en: "Add Design System Contribution Case Study",
      zh: "补充设计系统贡献案例",
    },
    descriptions: {
      en: "Show component architecture, token decisions, and cross-product scalability.",
      zh: "展示组件架构、Token 决策与跨产品可扩展性。",
    },
    personas: ["design_lead", "design_engineer"],
  },
  {
    id: "live_prototypes",
    dimensionId: "technical_fluency_implementation",
    benchmarkDimensionId: "interaction_design",
    secondaryDimensionIds: ["systems_thinking_scalability"],
    impact: 5,
    effort: 2,
    liftFactor: 0.58,
    titles: {
      en: "Link Live Prototypes and Repositories",
      zh: "关联在线原型与代码仓库",
    },
    descriptions: {
      en: "Attach shipped prototypes, repos, or component specs to featured projects.",
      zh: "在核心项目中附上线原型、仓库或组件规范链接。",
    },
    personas: ["design_engineer"],
  },
  {
    id: "cross_functional_artifacts",
    dimensionId: "collaboration_communication",
    benchmarkDimensionId: "storytelling",
    secondaryDimensionIds: ["process_storytelling"],
    impact: 4,
    effort: 2,
    liftFactor: 0.45,
    titles: {
      en: "Surface Cross-Functional Collaboration Artifacts",
      zh: "展示跨职能协作产物",
    },
    descriptions: {
      en: "Workshop outputs, alignment docs, and partner quotes in case studies.",
      zh: "在案例中呈现工作坊产出、对齐文档与协作方引述。",
    },
    personas: ["hr_reviewer", "design_lead"],
  },
  {
    id: "strategic_reframe",
    dimensionId: "problem_framing_strategy",
    benchmarkDimensionId: "business_thinking",
    secondaryDimensionIds: ["impact_outcomes"],
    impact: 4,
    effort: 2,
    liftFactor: 0.42,
    titles: {
      en: "Reframe Case Studies Around Strategic Impact",
      zh: "用战略影响力重构案例叙事",
    },
    descriptions: {
      en: "Lead with business context, constraints, and why-this-problem before UI.",
      zh: "以商业背景、约束与问题选择开篇，再进入界面方案。",
    },
  },
  {
    id: "validation_metrics",
    dimensionId: "impact_outcomes",
    benchmarkDimensionId: "validation",
    secondaryDimensionIds: ["user_research_discovery"],
    impact: 4,
    effort: 3,
    liftFactor: 0.5,
    titles: {
      en: "Add Hypothesis Testing and Outcome Metrics",
      zh: "补充假设检验与成果指标",
    },
    descriptions: {
      en: "Before/after metrics, A/B learnings, or success criteria tied to design decisions.",
      zh: "将前后指标、A/B 结论或成功标准与设计决策挂钩。",
    },
  },
  {
    id: "process_narrative",
    dimensionId: "process_storytelling",
    benchmarkDimensionId: "storytelling",
    secondaryDimensionIds: ["portfolio_presentation"],
    impact: 3,
    effort: 2,
    liftFactor: 0.4,
    titles: {
      en: "Strengthen Process Storytelling Arc",
      zh: "强化过程叙事弧线",
    },
    descriptions: {
      en: "Clear exploration → decision → iteration → outcome flow in each case study.",
      zh: "每个案例呈现探索 → 决策 → 迭代 → 成果的清晰叙事。",
    },
  },
  {
    id: "interaction_states",
    dimensionId: "interaction_ux_design",
    benchmarkDimensionId: "interaction_design",
    secondaryDimensionIds: ["visual_craft_quality"],
    impact: 4,
    effort: 3,
    liftFactor: 0.44,
    titles: {
      en: "Expand Interaction State Coverage",
      zh: "扩展交互状态覆盖",
    },
    descriptions: {
      en: "Empty, loading, error, edge, and accessibility states across key flows.",
      zh: "在关键流程中覆盖空态、加载、错误、边界与无障碍状态。",
    },
  },
]

export const DIMENSION_TO_BENCHMARK: Record<
  DimensionId,
  BenchmarkDimensionId
> = {
  problem_framing_strategy: "business_thinking",
  user_research_discovery: "research",
  interaction_ux_design: "interaction_design",
  visual_craft_quality: "visual_design",
  systems_thinking_scalability: "business_thinking",
  technical_fluency_implementation: "interaction_design",
  collaboration_communication: "storytelling",
  impact_outcomes: "validation",
  ai_product_sense: "ai_workflow",
  process_storytelling: "storytelling",
  portfolio_presentation: "storytelling",
}

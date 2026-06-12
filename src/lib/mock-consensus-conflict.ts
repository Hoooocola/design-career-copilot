import type { ConsensusConflictAnalysis } from "@/types/report"
import type { Locale } from "@/lib/i18n"

const CONSENSUS_CONFLICT_EN: ConsensusConflictAnalysis = {
  consensus: [
    {
      capability: "Clear Problem Definition",
      detail:
        "All reviewers note case studies open with bounded problem statements and target users.",
    },
    {
      capability: "Strong Visual Craft",
      detail:
        "Typography, layout hierarchy, and polish are consistently above bar across featured projects.",
    },
    {
      capability: "Iterative Design Process",
      detail:
        "Multiple exploration rounds and before/after states are visible — no single-screen case studies.",
    },
    {
      capability: "Professional Portfolio Presentation",
      detail:
        "Curation, scannability, and narrative structure meet hiring-panel readability expectations.",
    },
  ],
  conflicts: [
    {
      topic: "AI Product Readiness",
      viewpoints: [
        {
          persona: "ai_product_lead",
          viewpoint:
            "AI capability is weak — no trust calibration, error handling, or probabilistic output UX.",
        },
        {
          persona: "design_lead",
          viewpoint:
            "Design process is strong — problem framing and iteration signal solid product design fundamentals.",
        },
      ],
    },
    {
      topic: "Technical & Implementation Depth",
      viewpoints: [
        {
          persona: "design_engineer",
          viewpoint:
            "No code, live demos, or component architecture — fails the build-and-ship bar.",
        },
        {
          persona: "hr_reviewer",
          viewpoint:
            "Visual deliverables and flow completeness are sufficient for initial screen — technical depth is not evaluated at this stage.",
        },
      ],
    },
    {
      topic: "Research & Discovery Rigor",
      viewpoints: [
        {
          persona: "design_lead",
          viewpoint:
            "Research outputs appear but methodology and synthesis depth are below senior expectations.",
        },
        {
          persona: "hr_reviewer",
          viewpoint:
            "User needs are communicated clearly enough for a hiring manager — research rigor is not a blocker at HR stage.",
        },
      ],
    },
    {
      topic: "Systems Thinking",
      viewpoints: [
        {
          persona: "design_lead",
          viewpoint:
            "Design system and scalable pattern contributions are underrepresented for a senior role.",
        },
        {
          persona: "design_engineer",
          viewpoint:
            "Interaction patterns are complete at screen level, but reusable component specs are absent.",
        },
      ],
    },
  ],
}

const CONSENSUS_CONFLICT_ZH: ConsensusConflictAnalysis = {
  consensus: [
    {
      capability: "清晰的问题定义",
      detail: "四位评审均认为案例以明确的问题陈述与目标用户开篇，边界清楚。",
    },
    {
      capability: "扎实的视觉工艺",
      detail: "版式层级、字体与整体完成度在主要项目中持续达线。",
    },
    {
      capability: "完整的迭代设计过程",
      detail: "可见多轮探索与前后对比，而非单屏堆叠式案例。",
    },
    {
      capability: "专业的作品集呈现",
      detail: "策展、可读性与叙事结构满足招聘面板快速阅读需求。",
    },
  ],
  conflicts: [
    {
      topic: "AI 产品就绪度",
      viewpoints: [
        {
          persona: "ai_product_lead",
          viewpoint:
            "AI 能力薄弱——缺少信任校准、错误处理与概率式输出相关体验设计。",
        },
        {
          persona: "design_lead",
          viewpoint:
            "设计流程扎实——问题定义与迭代过程体现良好的产品设计基础。",
        },
      ],
    },
    {
      topic: "技术与实现深度",
      viewpoints: [
        {
          persona: "design_engineer",
          viewpoint:
            "无代码、在线 Demo 或组件架构——未达构建与交付标准。",
        },
        {
          persona: "hr_reviewer",
          viewpoint:
            "视觉交付与流程完整度足以通过初筛——HR 阶段不评估技术实现深度。",
        },
      ],
    },
    {
      topic: "研究与探索严谨性",
      viewpoints: [
        {
          persona: "design_lead",
          viewpoint:
            "有研究产出，但方法论与洞察合成深度未达高级设计师标准。",
        },
        {
          persona: "hr_reviewer",
          viewpoint:
            "用户需求传达对用人经理足够清晰——HR 阶段研究严谨性不是主要卡点。",
        },
      ],
    },
    {
      topic: "系统思维",
      viewpoints: [
        {
          persona: "design_lead",
          viewpoint:
            "设计系统与可扩展模式贡献对高级岗位而言体现不足。",
        },
        {
          persona: "design_engineer",
          viewpoint:
            "屏幕级交互模式较完整，但缺少可复用的组件级规范与实现证据。",
        },
      ],
    },
  ],
}

export function getMockConsensusConflict(
  locale: Locale
): ConsensusConflictAnalysis {
  return locale === "zh" ? CONSENSUS_CONFLICT_ZH : CONSENSUS_CONFLICT_EN
}

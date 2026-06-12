import type { Locale } from "@/lib/i18n"
import type { PortfolioBenchmark } from "@/types/report"

const BENCHMARK_EN: PortfolioBenchmark = {
  cohortLabel: "AI Product Design Intern Portfolios",
  percentileRanking: [
    { dimensionId: "research", percentile: 70, tier: "top", tierPercent: 30 },
    { dimensionId: "storytelling", percentile: 55, tier: "top", tierPercent: 45 },
    { dimensionId: "business_thinking", percentile: 60, tier: "top", tierPercent: 40 },
    { dimensionId: "visual_design", percentile: 52, tier: "top", tierPercent: 48 },
    { dimensionId: "interaction_design", percentile: 48, tier: "bottom", tierPercent: 52 },
    { dimensionId: "ai_workflow", percentile: 20, tier: "bottom", tierPercent: 20 },
    { dimensionId: "validation", percentile: 15, tier: "bottom", tierPercent: 15 },
  ],
  strongestAreas: [
    "Research synthesis and problem framing exceed intern cohort median",
    "Case study storytelling structure is clear and above peer average",
    "Visual craft and information hierarchy signal production-ready execution",
  ],
  weakestAreas: [
    "AI workflow design — no peer-comparable evidence of probabilistic UX patterns",
    "Validation rigor — limited hypothesis testing, metrics, or outcome verification",
    "Business thinking depth — strategy narrative present but not differentiated vs. top quartile",
  ],
  competitiveAdvantage:
    "You outperform ~70% of intern applicants on research clarity and narrative structure. Hiring panels can follow your logic quickly — a meaningful edge in high-volume recruiting where reviewers spend under 15 minutes per portfolio.",
  improvementPotential:
    "Closing the AI workflow and validation gaps could move your composite peer rank from ~45th to top-quartile. A single AI-native case study with trust states, error recovery, and measured outcomes would address both weakest dimensions simultaneously.",
  source: "simulated",
}

const BENCHMARK_ZH: PortfolioBenchmark = {
  cohortLabel: "AI 产品设计实习生作品集",
  percentileRanking: [
    { dimensionId: "research", percentile: 70, tier: "top", tierPercent: 30 },
    { dimensionId: "storytelling", percentile: 55, tier: "top", tierPercent: 45 },
    { dimensionId: "business_thinking", percentile: 60, tier: "top", tierPercent: 40 },
    { dimensionId: "visual_design", percentile: 52, tier: "top", tierPercent: 48 },
    { dimensionId: "interaction_design", percentile: 48, tier: "bottom", tierPercent: 52 },
    { dimensionId: "ai_workflow", percentile: 20, tier: "bottom", tierPercent: 20 },
    { dimensionId: "validation", percentile: 15, tier: "bottom", tierPercent: 15 },
  ],
  strongestAreas: [
    "研究综合与问题定义超过实习生群体中位数",
    "案例叙事结构清晰，高于同侪平均水平",
    "视觉工艺与信息层级体现接近可交付的执行力",
  ],
  weakestAreas: [
    "AI 工作流设计——缺少概率式体验模式的可比证据",
    "验证严谨性——假设检验、指标与成果验证体现不足",
    "商业思维深度——有战略叙事但未拉开与头部四分位差距",
  ],
  competitiveAdvantage:
    "在研究清晰度与叙事结构上，你超过约 70% 的实习生申请者。招聘方能在 15 分钟内跟上你的逻辑——在高流量初筛中是实质性优势。",
  improvementPotential:
    "补齐 AI 工作流与验证短板，可将综合同侪排名从约第 45 百分位提升至头部四分位。一个包含信任状态、错误恢复与可衡量成果的 AI 原生案例，可同时改善两个最弱维度。",
  source: "simulated",
}

export function getMockBenchmark(locale: Locale): PortfolioBenchmark {
  const base = locale === "zh" ? BENCHMARK_ZH : BENCHMARK_EN
  return {
    ...base,
    percentileRanking: [...base.percentileRanking].sort(
      (a, b) => b.percentile - a.percentile
    ),
  }
}

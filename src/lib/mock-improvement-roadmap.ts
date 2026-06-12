import type { Locale } from "@/lib/i18n"
import type { CareerImprovementRoadmap } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

const ROADMAP_EN: Record<ReviewerPersona, CareerImprovementRoadmap> = {
  design_lead: {
    summary:
      "A 30-day sprint targeting your three highest-impact gaps: research documentation, AI workflow evidence, and validation metrics — sequenced for compounding portfolio upgrades.",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "Open your strongest case study and add a Discovery section: upload a 1-page interview guide, one affinity-map screenshot, and annotate 3 places where Insight #2 directly changed your wireframe or IA decision.",
        estimatedTime: "8–10 hours",
        expectedBenefit:
          "Closes Gap Analysis \"Research Rigor\" (high impact) and backs up Research at Top 30% with reproducible methodology evidence.",
      },
      {
        week: 2,
        keyTask:
          "Build a new Figma case study chapter for an AI copilot onboarding flow — 6 screens minimum covering idle, streaming, partial output, model error, user correction, and confirm-send. Label each with trust/copy rationale.",
        estimatedTime: "12–14 hours",
        expectedBenefit:
          "Directly targets Benchmark AI Workflow (Bottom 20%) and converts the \"Improve AI Workflow Visibility\" opportunity into portfolio-ready artifacts.",
      },
      {
        week: 3,
        keyTask:
          "Add an Outcomes & Validation block to all 4 featured projects. Each block must list: baseline KPI, post-launch metric (or proxy), and one hypothesis you tested and rejected during the project.",
        estimatedTime: "6–8 hours",
        expectedBenefit:
          "Lifts Validation from Bottom 15% and strengthens impact_outcomes scoring in the 11-dimension rubric.",
      },
      {
        week: 4,
        keyTask:
          "Rewrite portfolio homepage copy (≤120 words) and the opening slide of each case study to lead with business constraint + your specific role. Send the updated PDF to 2 designers in AI product roles for async critique.",
        estimatedTime: "5–7 hours",
        expectedBenefit:
          "Pushes Business Thinking toward top quartile and raises design-lead match score by reframing aesthetics-first narrative.",
      },
    ],
  },
  hr_reviewer: {
    summary:
      "Four weeks focused on HR-screen signals: role clarity, collaboration proof, and scannable impact framing — without deep craft rework.",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "Add a portfolio cover page with target role title, 3-bullet value proposition, and contact line. Rewrite project titles so each states the user problem in ≤8 words (e.g., \"Reducing checkout drop-off for SMB sellers\").",
        estimatedTime: "4–5 hours",
        expectedBenefit:
          "Improves HR first-impression scan time under 90 seconds; strengthens Presentation and Collaboration signals.",
      },
      {
        week: 2,
        keyTask:
          "For 2 case studies, insert a \"My Role & Partners\" sidebar: list PM/engineer/research counterparts by function, your deliverables, and one workshop or review session you facilitated (date + outcome).",
        estimatedTime: "6–7 hours",
        expectedBenefit:
          "Addresses weakness on cross-functional collaboration; supports Opportunity \"Clarify Cross-Functional Contribution\".",
      },
      {
        week: 3,
        keyTask:
          "Create a one-page Research Summary appendix per major project: method used (3 bullets), sample size or data source, and 2 quotes that influenced a shipped decision.",
        estimatedTime: "7–8 hours",
        expectedBenefit:
          "Makes research legible to non-design hiring managers; reinforces Research Top 30% narrative for HR screen.",
      },
      {
        week: 4,
        keyTask:
          "Add a before/after metric callout to every case study hero slide — format: \"[Metric] moved from X → Y in [timeframe]\" with one sentence of business context. Export updated PDF and test on mobile readability.",
        estimatedTime: "5–6 hours",
        expectedBenefit:
          "Elevates Business Impact perception for HR; aligns with benchmark strength in storytelling structure.",
      },
    ],
  },
  ai_product_lead: {
    summary:
      "AI-native portfolio sprint: one credible AI case study with trust UX, validation metrics, and human-in-the-loop patterns — your fastest path out of Bottom 20% on AI Workflow.",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "Pick one existing product and write a 1-page AI Problem Brief: user job-to-be-done, why AI vs. rules/search, model capability assumptions, and 3 known failure modes you must design for.",
        estimatedTime: "6–8 hours",
        expectedBenefit:
          "Establishes AI product sense framing; addresses benchmark gap on AI workflow justification.",
      },
      {
        week: 2,
        keyTask:
          "Design a human-in-the-loop review flow in Figma: AI suggestion panel, diff view, accept/edit/reject actions, undo stack, and audit trail placeholder. Include error copy for low-confidence responses.",
        estimatedTime: "14–16 hours",
        expectedBenefit:
          "Produces peer-comparable AI UX evidence; targets Opportunity \"Show Human-in-the-Loop Interaction Patterns\".",
      },
      {
        week: 3,
        keyTask:
          "Run 5 moderated sessions (30 min each) on your Week 2 prototype — test trust calibration and error recovery. Document 3 findings with before/after UI changes applied same week.",
        estimatedTime: "10–12 hours",
        expectedBenefit:
          "Closes Validation at Bottom 15% with primary evidence; strengthens user_research_discovery for AI mental models.",
      },
      {
        week: 4,
        keyTask:
          "Publish the AI case study as a standalone portfolio chapter: problem brief, flows, research clips, trust patterns, and a results slide with task-success rate or qualitative confidence shift.",
        estimatedTime: "8–10 hours",
        expectedBenefit:
          "Moves AI Product Lead readiness from mixed to interview-tier; compound lift on ai_product_sense + validation dimensions.",
      },
    ],
  },
  design_engineer: {
    summary:
      "Ship-visible proof sprint: link repos, component specs, and responsive implementation artifacts to match the design engineer hiring bar.",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "Select one UI-heavy case study and rebuild its hero component in code (React or your stack). Deploy to Vercel/Netlify and embed the live URL + GitHub repo link on the case study's first slide.",
        estimatedTime: "12–15 hours",
        expectedBenefit:
          "Addresses Gap \"Systems Thinking\" with build proof; targets Opportunity \"Link Live Prototypes and Repositories\".",
      },
      {
        week: 2,
        keyTask:
          "Document a component you built: props table, variant matrix (default/hover/error/disabled), token mapping, and one accessibility checklist item you implemented (e.g., focus trap, aria-live).",
        estimatedTime: "8–10 hours",
        expectedBenefit:
          "Demonstrates technical_fluency_implementation and systems_thinking_scalability at implementation depth.",
      },
      {
        week: 3,
        keyTask:
          "Add responsive + keyboard-navigation screen recordings (2 min max) for your live prototype. Capture 375px, 768px, and 1280px breakpoints with tab-order overlay on one critical flow.",
        estimatedTime: "6–8 hours",
        expectedBenefit:
          "Closes production-grade craft gap cited in design engineer verdict; differentiates from visual-only portfolios.",
      },
      {
        week: 4,
        keyTask:
          "Write a short build retrospective (300 words): stack choices, one tradeoff with engineering, and a metric or performance win (bundle size, LCP, or task time). Pin it to the case study and portfolio index.",
        estimatedTime: "4–5 hours",
        expectedBenefit:
          "Strengthens collaboration_communication with engineers; supports match score lift for design_engineer persona.",
      },
    ],
  },
}

const ROADMAP_ZH: Record<ReviewerPersona, CareerImprovementRoadmap> = {
  design_lead: {
    summary:
      "30 天冲刺，聚焦三项最高影响差距：研究文档化、AI 工作流证据与验证指标——按复利顺序排期。",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "打开你最强的案例，新增「探索」章节：上传 1 页访谈提纲、一张亲和图截图，并标注 3 处「洞察 #2」直接改变线框图或信息架构的位置。",
        estimatedTime: "8–10 小时",
        expectedBenefit:
          "闭合差距分析「研究严谨性」（高影响），并以可复现方法论支撑研究维度前 30% 叙事。",
      },
      {
        week: 2,
        keyTask:
          "在 Figma 新建 AI 助手引导流程案例章节——至少 6 屏：空闲、流式输出、部分结果、模型错误、用户修正、确认发送；每屏标注信任/文案设计理由。",
        estimatedTime: "12–14 小时",
        expectedBenefit:
          "直接针对基准 AI 工作流（后 20%），将「提升 AI 工作流可见度」机会转化为可展示产物。",
      },
      {
        week: 3,
        keyTask:
          "为 4 个主要项目各增加「成果与验证」模块：须包含基线 KPI、上线后指标（或代理指标）、以及项目中检验并否定的一个假设。",
        estimatedTime: "6–8 小时",
        expectedBenefit:
          "将验证维度从后 15% 拉升，并强化 11 维 Rubric 中的影响力得分。",
      },
      {
        week: 4,
        keyTask:
          "重写作品集首页文案（≤120 字）及每个案例开篇页：以业务约束 + 你的具体角色开篇；将更新 PDF 发给 2 位 AI 产品设计师做异步点评。",
        estimatedTime: "5–7 小时",
        expectedBenefit:
          "推动商业思维进入头部四分位，并通过重构美学优先叙事提升设计主管匹配分。",
      },
    ],
  },
  hr_reviewer: {
    summary:
      "四周聚焦 HR 初筛信号：岗位清晰度、协作证明与可扫读的影响力呈现——无需深度工艺重做。",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "新增作品集封面：目标岗位、3 条价值主张、联系方式。将项目标题改写为 ≤8 字用户问题（如「降低 SMB 卖家结账流失」）。",
        estimatedTime: "4–5 小时",
        expectedBenefit:
          "提升 HR 90 秒内扫读效率；强化呈现与协作维度信号。",
      },
      {
        week: 2,
        keyTask:
          "在 2 个案例中插入「我的角色与协作方」侧栏：列出 PM/工程/研究职能、你的交付物、以及一次你引导的评审或工作坊（日期 + 结果）。",
        estimatedTime: "6–7 小时",
        expectedBenefit:
          "回应跨职能协作不足；支撑机会项「明确跨职能贡献边界」。",
      },
      {
        week: 3,
        keyTask:
          "为每个主要项目制作 1 页研究摘要附录：方法（3 条）、样本量或数据来源、2 条影响上线决策的用户引述。",
        estimatedTime: "7–8 小时",
        expectedBenefit:
          "让非设计背景面试官读懂研究；巩固 HR 视角下的研究前 30% 叙事。",
      },
      {
        week: 4,
        keyTask:
          "在每个案例首页增加前后指标标注：格式「[指标] 在 [时间] 内从 X → Y」+ 一句业务背景；导出 PDF 并测试移动端可读性。",
        estimatedTime: "5–6 小时",
        expectedBenefit:
          "提升 HR 对商业影响力的感知；与基准中叙事结构优势对齐。",
      },
    ],
  },
  ai_product_lead: {
    summary:
      "AI 原生作品集冲刺：一个可信 AI 案例（信任体验 + 验证指标 + 人机协作模式）——最快脱离 AI 工作流后 20%。",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "选一个现有产品，撰写 1 页 AI 问题简报：用户待办任务、为何用 AI 而非规则/搜索、模型能力假设、以及必须设计的 3 种失败模式。",
        estimatedTime: "6–8 小时",
        expectedBenefit:
          "建立 AI 产品感叙事框架；回应基准中 AI 工作流论证缺失。",
      },
      {
        week: 2,
        keyTask:
          "在 Figma 设计人机协作审核流程：AI 建议面板、差异视图、接受/编辑/拒绝、撤销栈、审计记录占位；含低置信度响应的错误文案。",
        estimatedTime: "14–16 小时",
        expectedBenefit:
          "产出可同侪比较的 AI 体验证据；对应「呈现人机协作交互模式」机会项。",
      },
      {
        week: 3,
        keyTask:
          "对第 2 周原型做 5 场 30 分钟有主持测试——聚焦信任校准与错误恢复；记录 3 条发现并在当周完成前后 UI 修改。",
        estimatedTime: "10–12 小时",
        expectedBenefit:
          "以主要证据闭合验证后 15% 差距；强化 AI 心智模型相关研究维度。",
      },
      {
        week: 4,
        keyTask:
          "将 AI 案例作为独立章节发布：问题简报、流程、研究片段、信任模式、以及任务成功率或信心变化的结果页。",
        estimatedTime: "8–10 小时",
        expectedBenefit:
          "将 AI 产品负责人就绪度从 mixed 推至可面试层级；复合提升 ai_product_sense 与验证维度。",
      },
    ],
  },
  design_engineer: {
    summary:
      "可验证交付冲刺：关联仓库、组件规范与响应式实现产物，对齐设计工程师招聘标准。",
    derivedFrom: ["portfolio_analysis", "gap_analysis", "benchmark"],
    weeks: [
      {
        week: 1,
        keyTask:
          "选一个 UI 密集案例，用代码（React 或你的技术栈）重建首页核心组件；部署到 Vercel/Netlify，并在案例首页嵌入 live URL + GitHub 链接。",
        estimatedTime: "12–15 小时",
        expectedBenefit:
          "以构建证据回应「系统思维」差距；对应「关联在线原型与代码仓库」机会项。",
      },
      {
        week: 2,
        keyTask:
          "记录一个你实现的组件：Props 表、变体矩阵（默认/hover/error/disabled）、Token 映射、以及一项无障碍实现（如焦点陷阱、aria-live）。",
        estimatedTime: "8–10 小时",
        expectedBenefit:
          "在技术实现与系统思维维度展示实现深度。",
      },
      {
        week: 3,
        keyTask:
          "为在线原型录制响应式 + 键盘导航演示（≤2 分钟）：覆盖 375/768/1280 断点，并在关键流程叠加 Tab 顺序示意。",
        estimatedTime: "6–8 小时",
        expectedBenefit:
          "闭合设计工程师评审中的生产级工艺差距；与纯视觉作品集拉开差异。",
      },
      {
        week: 4,
        keyTask:
          "撰写 300 字构建复盘：技术选型、与工程的一项权衡、以及一项指标收益（包体积/LCP/任务耗时）；附在案例与作品集索引。",
        estimatedTime: "4–5 小时",
        expectedBenefit:
          "强化与工程师的协作沟通信号；提升 design_engineer 视角匹配分。",
      },
    ],
  },
}

export function getMockImprovementRoadmap(
  locale: Locale,
  persona: ReviewerPersona
): CareerImprovementRoadmap {
  const source = locale === "zh" ? ROADMAP_ZH : ROADMAP_EN
  return source[persona]
}

import type { Locale } from "@/lib/i18n"
import type { ReviewTraceItem } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

const TRACE_EN: Record<ReviewerPersona, ReviewTraceItem[]> = {
  design_lead: [
    {
      id: "match_score",
      label: "Match Score",
      conclusion:
        "Portfolio aligns at a moderate-to-strong level with senior AI product designer expectations, weighted toward craft and process over systems and AI depth.",
      supportingEvidence: [
        "4 case studies with bounded problem statements and outcome metrics",
        "Consistent visual hierarchy and iteration artifacts across projects",
        "Persona-adjusted dimension weights applied to 11-rubric scoring",
      ],
      missingEvidence: [
        "Design system or component architecture documentation",
        "AI-specific UX patterns (trust, streaming, error recovery)",
      ],
      reasoningProcess:
        "Match score = Σ(dimension_score/5 × persona_weight) × 100. Critical dimensions (problem framing, interaction UX, impact) score 4/5. Systems thinking and AI product sense score below senior bar, capping overall fit at 72 despite craft strengths.",
      confidenceScore: 74,
      recommendation:
        "Prioritize one systems-level and one AI-native case study to move match score into the 80+ strong-fit band.",
    },
    {
      id: "research_rigor",
      label: "User Research — 3/5",
      conclusion:
        "Research influences design decisions but methodology documentation is below senior discovery standards.",
      supportingEvidence: [
        "User quotes cited in Project 3 case study",
        "Problem statements reference user pain in 3 of 4 projects",
      ],
      missingEvidence: [
        "Interview guides or research plans",
        "Affinity maps, synthesis artifacts, or insight-to-design traceability",
      ],
      reasoningProcess:
        "Scored competent (3/5) because outputs exist (quotes, insights) but primary research artifacts are absent. Senior bar requires visible discovery process, not only conclusions.",
      confidenceScore: 81,
      recommendation:
        "Add a Discovery section with interview guide, synthesis map, and 3 annotated insight→design links.",
    },
    {
      id: "ai_product_sense",
      label: "AI Product Sense — Below Bar",
      conclusion:
        "No credible evidence of designing for probabilistic AI systems; AI is not justified as a solution approach in featured work.",
      supportingEvidence: [
        "Product thinking visible in case structure and outcome framing",
      ],
      missingEvidence: [
        "AI error states, confidence UI, or human-in-the-loop flows",
        "Rationale for why AI vs. deterministic alternatives",
        "Trust calibration or mental-model research for AI features",
      ],
      reasoningProcess:
        "Dimension scored emerging (2/5). Dealbreaker check for AI roles: no AI case study triggers gap flag regardless of general craft score. Evidence type tagged absent across all AI-specific artifact checks.",
      confidenceScore: 88,
      recommendation:
        "Build a dedicated AI copilot case study covering streaming, partial results, and correction flows.",
    },
    {
      id: "gap_research",
      label: "Gap: Research Rigor",
      conclusion:
        "High-impact gap — role requires leading discovery; portfolio shows outputs without process.",
      supportingEvidence: [
        "JD requires leading discovery sessions and synthesizing insights",
        "Portfolio contains research outputs in 2 projects",
      ],
      missingEvidence: [
        "Documented methodology linking research to shipped decisions",
        "Seniority signal: facilitation artifacts or research ops contribution",
      ],
      reasoningProcess:
        "Gap impact = high because JD lists user research as required skill (partial coverage) AND dimension scores below persona critical threshold. Ranked #1 in gap analysis by combined JD weight + dimension delta.",
      confidenceScore: 79,
      recommendation:
        "See Week 1 of Improvement Roadmap — document one full discovery cycle end-to-end.",
    },
    {
      id: "visual_craft",
      label: "Visual Craft — 4/5 Strong",
      conclusion:
        "Visual design quality is a clear portfolio strength and above peer median.",
      supportingEvidence: [
        "Consistent typographic scale and spacing rhythm across featured screens",
        "Before/after states demonstrate intentional hierarchy refinement",
        "Primary evidence — production-quality mockups in all 4 case studies",
      ],
      missingEvidence: [
        "Token documentation or style-guide contribution",
      ],
      reasoningProcess:
        "Scored strong (4/5) with primary evidence on every featured project. Not exceptional (5/5) because system-level craft documentation is absent. Contributes +12 points to weighted match score.",
      confidenceScore: 86,
      recommendation:
        "Leverage this strength in narrative — lead with clarity and polish, not only aesthetics.",
    },
    {
      id: "hire_tier",
      label: "Recommendation: Yes (Interview)",
      conclusion:
        "Candidate passes design-lead bar for interview with focus areas on research depth and systems thinking.",
      supportingEvidence: [
        "Match score 72 ≥ 65 threshold for 'yes' tier",
        "No dealbreakers triggered on critical dimensions",
        "2+ dimensions at strong level (visual craft, problem framing, process)",
      ],
      missingEvidence: [
        "Staff-level systems contribution",
        "AI product sense for AI-targeted roles",
      ],
      reasoningProcess:
        "Tier = yes per rubric: match ≥65, critical dimensions meet mid-senior bar, no red-flag clusters. Downgraded from strong_yes because systems thinking and AI sense below senior exceptional threshold.",
      confidenceScore: 71,
      recommendation:
        "Proceed to panel interview; probe research methodology and strategic tradeoffs in live review.",
    },
  ],
  hr_reviewer: [
    {
      id: "match_score",
      label: "Match Score",
      conclusion:
        "Portfolio passes HR screening — professional, scannable, and role-relevant at first glance.",
      supportingEvidence: [
        "4 focused case studies with clear headers; 24-page length respects reviewer time",
        "Plain-language process narrative accessible to non-designers",
      ],
      missingEvidence: [
        "Executive summary stating target role on cover page",
        "Explicit team role and cross-functional contribution framing",
      ],
      reasoningProcess:
        "HR-weighted rubric emphasizes presentation (18%), communication (16%), storytelling (14%). These dimensions score 4/5 with primary evidence. Technical and AI dimensions de-emphasized in HR weight profile.",
      confidenceScore: 78,
      recommendation:
        "Add cover-page role statement and per-project 'My Role' sidebar before recruiter forward.",
    },
    {
      id: "collaboration",
      label: "Collaboration Signals — Weak",
      conclusion:
        "Cross-functional teamwork is mentioned but not evidenced for HR evaluation.",
      supportingEvidence: [
        "Project outcomes imply team delivery in 2 case studies",
      ],
      missingEvidence: [
        "Named PM/engineering/research partners",
        "Workshop facilitation or stakeholder alignment artifacts",
      ],
      reasoningProcess:
        "Collaboration dimension evidence tagged absent. HR screen often filters on teamwork signals — gap flagged as medium-high because absence is visible to non-design reviewers.",
      confidenceScore: 83,
      recommendation:
        "Insert collaboration sidebar in 2 case studies with partner roles and your deliverables.",
    },
    {
      id: "impact_framing",
      label: "Impact Metrics — Partial",
      conclusion:
        "Metrics are cited but lack context HR and hiring managers need for quick validation.",
      supportingEvidence: [
        "'40% engagement increase' stated in Project 2",
        "Metrics present in 3 of 4 projects",
      ],
      missingEvidence: [
        "Baseline, timeframe, and business owner for each metric",
        "Connection between metric and your specific contribution",
      ],
      reasoningProcess:
        "Impact dimension scored with secondary evidence only. HR persona weights outcomes at 12% — partial coverage reduces screen confidence but does not block advancement.",
      confidenceScore: 76,
      recommendation:
        "Reformat metrics as: baseline → result in timeframe, with one-line business context.",
    },
    {
      id: "hire_tier",
      label: "Recommendation: Advance to Design Interview",
      conclusion:
        "HR would forward candidate to design panel — communication and presentation meet hireable bar.",
      supportingEvidence: [
        "Portfolio scannability and narrative clarity above intern cohort median",
        "No confidentiality or professionalism red flags",
      ],
      missingEvidence: [
        "Sharper impact framing for hiring-manager validation",
      ],
      reasoningProcess:
        "HR recommendation independent of deep craft review. Presentation + storytelling primary evidence sufficient for screen pass. Design panel will evaluate research and systems depth.",
      confidenceScore: 72,
      recommendation:
        "Prepare 2-minute portfolio walkthrough leading with role fit and strongest project outcome.",
    },
  ],
  ai_product_lead: [
    {
      id: "match_score",
      label: "Match Score",
      conclusion:
        "Portfolio does not meet AI product design hiring bar — strong generalist foundation but no AI product evidence.",
      supportingEvidence: [
        "Product thinking and problem framing visible in case structure",
        "Some user-needs awareness in problem statements",
      ],
      missingEvidence: [
        "Any AI/copilot/ML feature case study",
        "Trust UX, probabilistic output handling, or human-AI collaboration patterns",
        "AI solution justification vs. alternatives",
      ],
      reasoningProcess:
        "AI Product Lead weights ai_product_sense at 20% — dimension scores 2/5 with absent evidence. Critical dimension gate triggered: ai_product_sense below meets_bar → recommendation capped at mixed regardless of craft scores.",
      confidenceScore: 90,
      recommendation:
        "Do not apply to AI product roles without a dedicated AI-native portfolio project.",
    },
    {
      id: "ai_trust",
      label: "AI Trust & Error UX — Absent",
      conclusion:
        "No design artifacts address how users calibrate trust or recover from AI errors.",
      supportingEvidence: [],
      missingEvidence: [
        "Streaming/partial result UI",
        "Confidence scores, source attribution, or edit/regenerate flows",
        "Error recovery and human-in-the-loop checkpoints",
      ],
      reasoningProcess:
        "Evidence extraction checklist for ai_product_sense: 0/4 required artifacts found. Tagged absent → dimension score cannot exceed emerging (2/5) per rubric rules.",
      confidenceScore: 92,
      recommendation:
        "Design 6-state AI copilot flow: idle, streaming, partial, error, correction, confirm.",
    },
    {
      id: "hire_tier",
      label: "Recommendation: Not Ready",
      conclusion:
        "Would not pass AI Product Lead review for AI product designer role as currently presented.",
      supportingEvidence: [
        "General UX competency provides rebuild foundation",
      ],
      missingEvidence: [
        "Entire AI product sense dimension portfolio evidence",
      ],
      reasoningProcess:
        "Tier = mixed/no for AI roles when ai_product_sense dealbreaker active. Match score 58 reflects persona-adjusted weights, not absence of all design skill.",
      confidenceScore: 88,
      recommendation:
        "Complete AI case study sprint (see Improvement Roadmap Weeks 1–4) before reapplying.",
    },
  ],
  design_engineer: [
    {
      id: "match_score",
      label: "Match Score",
      conclusion:
        "Visual and interaction design are solid; implementation and build evidence fail the design engineer bar.",
      supportingEvidence: [
        "High-fidelity UI with complete flow states in 4 projects",
        "Interaction patterns show multiple edge cases",
      ],
      missingEvidence: [
        "Code repositories or live deployed prototypes",
        "Component specs with implementation parity",
        "Responsive/accessibility implementation proof",
      ],
      reasoningProcess:
        "Design engineer weights technical_fluency at 22% and systems at 18%. Technical dimension scores 2/5 — primary evidence absent for all build artifacts. Visual scores do not compensate per persona critical_dimension gate.",
      confidenceScore: 85,
      recommendation:
        "Ship one case study component to production URL + GitHub before design engineer applications.",
    },
    {
      id: "build_artifacts",
      label: "Implementation Evidence — Absent",
      conclusion:
        "Portfolio reads as visual/product designer, not someone who ships production UI.",
      supportingEvidence: [
        "Detailed hi-fi mockups suggest build-aware layout decisions",
      ],
      missingEvidence: [
        "GitHub links, Storybook, or component documentation",
        "Performance, a11y, or responsive implementation notes",
      ],
      reasoningProcess:
        "Dealbreaker check for design_engineer persona: 'No code, prototypes, or build artifacts' → triggered. Overrides average dimension score for hire recommendation.",
      confidenceScore: 91,
      recommendation:
        "Rebuild hero component in code, deploy, and embed link in case study (Roadmap Week 1).",
    },
    {
      id: "hire_tier",
      label: "Recommendation: Wrong Profile",
      conclusion:
        "Candidate profile mismatches design engineer role — recommend visual/product track instead.",
      supportingEvidence: [
        "Strong visual craft and interaction completeness",
      ],
      missingEvidence: [
        "All technical_fluency_implementation primary evidence categories",
      ],
      reasoningProcess:
        "Persona verdict: visual designer profile. Tier = mixed/no for design engineer. Would reconsider with one shipped build artifact demonstrating code+design parity.",
      confidenceScore: 87,
      recommendation:
        "Target product/visual design roles unless build portfolio is added within 30 days.",
    },
  ],
}

const TRACE_ZH: Record<ReviewerPersona, ReviewTraceItem[]> = {
  design_lead: [
    {
      id: "match_score",
      label: "匹配分",
      conclusion:
        "作品集与高级 AI 产品设计师期望中度偏上匹配，工艺与流程强于系统思维与 AI 深度。",
      supportingEvidence: [
        "4 个案例均有明确问题定义与成果指标",
        "多项目一致的视觉层级与迭代产物",
        "基于 11 维 Rubric 与 Persona 权重计算",
      ],
      missingEvidence: [
        "设计系统或组件架构文档",
        "AI 专属体验模式（信任、流式、错误恢复）",
      ],
      reasoningProcess:
        "匹配分 = Σ(维度分/5 × 权重) × 100。关键维度（问题定义、交互、影响力）得 4/5；系统思维与 AI 产品感未达高级标准，工艺优势将总分限制在 72。",
      confidenceScore: 74,
      recommendation:
        "各补充一个系统级与 AI 原生案例，可将匹配分推至 80+ 强匹配区间。",
    },
    {
      id: "research_rigor",
      label: "用户研究 — 3/5",
      conclusion:
        "研究影响了设计决策，但方法论文档未达高级探索标准。",
      supportingEvidence: [
        "案例 3 引用了用户原话",
        "4 个项目中 3 个有问题陈述",
      ],
      missingEvidence: [
        "访谈提纲或研究计划",
        "亲和图、合成产物或洞察→设计追溯链",
      ],
      reasoningProcess:
        "评为达标（3/5）：有产出（引述、洞察）但缺少主要研究产物。高级标准需可见探索过程，而非仅结论。",
      confidenceScore: 81,
      recommendation:
        "新增探索章节：访谈提纲、合成图、3 处洞察→设计标注。",
    },
    {
      id: "ai_product_sense",
      label: "AI 产品感 — 未达线",
      conclusion:
        "无可信的概率式 AI 系统设计证据；未论证 AI 作为解决方案的合理性。",
      supportingEvidence: ["案例结构与成果叙事体现产品思维"],
      missingEvidence: [
        "AI 错误态、置信度 UI 或人机协作流程",
        "AI vs 确定性方案的选型理由",
        "AI 功能的信任校准或心智模型研究",
      ],
      reasoningProcess:
        "维度评 2/5。AI 岗位 dealbreaker：无 AI 案例则不论通用工艺得分均标记差距。AI 专属产物检查均为 absent。",
      confidenceScore: 88,
      recommendation: "构建独立 AI 助手案例，覆盖流式、部分结果与修正流程。",
    },
    {
      id: "gap_research",
      label: "差距：研究严谨性",
      conclusion: "高影响差距——岗位要求主导探索，作品集有产出无过程。",
      supportingEvidence: [
        "JD 要求主导探索会议并综合洞察",
        "2 个项目含研究产出",
      ],
      missingEvidence: [
        "研究方法论文档与上线决策的关联",
        "高级信号：引导工作坊或研究运营贡献",
      ],
      reasoningProcess:
        "影响=高：JD 必填技能仅部分覆盖 + 维度低于 Persona 关键阈值。在差距分析中按 JD 权重与维度差综合排名第一。",
      confidenceScore: 79,
      recommendation: "参见提升路线图第 1 周——完整记录一次探索周期。",
    },
    {
      id: "visual_craft",
      label: "视觉工艺 — 4/5 突出",
      conclusion: "视觉设计质量是明确优势，高于同侪中位数。",
      supportingEvidence: [
        "主要界面一致的字体层级与间距节奏",
        "前后对比展示层级优化过程",
        "主要证据——4 个案例均为生产级稿",
      ],
      missingEvidence: ["Token 文档或风格指南贡献"],
      reasoningProcess:
        "评 4/5，每个主要项目均有主要证据。未达 5/5 因缺少系统级工艺文档。对加权匹配分贡献约 +12。",
      confidenceScore: 86,
      recommendation: "叙事中突出清晰度与完成度，而非仅美学。",
    },
    {
      id: "hire_tier",
      label: "建议：通过（进入面试）",
      conclusion: "通过设计主管初筛，面试重点考察研究深度与系统思维。",
      supportingEvidence: [
        "匹配分 72 ≥ 65 的 yes 阈值",
        "关键维度无 dealbreaker",
        "2+ 维度达突出（视觉、问题定义、流程）",
      ],
      missingEvidence: ["Staff 级系统贡献", "AI 产品感（AI 岗位）"],
      reasoningProcess:
        "按 Rubric 为 yes 档：匹配≥65、关键维度达中高级线、无红旗集群。未达 strong_yes 因系统思维与 AI 感未达高级卓越线。",
      confidenceScore: 71,
      recommendation: "进入小组面试；现场深挖研究方法论与战略取舍。",
    },
  ],
  hr_reviewer: [
    {
      id: "match_score",
      label: "匹配分",
      conclusion: "作品集通过 HR 初筛——专业、可扫读、岗位相关。",
      supportingEvidence: [
        "4 个聚焦案例，24 页篇幅尊重评审时间",
        "非设计背景可读懂的流程叙事",
      ],
      missingEvidence: ["封面岗位摘要", "明确的跨职能贡献表述"],
      reasoningProcess:
        "HR 权重侧重呈现（18%）、沟通（16%）、叙事（14%），这些维度 4/5 且有主要证据。技术与 AI 维度在 HR 权重中降权。",
      confidenceScore: 78,
      recommendation: "补充封面岗位说明与各项目「我的角色」侧栏后再投递。",
    },
    {
      id: "collaboration",
      label: "协作信号 — 薄弱",
      conclusion: "提及团队协作但 HR 可验证的证据不足。",
      supportingEvidence: ["2 个案例成果暗示团队交付"],
      missingEvidence: ["PM/工程/研究伙伴署名", "工作坊或利益相关方对齐产物"],
      reasoningProcess:
        "协作维度证据标记为 absent。HR 初筛常过滤团队协作信号——对非设计面试官可见，标记为中高影响差距。",
      confidenceScore: 83,
      recommendation: "在 2 个案例中插入协作侧栏：伙伴职能与你的交付物。",
    },
    {
      id: "impact_framing",
      label: "影响力指标 — 部分",
      conclusion: "有指标引用，但缺少 HR 与用人经理快速验证所需的上下文。",
      supportingEvidence: ["案例 2 引用「参与度提升 40%」", "4 个项目中 3 个有指标"],
      missingEvidence: ["基线、时间范围与业务负责人", "指标与你个人贡献的关联"],
      reasoningProcess:
        "影响力维度仅次要证据。HR Persona 权重 12%——部分覆盖降低初筛信心但不阻断推进。",
      confidenceScore: 76,
      recommendation: "指标格式：基线 → 时间范围内结果 + 一句业务背景。",
    },
    {
      id: "hire_tier",
      label: "建议：进入设计面试",
      conclusion: "HR 会推进至设计小组——沟通与呈现达可雇佣线。",
      supportingEvidence: ["可读性与叙事清晰度高于实习生中位数", "无保密或专业性红旗"],
      missingEvidence: ["更清晰的影响力表述供用人经理验证"],
      reasoningProcess:
        "HR 建议独立于深度工艺评审。呈现+叙事主要证据足以通过初筛；设计小组将评估研究与系统深度。",
      confidenceScore: 72,
      recommendation: "准备 2 分钟作品集导读：岗位匹配 + 最强项目成果。",
    },
  ],
  ai_product_lead: [
    {
      id: "match_score",
      label: "匹配分",
      conclusion: "未达 AI 产品设计招聘标准——通用基础尚可，无 AI 产品证据。",
      supportingEvidence: ["案例结构体现产品思维", "问题陈述有用户需求意识"],
      missingEvidence: [
        "任何 AI/助手/ML 功能案例",
        "信任体验、概率式输出或人机协作模式",
        "AI 方案合理性论证",
      ],
      reasoningProcess:
        "AI 产品负责人将 ai_product_sense 权重设为 20%——维度 2/5 且证据 absent。关键维度门禁触发，建议上限为 mixed。",
      confidenceScore: 90,
      recommendation: "无独立 AI 原生项目前不建议投递 AI 产品岗位。",
    },
    {
      id: "ai_trust",
      label: "AI 信任与错误体验 — 缺失",
      conclusion: "无设计产物说明用户如何校准信任或从 AI 错误中恢复。",
      supportingEvidence: [],
      missingEvidence: [
        "流式/部分结果 UI",
        "置信度、来源标注或编辑/重新生成流程",
        "错误恢复与人机协作检查点",
      ],
      reasoningProcess:
        "ai_product_sense 证据清单 0/4 必填产物命中，标记 absent → 维度分不超过 2/5。",
      confidenceScore: 92,
      recommendation: "设计 6 态 AI 助手流程：空闲、流式、部分、错误、修正、确认。",
    },
    {
      id: "hire_tier",
      label: "建议：尚未就绪",
      conclusion: "以当前作品集无法通过 AI 产品负责人评审。",
      supportingEvidence: ["通用 UX 能力可作为重建基础"],
      missingEvidence: ["整个 AI 产品感维度的作品集证据"],
      reasoningProcess:
        "AI 岗位 ai_product_sense dealbreaker 激活时 tier 为 mixed/no。匹配分 58 反映 Persona 权重，非全无设计能力。",
      confidenceScore: 88,
      recommendation: "完成 AI 案例冲刺（路线图 1–4 周）后再申请。",
    },
  ],
  design_engineer: [
    {
      id: "match_score",
      label: "匹配分",
      conclusion: "视觉与交互扎实；实现与构建证据未达设计工程师标准。",
      supportingEvidence: [
        "4 个项目高保真 UI 与完整流程状态",
        "交互模式含多种边界状态",
      ],
      missingEvidence: [
        "代码仓库或在线部署原型",
        "与实现一致的组件规范",
        "响应式/无障碍实现证明",
      ],
      reasoningProcess:
        "设计工程师权重：技术 22%、系统 18%。技术维度 2/5，构建类主要证据均 absent。视觉分无法通过关键维度门禁补偿。",
      confidenceScore: 85,
      recommendation: "投递前至少一个案例组件上线 URL + GitHub。",
    },
    {
      id: "build_artifacts",
      label: "实现证据 — 缺失",
      conclusion: "作品集呈现为视觉/产品设计师，非可交付生产 UI 的构建者。",
      supportingEvidence: ["高保真稿体现一定的布局实现意识"],
      missingEvidence: [
        "GitHub、Storybook 或组件文档",
        "性能、无障碍或响应式实现说明",
      ],
      reasoningProcess:
        "设计工程师 dealbreaker「无代码、原型或构建产物」已触发，覆盖维度均分对录用建议的影响。",
      confidenceScore: 91,
      recommendation: "用代码重建首页核心组件并嵌入案例链接（路线图第 1 周）。",
    },
    {
      id: "hire_tier",
      label: "建议：画像不匹配",
      conclusion: "与设计工程师岗位不匹配——建议视觉/产品方向，除非补充构建作品集。",
      supportingEvidence: ["视觉工艺与交互完整度突出"],
      missingEvidence: ["technical_fluency 全部主要证据类别"],
      reasoningProcess:
        "Persona 结论：视觉设计师画像。设计工程师 tier 为 mixed/no。若 30 天内补充可验证构建产物可重新评估。",
      confidenceScore: 87,
      recommendation: "优先投递产品/视觉岗位，或按路线图补齐构建证据。",
    },
  ],
}

export function getMockReviewTrace(
  locale: Locale,
  persona: ReviewerPersona
): ReviewTraceItem[] {
  const source = locale === "zh" ? TRACE_ZH : TRACE_EN
  return source[persona]
}

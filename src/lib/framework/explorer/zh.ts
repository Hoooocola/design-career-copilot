import type { FrameworkExplorerDimension } from "@/lib/framework/explorer/types"

export const EXPLORER_DIMENSIONS_ZH: FrameworkExplorerDimension[] = [
  {
    id: "problem_framing_strategy",
    categoryId: "product_strategy",
    title: "问题定义与战略",
    definition:
      "你如何识别、界定和排序问题——将工作与用户需求、约束和商业背景连接起来。",
    whyItMatters:
      "设计主管招聘的是判断力，不是单屏界面。高级岗位需要证明你在设计正确方案之前选对了正确问题。",
    evaluationCriteria: [
      "问题清晰度——具体、以用户为中心、有边界",
      "战略框架——与产品/商业目标关联",
      "AI 方案适配——论证为何用 AI 而非其他方案",
      "范围决策——展示你选择不做的事",
    ],
    exampleEvidence: [
      "含现状痛点与目标用户的问题陈述",
      "约束清单（时间线、利益相关方、技术限制）",
      "预先定义的成功指标或假设",
      "被拒绝的方向及理由",
    ],
    commonWeaknesses: [
      "直接展示最终 UI，不解释问题",
      "泛泛复述需求（如「提升体验」）",
      "AI 作为装饰，无能力分析",
    ],
  },
  {
    id: "user_research_discovery",
    categoryId: "experience_craft",
    title: "用户研究与探索",
    definition: "证明你通过研究、综合与验证理解用户——而非凭假设设计。",
    whyItMatters:
      "AI 产品会放大错误假设。探索严谨性区分「验证需求的设计师」与「美化需求的设计师」。",
    evaluationCriteria: [
      "研究方法——恰当且有描述",
      "合成质量——原始数据转化为可行动洞察",
      "研究→设计的可追溯链",
      "AI 心智模型——信任与自动化预期",
    ],
    exampleEvidence: [
      "访谈提纲、亲和图或合成产物",
      "洞察陈述与设计决策的关联",
      "用户引述及设计前后对比",
      "AI 场景的信任校准或心智模型发现",
    ],
    commonWeaknesses: [
      "无研究支撑的用户画像",
      "研究结论未体现在方案中",
      "AI 岗位缺少 AI 专属用户理解",
    ],
  },
  {
    id: "interaction_ux_design",
    categoryId: "experience_craft",
    title: "交互与体验设计",
    definition: "流程、信息架构、交互模式与端到端体验一致性的质量。",
    whyItMatters:
      "AI 界面在边界状态失败——加载、错误、部分结果。流程完整性体现生产就绪度。",
    evaluationCriteria: [
      "流程完整性——主路径 + 边界状态",
      "信息架构与导航",
      "AI 交互模式——流式、错误、用户控制",
      "辅助理解的微交互",
    ],
    exampleEvidence: [
      "含错误/空态/加载的端到端流程",
      "线框图或多轮探索记录",
      "AI 专属流程：输入、流式输出、修正",
      "可交互原型或演示视频",
    ],
    commonWeaknesses: [
      "仅单屏展示，无完整旅程",
      "AI 功能缺少错误或加载状态",
      "通用聊天 UI，无信息架构",
    ],
  },
  {
    id: "visual_craft_quality",
    categoryId: "experience_craft",
    title: "视觉设计与工艺",
    definition: "字体、色彩、版式与视觉层级——工艺服务于清晰，而非装饰。",
    whyItMatters:
      "AI 输出信息密度高，需要可扫读的层级。工艺证明你能交付清晰、有意的界面。",
    evaluationCriteria: [
      "视觉层级——一眼可辨优先级",
      "跨项目与状态的一致性",
      "AI 内容呈现——结构化、可区分",
      "字体与间距系统思维",
    ],
    exampleEvidence: [
      "层级清晰的高保真界面",
      "视觉迭代前后对比",
      "AI 与用户内容的视觉区分",
      "风格指南或 Token 文档",
    ],
    commonWeaknesses: [
      "Dribbble 式单图，无产品语境",
      "AI 回复区字体难以阅读",
      "同一项目内视觉语言不一致",
    ],
  },
  {
    id: "systems_thinking_scalability",
    categoryId: "systems_technical",
    title: "系统思维与可扩展性",
    definition: "设计可跨产品、团队与状态扩展的模式——而非一次性界面。",
    whyItMatters:
      "高级设计师被雇佣来放大影响力。系统思维证明你不会为每个 AI 状态从零重建。",
    evaluationCriteria: [
      "设计系统贡献——组件、Token、文档",
      "模式抽象——可复用 AI 状态库",
      "跨功能一致性",
      "10 倍规模下的可扩展性",
    ],
    exampleEvidence: [
      "含变体与状态的组件规范",
      "AI 加载/错误/部分结果模式库",
      "供其他设计师复用的文档",
      "Token 决策与命名规范",
    ],
    commonWeaknesses: [
      "每屏定制 UI，无可复用模式",
      "未覆盖多样模型行为的状态库",
      "仅页面级设计，无系统贡献",
    ],
  },
  {
    id: "technical_fluency_implementation",
    categoryId: "systems_technical",
    title: "技术实现能力",
    definition: "对工程约束、构建可行性的理解，以及与工程协作落地能力。",
    whyItMatters:
      "设计工程师必须能写代码。高级产品设计师需足够流利地与工程对话，降低 AI UI 交付风险。",
    evaluationCriteria: [
      "工程协作产物",
      "原型保真度——可交互，非仅静态",
      "组件/代码意识",
      "响应式、无障碍、生产级信号",
    ],
    exampleEvidence: [
      "在线原型链接或 GitHub 仓库",
      "组件架构或交付规范",
      "响应式断点文档",
      "无障碍实现说明",
    ],
    commonWeaknesses: [
      "纯图片作品集，无构建产物",
      "无工程协作证据",
      "无法展示响应式或无障碍实现",
    ],
  },
  {
    id: "collaboration_communication",
    categoryId: "communication_process",
    title: "协作与沟通",
    definition: "与产品、工程、研究和利益相关方协作的方式，以及设计意图的传达清晰度。",
    whyItMatters:
      "AI 功能需要紧密的跨职能循环。招聘方寻找能对齐团队的设计师，而非单打独斗者。",
    evaluationCriteria: [
      "跨职能合作证据",
      "利益相关方对齐与引导",
      "设计评审与反馈吸收",
      "对非设计受众的清晰度",
    ],
    exampleEvidence: [
      "工作坊引导或优先级框架",
      "列出 PM/工程/研究角色的团队署名",
      "展示反馈吸收的评审轮次",
      "高管摘要或利益相关方汇报",
    ],
    commonWeaknesses: [
      "无团队语境，像个人视觉练习",
      "提及协作但无证据",
      "个人贡献与团队产出边界不清",
    ],
  },
  {
    id: "impact_outcomes",
    categoryId: "product_strategy",
    title: "影响力与成果",
    definition: "可量化结果、商业成果，以及设计决策带来真实改变的证据。",
    whyItMatters:
      "现代招聘更看重成果而非过程表演。影响力证明区分高级候选人与精美作品集。",
    evaluationCriteria: [
      "有方法论的量化成果",
      "与设计决策关联的前后指标",
      "成果的商业背景",
      "诚实呈现混合结果与学习",
    ],
    exampleEvidence: [
      "含基线、上线指标、时间范围的 KPI",
      "A/B 测试或实验结果",
      "AI 功能的用户任务成功率",
      "数据驱动的上线后迭代",
    ],
    commonWeaknesses: [
      "所有项目零成果",
      "指标无基线或上下文",
      "概念稿却声称影响力",
    ],
  },
  {
    id: "ai_product_sense",
    categoryId: "product_strategy",
    title: "AI 工作流",
    definition: "设计 AI 辅助用户体验的能力——将 AI 视为行为，而非一个按钮。",
    whyItMatters:
      "对 AI 产品设计岗位至关重要。区分通用设计师与 AI 原生产品设计师的核心维度。",
    evaluationCriteria: [
      "工作流设计——处理不确定性、延迟、错误",
      "Prompt 与输入策略——引导、约束、上下文",
      "信任、透明度与用户控制",
      "评估流程——反馈闭环、AI 体验迭代",
      "人机协作与安全模式",
    ],
    exampleEvidence: [
      "含完整状态图的 AI 功能案例",
      "错误/幻觉恢复流程",
      "置信度 UI、引用来源与控制设置",
      "Prompt 模板与反馈机制",
    ],
    commonWeaknesses: [
      "套壳 ChatGPT，无原创 AI 体验思考",
      "无错误或幻觉处理",
      "高风险决策全自动，无人工审核",
      "声称 AI 能力但无 AI 项目证据",
    ],
  },
  {
    id: "process_storytelling",
    categoryId: "communication_process",
    title: "过程与叙事",
    definition: "你如何清晰传达思考过程、迭代、死胡同与学习。",
    whyItMatters:
      "评审者只花 15 分钟看作品集。叙事质量决定你的判断力被理解还是被略过。",
    evaluationCriteria: [
      "逻辑叙事弧——从问题到成果",
      "迭代证据——探索、转向、学习",
      "尊重评审时间——可扫读结构",
      "诚实呈现失败与取舍",
    ],
    exampleEvidence: [
      "多保真度演进（低保真→高保真）",
      "项目时间线或阶段分解",
      "被拒绝方案及理由",
      "复盘学习章节",
    ],
    commonWeaknesses: [
      "仅最终稿，无过程",
      "只展示成功，无死胡同",
      "案例过长、结构不清",
    ],
  },
  {
    id: "portfolio_presentation",
    categoryId: "communication_process",
    title: "作品集呈现",
    definition: "策展、相关性、专业度，以及作品集作为产品的整体质量。",
    whyItMatters:
      "呈现是第一道筛选——尤其 HR 与高流量招聘。差策展会埋没好作品。",
    evaluationCriteria: [
      "策展——与目标岗位相关的聚焦项目",
      "可扫读性与专业完成度",
      "岗位导向的框架与联系方式",
      "链接可用——原型与仓库可访问",
    ],
    exampleEvidence: [
      "含目标岗位与价值主张的封面",
      "4–6 个聚焦案例（非堆砌）",
      "可用的原型与仓库链接",
      "面向非设计读者的执行摘要",
    ],
    commonWeaknesses: [
      "项目组合与申请岗位不匹配",
      "链接失效或未脱敏保密信息",
      "无明确目标岗位或职级信号",
    ],
  },
]

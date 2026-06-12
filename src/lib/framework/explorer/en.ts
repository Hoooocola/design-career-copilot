import type { FrameworkExplorerDimension } from "@/lib/framework/explorer/types"

export const EXPLORER_DIMENSIONS_EN: FrameworkExplorerDimension[] = [
  {
    id: "problem_framing_strategy",
    categoryId: "product_strategy",
    title: "Problem Framing & Strategy",
    definition:
      "How you identify, scope, and prioritize problems — connecting work to user needs, constraints, and business context.",
    whyItMatters:
      "Design leads hire for judgment, not screens. Senior roles require proof you chose the right problem before designing the right solution.",
    evaluationCriteria: [
      "Problem clarity — specific, user-centered, bounded",
      "Strategic framing — ties to product/business goals",
      "AI solution fit — justifies why AI vs. alternatives",
      "Scope decisions — what you chose not to do",
    ],
    exampleEvidence: [
      "Problem statement with before-state pain and target user",
      "Constraints list (timeline, stakeholders, technical limits)",
      "Success metrics or hypotheses defined upfront",
      "Rejected directions with reasoning",
    ],
    commonWeaknesses: [
      "Starts with final UI, never explains the problem",
      "Generic brief restatement ('improve UX')",
      "AI added as decoration without capability analysis",
    ],
  },
  {
    id: "user_research_discovery",
    categoryId: "experience_craft",
    title: "User Research & Discovery",
    definition:
      "Evidence that you understand users through research, synthesis, and validation — not assumptions.",
    whyItMatters:
      "AI products amplify bad assumptions. Discovery rigor separates designers who validate needs from those who decorate briefs.",
    evaluationCriteria: [
      "Research methods — appropriate and described",
      "Synthesis quality — raw data → actionable insights",
      "Research-to-design traceability",
      "AI mental models — trust and automation expectations",
    ],
    exampleEvidence: [
      "Interview guides, affinity maps, or synthesis artifacts",
      "Insight statements linked to design decisions",
      "User quotes with before/after design impact",
      "Trust calibration or mental-model findings for AI",
    ],
    commonWeaknesses: [
      "Persona wallpaper with no research backing",
      "Research findings never referenced in solutions",
      "No AI-specific user understanding for AI roles",
    ],
  },
  {
    id: "interaction_ux_design",
    categoryId: "experience_craft",
    title: "Interaction & UX Design",
    definition:
      "Quality of flows, information architecture, interaction patterns, and end-to-end experience coherence.",
    whyItMatters:
      "AI interfaces fail in the edges — loading, errors, partial results. Flow completeness signals production readiness.",
    evaluationCriteria: [
      "Flow completeness — happy path + edge cases",
      "Information architecture and navigation",
      "AI interaction patterns — streaming, errors, control",
      "Microinteractions that aid comprehension",
    ],
    exampleEvidence: [
      "End-to-end user flows with error/empty/loading states",
      "Wireframes or exploration rounds showing iteration",
      "AI-specific flows: prompt input, streaming, correction",
      "Interactive prototype or video walkthrough",
    ],
    commonWeaknesses: [
      "Single hero screen with no full journey",
      "No error or loading states for AI features",
      "Generic chat UI with no information architecture",
    ],
  },
  {
    id: "visual_craft_quality",
    categoryId: "experience_craft",
    title: "Visual Design & Craft",
    definition:
      "Typography, color, layout, and visual hierarchy — craft as a tool for clarity, not decoration.",
    whyItMatters:
      "Dense AI output demands scannable hierarchy. Craft proves you can ship legible, intentional interfaces at scale.",
    evaluationCriteria: [
      "Visual hierarchy — priority parseable at a glance",
      "Consistency across projects and states",
      "AI content presentation — structured, distinguishable",
      "Typography and spacing system thinking",
    ],
    exampleEvidence: [
      "Hi-fi screens with clear typographic scale",
      "Before/after visual iteration comparisons",
      "AI vs. user content differentiation",
      "Style guide or token documentation",
    ],
    commonWeaknesses: [
      "Dribbble-style shots with no product context",
      "Illegible typography in AI response areas",
      "Inconsistent visual language within a project",
    ],
  },
  {
    id: "systems_thinking_scalability",
    categoryId: "systems_technical",
    title: "Systems Thinking & Scalability",
    definition:
      "Ability to design patterns that scale across products, teams, and states — not one-off screens.",
    whyItMatters:
      "Senior+ designers are hired to multiply impact. Systems thinking shows you won't rebuild every AI state from scratch.",
    evaluationCriteria: [
      "Design system contribution — components, tokens, docs",
      "Pattern abstraction — reusable AI state libraries",
      "Cross-feature consistency",
      "Scalability under 10x scope growth",
    ],
    exampleEvidence: [
      "Component specs with variants and states",
      "Pattern library for AI loading/error/partial states",
      "Documentation other designers can reuse",
      "Token decisions and naming conventions",
    ],
    commonWeaknesses: [
      "One-off custom UI per screen",
      "No reusable patterns for varied model behaviors",
      "Page-only designs with no system contribution",
    ],
  },
  {
    id: "technical_fluency_implementation",
    categoryId: "systems_technical",
    title: "Technical Fluency & Implementation",
    definition:
      "Understanding of engineering constraints, build feasibility, and ability to collaborate on implementation.",
    whyItMatters:
      "Design engineers must ship code. Product designers at senior level must speak engineering fluently enough to de-risk AI UI.",
    evaluationCriteria: [
      "Engineering collaboration artifacts",
      "Prototype fidelity — interactive, not static only",
      "Component/code awareness",
      "Responsive, accessible, production-grade signals",
    ],
    exampleEvidence: [
      "Live prototype links or GitHub repositories",
      "Component architecture or handoff specs",
      "Responsive breakpoint documentation",
      "Accessibility implementation notes",
    ],
    commonWeaknesses: [
      "Image-only portfolio with no build artifacts",
      "No evidence of engineering partnership",
      "Cannot demonstrate responsive or accessible implementation",
    ],
  },
  {
    id: "collaboration_communication",
    categoryId: "communication_process",
    title: "Collaboration & Communication",
    definition:
      "How you work with PM, engineering, research, and stakeholders — and how clearly you communicate design intent.",
    whyItMatters:
      "AI features require tight cross-functional loops. Hiring panels look for designers who align teams, not lone operators.",
    evaluationCriteria: [
      "Cross-functional partnership evidence",
      "Stakeholder alignment and facilitation",
      "Design critique and feedback integration",
      "Clarity for non-design audiences (HR, execs)",
    ],
    exampleEvidence: [
      "Workshop facilitation or prioritization frameworks",
      "Team credits naming PM, engineering, research roles",
      "Critique rounds showing feedback integration",
      "Executive summary or stakeholder decks",
    ],
    commonWeaknesses: [
      "No team context — reads as solo visual exercise",
      "Collaboration mentioned but not evidenced",
      "Unclear personal contribution vs. team output",
    ],
  },
  {
    id: "impact_outcomes",
    categoryId: "product_strategy",
    title: "Impact & Outcomes",
    definition:
      "Measurable results, business outcomes, and evidence that design decisions drove real change.",
    whyItMatters:
      "Modern hiring weighs outcomes over process theater. Impact proof separates senior candidates from polished portfolios.",
    evaluationCriteria: [
      "Quantified outcomes with methodology",
      "Before/after metrics tied to design decisions",
      "Business context for results",
      "Honest mixed results and learnings",
    ],
    exampleEvidence: [
      "KPIs with baseline, post-launch metric, timeframe",
      "A/B test or experiment results",
      "User task success rates for AI features",
      "Post-launch iteration driven by data",
    ],
    commonWeaknesses: [
      "Zero outcomes across all projects",
      "Metrics stated without baseline or context",
      "Concept-only work with impact claims",
    ],
  },
  {
    id: "ai_product_sense",
    categoryId: "product_strategy",
    title: "AI Workflow",
    definition:
      "Ability to design AI-assisted user experiences — treating AI as behavior, not a button.",
    whyItMatters:
      "Critical for AI Product Design roles. The primary differentiator between generalist designers and AI-native product designers.",
    evaluationCriteria: [
      "Workflow design — uncertainty, latency, errors handled",
      "Prompt & input strategy — guidance, constraints, context",
      "Trust, transparency, and user control",
      "Evaluation process — feedback loops, iteration on AI UX",
      "Human-AI collaboration and safety patterns",
    ],
    exampleEvidence: [
      "AI feature case study with full state map",
      "Error/hallucination recovery flows",
      "Confidence UI, citations, and control settings",
      "Prompt templates and feedback mechanisms",
    ],
    commonWeaknesses: [
      "ChatGPT wrapper with no original AI UX thinking",
      "No error or hallucination handling",
      "Automates high-stakes decisions without human review",
      "Claims AI expertise with no AI project evidence",
    ],
  },
  {
    id: "process_storytelling",
    categoryId: "communication_process",
    title: "Process & Storytelling",
    definition:
      "How clearly you communicate thinking process, iterations, dead ends, and learnings.",
    whyItMatters:
      "Reviewers spend 15 minutes on your portfolio. Narrative quality determines whether your judgment is understood or skimmed past.",
    evaluationCriteria: [
      "Logical narrative arc — problem to outcome",
      "Iteration evidence — explorations, pivots, learnings",
      "Respect for reviewer time — scannable structure",
      "Honesty about failures and tradeoffs",
    ],
    exampleEvidence: [
      "Multi-fidelity progression (lo-fi → hi-fi)",
      "Timeline or phase breakdown per project",
      "Rejected concepts with rationale",
      "Retrospective learnings section",
    ],
    commonWeaknesses: [
      "Only final polished screens, no process",
      "Win-only narrative with no dead ends",
      "Overlong case studies without clear structure",
    ],
  },
  {
    id: "portfolio_presentation",
    categoryId: "communication_process",
    title: "Portfolio Presentation",
    definition:
      "Curation, relevance, professionalism, and overall portfolio-as-product quality.",
    whyItMatters:
      "Presentation is the first filter — especially for HR and high-volume recruiting. Bad curation hides strong work.",
    evaluationCriteria: [
      "Curation — relevant, focused projects for target role",
      "Scannability and professional polish",
      "Role-targeted framing and contact clarity",
      "Link health — prototypes and repos work",
    ],
    exampleEvidence: [
      "Cover page with target role and value proposition",
      "4–6 focused case studies (not 20-page dump)",
      "Working prototype and repository links",
      "Executive summary for non-design readers",
    ],
    commonWeaknesses: [
      "Unfocused project mix for applied role",
      "Broken links or confidential data unredacted",
      "No clear target role or seniority signal",
    ],
  },
]

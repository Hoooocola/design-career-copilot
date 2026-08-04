import type { AnalysisStepId } from "@/types/analysis"

export const ANALYSIS_STEP_IDS: AnalysisStepId[] = [
  "parsing-portfolio",
  "understanding-projects",
  "analyzing-job-requirements",
  "detecting-skill-gaps",
  "generating-recommendations",
]

export const SESSION_KEYS = {
  portfolioFileName: "dcc-portfolio-file-name",
  jobDescription: "dcc-job-description",
  report: "dcc-report",
  reportId: "dcc-report-id",
  reportGeneratedAt: "dcc-report-generated-at",
  locale: "dcc-locale",
  reviewerPersona: "dcc-reviewer-persona",
  analyticsSessionId: "dcc-analytics-session-id",
} as const

export type AnalysisStepId =
  | "parsing-portfolio"
  | "understanding-projects"
  | "analyzing-job-requirements"
  | "detecting-skill-gaps"
  | "generating-recommendations"

export type AnalysisStepStatus = "pending" | "active" | "complete"

export interface AnalysisStep {
  id: AnalysisStepId
  label: string
  description: string
}

export interface AnalysisInput {
  portfolioFileName: string
  jobDescription: string
}

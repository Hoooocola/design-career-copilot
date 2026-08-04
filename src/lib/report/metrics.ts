import type { EvidenceInsight } from "@/types/framework"
import type { PortfolioBenchmark, PortfolioReport } from "@/types/report"

export function computeEvidenceCoverage(insights: EvidenceInsight[]): number {
  if (insights.length === 0) return 0
  const covered = insights.filter(
    (item) => item.evidenceType === "primary" || item.evidenceType === "secondary"
  ).length
  return Math.round((covered / insights.length) * 100)
}

export function computeTopPercentile(benchmark: PortfolioBenchmark): number {
  if (benchmark.percentileRanking.length === 0) return 50
  const avg =
    benchmark.percentileRanking.reduce((sum, item) => sum + item.percentile, 0) /
    benchmark.percentileRanking.length
  return Math.max(1, Math.min(99, Math.round(100 - avg)))
}

export type ReadinessBand = "exceptional" | "strong" | "developing" | "early"

export function getReadinessBand(score: number): ReadinessBand {
  if (score >= 85) return "exceptional"
  if (score >= 70) return "strong"
  if (score >= 50) return "developing"
  return "early"
}

export type ConfidenceLevel = "high" | "medium" | "low"

export function normalizeConfidence(value: string | undefined): ConfidenceLevel {
  if (value === "high") return "high"
  if (value === "low") return "low"
  return "medium"
}

export interface ReportScoreMetrics {
  score: number
  readiness: number
  evidenceCoverage: number
  topPercentile: number
  confidence: ConfidenceLevel
}

export function buildReportScoreMetrics(report: PortfolioReport): ReportScoreMetrics {
  return {
    score: report.matchScore,
    readiness: report.framework.competencyOverview.overallReadiness,
    evidenceCoverage: computeEvidenceCoverage(report.framework.evidenceInsights),
    topPercentile: computeTopPercentile(report.benchmark),
    confidence: normalizeConfidence(report.meta?.evidenceConfidence),
  }
}

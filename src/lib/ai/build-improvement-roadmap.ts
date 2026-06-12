import { getMockImprovementRoadmap } from "@/lib/mock-improvement-roadmap"
import type { Locale } from "@/lib/i18n"
import type { CareerImprovementRoadmap, PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

export function buildImprovementRoadmap(
  report: Pick<
    PortfolioReport,
    | "gapAnalysis"
    | "opportunityRanking"
    | "benchmark"
    | "weaknesses"
    | "meta"
  >,
  locale: Locale,
  persona: ReviewerPersona
): CareerImprovementRoadmap {
  const base = getMockImprovementRoadmap(locale, persona)

  const topGap = report.gapAnalysis.find((g) => g.impact === "high")
  const topOpportunity = report.opportunityRanking[0]
  const weakestBenchmark = [...report.benchmark.percentileRanking]
    .filter((item) => item.tier === "bottom")
    .sort((a, b) => a.percentile - b.percentile)[0]

  if (!topGap && !topOpportunity && !weakestBenchmark) {
    return base
  }

  const contextNote =
    locale === "zh"
      ? `本计划综合作品集分析、差距分析（${topGap?.area ?? "—"}）与基准结果（${weakestBenchmark?.dimensionId ?? "—"}）生成。`
      : `Synthesized from portfolio analysis, gap analysis (${topGap?.area ?? "—"}), and benchmark (${weakestBenchmark?.dimensionId ?? "—"}).`

  return {
    ...base,
    summary: `${base.summary} ${contextNote}`,
  }
}

export function ensureImprovementRoadmap(
  report: PortfolioReport,
  locale: Locale = "en"
): PortfolioReport {
  if (report.improvementRoadmap?.weeks?.length === 4) {
    return report
  }

  const persona = report.meta?.reviewerPersona ?? "design_lead"

  return {
    ...report,
    improvementRoadmap: buildImprovementRoadmap(report, locale, persona),
  }
}

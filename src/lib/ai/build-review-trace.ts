import { getMockReviewTrace } from "@/lib/mock-review-trace"
import type { Locale } from "@/lib/i18n"
import type { PortfolioReport, ReviewTraceItem } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

function injectReportValues(
  traces: ReviewTraceItem[],
  report: Pick<PortfolioReport, "matchScore" | "meta">,
  locale: Locale
): ReviewTraceItem[] {
  const tier = report.meta?.recommendationTier ?? "yes"
  const confidence = report.meta?.evidenceConfidence ?? "low"

  const tierLabel =
    locale === "zh"
      ? { strong_yes: "强烈推荐", yes: "通过", mixed: "待定", no: "不建议" }[tier] ??
        tier
      : { strong_yes: "Strong Yes", yes: "Yes", mixed: "Mixed", no: "No" }[tier] ??
        tier

  const confidenceBoost =
    confidence === "high" ? 8 : confidence === "medium" ? 4 : 0

  return traces.map((trace) => {
    if (trace.id === "match_score") {
      return {
        ...trace,
        label:
          locale === "zh"
            ? `匹配分 — ${report.matchScore}%`
            : `Match Score — ${report.matchScore}%`,
        confidenceScore: Math.min(
          95,
          trace.confidenceScore + confidenceBoost
        ),
      }
    }
    if (trace.id === "hire_tier") {
      return {
        ...trace,
        supportingEvidence: [
          ...trace.supportingEvidence,
          locale === "zh"
            ? `报告元数据：建议档位 ${tierLabel}，证据置信度 ${confidence}`
            : `Report meta: tier ${tierLabel}, evidence confidence ${confidence}`,
        ],
      }
    }
    return trace
  })
}

export function buildReviewTrace(
  report: Pick<PortfolioReport, "matchScore" | "meta">,
  locale: Locale,
  persona: ReviewerPersona
): ReviewTraceItem[] {
  return injectReportValues(getMockReviewTrace(locale, persona), report, locale)
}

export function ensureReviewTrace(
  report: PortfolioReport,
  locale: Locale = "en"
): PortfolioReport {
  if (report.reviewTrace?.length) {
    return report
  }

  const persona = report.meta?.reviewerPersona ?? "design_lead"

  return {
    ...report,
    reviewTrace: buildReviewTrace(report, locale, persona),
  }
}

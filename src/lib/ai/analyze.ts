import OpenAI from "openai"

import { buildReviewFramework } from "@/lib/ai/build-framework"
import { normalizeOpportunities } from "@/lib/ai/build-opportunity-ranking"
import { normalizeConsensusConflict } from "@/lib/ai/ensure-consensus-conflict"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts"
import type { ParsedPortfolio } from "@/lib/ai/parse-pdf"
import { PORTFOLIO_REPORT_JSON_SCHEMA } from "@/lib/ai/report-schema"
import { buildImprovementRoadmap } from "@/lib/ai/build-improvement-roadmap"
import { buildReviewTrace } from "@/lib/ai/build-review-trace"
import { getMockBenchmark } from "@/lib/mock-benchmark"
import { getMockReport } from "@/lib/mock-report"
import type { Locale } from "@/lib/i18n"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import type {
  ApplicableRole,
  RecommendationTier,
  EvidenceConfidence,
} from "@/types/rubric"
import type {
  CompetencyOverview,
  DimensionScore,
  EvidenceInsight,
} from "@/types/framework"

export interface AnalysisRequest {
  portfolio: ParsedPortfolio
  jobDescription: string
  locale?: Locale
  reviewerPersona?: ReviewerPersona
}

export interface PortfolioReportWithMeta extends PortfolioReport {
  meta?: {
    targetRole: ApplicableRole
    seniority: "junior" | "mid" | "senior" | "staff"
    recommendationTier: RecommendationTier
    evidenceConfidence: EvidenceConfidence
    reviewerPersona: ReviewerPersona
    source: "ai" | "mock"
    locale?: Locale
  }
}

interface RawAIReport {
  executiveSummary: string
  matchScore: number
  competencyOverview: CompetencyOverview
  dimensionScores: DimensionScore[]
  evidenceInsights: EvidenceInsight[]
  skillCoverage: PortfolioReport["skillCoverage"]
  strengths: string[]
  weaknesses: string[]
  opportunityRanking: PortfolioReport["opportunityRanking"]
  consensusConflict: PortfolioReport["consensusConflict"]
  gapAnalysis: PortfolioReport["gapAnalysis"]
  actionPlan: PortfolioReport["actionPlan"]
  meta: {
    targetRole: ApplicableRole
    seniority: "junior" | "mid" | "senior" | "staff"
    recommendationTier: RecommendationTier
    evidenceConfidence: EvidenceConfidence
    reviewerPersona: ReviewerPersona
  }
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const baseURL = process.env.OPENAI_BASE_URL
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  })
}

/** DeepSeek and other compatible providers do not support strict json_schema yet */
function usesStrictJsonSchema(): boolean {
  return !process.env.OPENAI_BASE_URL
}

function buildJsonObjectInstruction(): string {
  return `

## Output Format
Respond with a single valid JSON object only. No markdown code fences or extra text.
The JSON must include all required fields and match this schema:
${JSON.stringify(PORTFOLIO_REPORT_JSON_SCHEMA)}`
}

function parseReportResponse(raw: string, locale: Locale): PortfolioReportWithMeta {
  const parsed = JSON.parse(raw) as RawAIReport

  const report = {
    executiveSummary: parsed.executiveSummary,
    matchScore: Math.min(100, Math.max(0, Math.round(parsed.matchScore))),
    framework: buildReviewFramework({
      competencyOverview: parsed.competencyOverview,
      dimensionScores: parsed.dimensionScores,
      evidenceInsights: parsed.evidenceInsights,
    }),
    skillCoverage: parsed.skillCoverage,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    opportunityRanking: normalizeOpportunities(parsed.opportunityRanking),
    consensusConflict: normalizeConsensusConflict(parsed.consensusConflict),
    benchmark: getMockBenchmark(locale),
    gapAnalysis: parsed.gapAnalysis,
    actionPlan: parsed.actionPlan.sort((a, b) => a.priority - b.priority),
    meta: {
      ...parsed.meta,
      source: "ai" as const,
      locale,
    },
  }

  return {
    ...report,
    improvementRoadmap: buildImprovementRoadmap(
      report,
      locale,
      parsed.meta.reviewerPersona
    ),
    reviewTrace: buildReviewTrace(report, locale, parsed.meta.reviewerPersona),
  }
}

export async function analyzePortfolio(
  input: AnalysisRequest
): Promise<PortfolioReportWithMeta> {
  const locale = input.locale ?? "en"
  const persona = input.reviewerPersona ?? "design_lead"
  const client = getOpenAIClient()

  if (!client) {
    return getMockReport(locale, persona)
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o"
  const strictSchema = usesStrictJsonSchema()
  const systemPrompt =
    buildSystemPrompt(locale, persona) +
    (strictSchema ? "" : buildJsonObjectInstruction())

  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: buildUserPrompt(
          input.portfolio.text,
          input.jobDescription,
          {
            fileName: input.portfolio.fileName,
            pageCount: input.portfolio.pageCount,
          }
        ),
      },
    ],
    response_format: strictSchema
      ? {
          type: "json_schema",
          json_schema: {
            name: "portfolio_review_report",
            strict: true,
            schema: PORTFOLIO_REPORT_JSON_SCHEMA,
          },
        }
      : { type: "json_object" },
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("AI provider returned an empty response")
  }

  return parseReportResponse(content, locale)
}

import { NextRequest, NextResponse } from "next/server"

import { analyzePortfolio } from "@/lib/ai/analyze"
import { parsePortfolioPdf } from "@/lib/ai/parse-pdf"
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n"
import { DEFAULT_REVIEWER_PERSONA, isReviewerPersona } from "@/lib/reviewer"

export const runtime = "nodejs"
export const maxDuration = 120

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const MIN_JD_LENGTH = 50

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const portfolio = formData.get("portfolio")
    const jobDescription = formData.get("jobDescription")
    const localeRaw = formData.get("locale")
    const personaRaw = formData.get("reviewerPersona")
    const locale =
      typeof localeRaw === "string" && isLocale(localeRaw)
        ? localeRaw
        : DEFAULT_LOCALE
    const reviewerPersona =
      typeof personaRaw === "string" && isReviewerPersona(personaRaw)
        ? personaRaw
        : DEFAULT_REVIEWER_PERSONA

    if (!(portfolio instanceof File)) {
      return NextResponse.json(
        { error: "Portfolio PDF is required" },
        { status: 400 }
      )
    }

    if (typeof jobDescription !== "string" || jobDescription.trim().length < MIN_JD_LENGTH) {
      return NextResponse.json(
        { error: "Job description is required (minimum 50 characters)" },
        { status: 400 }
      )
    }

    if (portfolio.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      )
    }

    if (portfolio.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 20 MB limit" },
        { status: 413 }
      )
    }

    const buffer = Buffer.from(await portfolio.arrayBuffer())
    const parsed = await parsePortfolioPdf(buffer, portfolio.name)

    const report = await analyzePortfolio({
      portfolio: parsed,
      jobDescription: jobDescription.trim(),
      locale,
      reviewerPersona,
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("[analyze]", error)
    const message =
      error instanceof Error ? error.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

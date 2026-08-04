"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { ReportView } from "@/components/report/report-view"
import { useLocale } from "@/components/providers/locale-provider"
import { trackAnalyticsEvent } from "@/lib/analytics/client"
import { getPortfolioFile } from "@/lib/client/portfolio-store"
import { SESSION_KEYS } from "@/lib/constants"
import type { Locale } from "@/lib/i18n"
import { ensureOpportunityRanking } from "@/lib/ai/build-opportunity-ranking"
import { ensureImprovementRoadmap } from "@/lib/ai/build-improvement-roadmap"
import { ensureBenchmark } from "@/lib/ai/ensure-benchmark"
import { ensureReviewTrace } from "@/lib/ai/build-review-trace"
import { ensureConsensusConflict } from "@/lib/ai/ensure-consensus-conflict"
import { getMockReport } from "@/lib/mock-report"
import {
  DEFAULT_REVIEWER_PERSONA,
  isReviewerPersona,
} from "@/lib/reviewer"
import type { PortfolioReport } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"

function normalizeReport(report: PortfolioReport, locale: Locale) {
  return ensureReviewTrace(
    ensureImprovementRoadmap(
      ensureBenchmark(
        ensureConsensusConflict(ensureOpportunityRanking(report), locale),
        locale
      ),
      locale
    ),
    locale
  )
}

export function ReportPageClient() {
  const router = useRouter()
  const { locale } = useLocale()
  const [portfolioFileName, setPortfolioFileName] = useState<string>()
  const [assessmentDate, setAssessmentDate] = useState<Date>(() => new Date())
  const [report, setReport] = useState<PortfolioReport | null>(null)
  const [persona, setPersona] = useState<ReviewerPersona>(DEFAULT_REVIEWER_PERSONA)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastSyncRef = useRef<{ locale: string; persona: ReviewerPersona } | null>(
    null
  )

  const refetchReport = useCallback(
    async (targetLocale: Locale, targetPersona: ReviewerPersona) => {
      const file = await getPortfolioFile()
      const jd = sessionStorage.getItem(SESSION_KEYS.jobDescription)
      if (!file || !jd) return null

      const formData = new FormData()
      formData.append("portfolio", file)
      formData.append("jobDescription", jd)
      formData.append("locale", targetLocale)
      formData.append("reviewerPersona", targetPersona)

      const res = await fetch("/api/analyze", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")

      sessionStorage.setItem(SESSION_KEYS.report, JSON.stringify(data))
      sessionStorage.setItem(SESSION_KEYS.reviewerPersona, targetPersona)
      return data as PortfolioReport
    },
    []
  )

  const syncReport = useCallback(
    async (targetLocale: Locale, targetPersona: ReviewerPersona) => {
      const reportRaw = sessionStorage.getItem(SESSION_KEYS.report)
      let stored: PortfolioReport | null = null

      if (reportRaw) {
        try {
          stored = JSON.parse(reportRaw) as PortfolioReport
        } catch {
          stored = null
        }
      }

      if (
        !stored?.framework ||
        stored.meta?.source === "mock" ||
        !stored.meta?.source
      ) {
        setIsRefreshing(true)
        try {
          const updated = await refetchReport(targetLocale, targetPersona)
          if (updated?.meta?.source === "ai") {
            setReport(normalizeReport(updated, targetLocale))
            return
          }
        } catch {
          // Fall back to mock when AI is unavailable or request fails
        } finally {
          setIsRefreshing(false)
        }

        const mock = getMockReport(targetLocale, targetPersona)
        sessionStorage.setItem(SESSION_KEYS.report, JSON.stringify(mock))
        if (!sessionStorage.getItem(SESSION_KEYS.reportId)) {
          sessionStorage.setItem(SESSION_KEYS.reportId, crypto.randomUUID())
        }
        if (!sessionStorage.getItem(SESSION_KEYS.reportGeneratedAt)) {
          sessionStorage.setItem(SESSION_KEYS.reportGeneratedAt, new Date().toISOString())
        }
        setReport(mock)
        return
      }

      const localeMatch = stored.meta.locale === targetLocale
      const personaMatch = stored.meta.reviewerPersona === targetPersona

      if (localeMatch && personaMatch) {
        setReport(normalizeReport(stored, targetLocale))
        return
      }

      setIsRefreshing(true)
      try {
        const updated = await refetchReport(targetLocale, targetPersona)
        if (updated) setReport(normalizeReport(updated, targetLocale))
      } catch {
        setReport(getMockReport(targetLocale, targetPersona))
      } finally {
        setIsRefreshing(false)
      }
    },
    [refetchReport]
  )

  useEffect(() => {
    const fileName = sessionStorage.getItem(SESSION_KEYS.portfolioFileName)
    const jobDescription = sessionStorage.getItem(SESSION_KEYS.jobDescription)
    const storedPersona = sessionStorage.getItem(SESSION_KEYS.reviewerPersona)

    if (!fileName || !jobDescription) {
      router.replace("/")
      return
    }

    setPortfolioFileName(fileName)

    const storedGeneratedAt = sessionStorage.getItem(SESSION_KEYS.reportGeneratedAt)
    if (storedGeneratedAt) {
      setAssessmentDate(new Date(storedGeneratedAt))
    } else {
      const now = new Date().toISOString()
      sessionStorage.setItem(SESSION_KEYS.reportGeneratedAt, now)
      setAssessmentDate(new Date(now))
    }

    const activePersona =
      storedPersona && isReviewerPersona(storedPersona)
        ? storedPersona
        : DEFAULT_REVIEWER_PERSONA
    setPersona(activePersona)

    const prev = lastSyncRef.current
    if (!prev) {
      lastSyncRef.current = { locale, persona: activePersona }
      syncReport(locale, activePersona)
      return
    }

    if (prev.locale !== locale || prev.persona !== activePersona) {
      lastSyncRef.current = { locale, persona: activePersona }
      syncReport(locale, activePersona)
    }
  }, [router, locale, syncReport])

  const handlePersonaChange = useCallback(
    (next: ReviewerPersona) => {
      trackAnalyticsEvent("persona_switched", { persona: next })
      setPersona(next)
      sessionStorage.setItem(SESSION_KEYS.reviewerPersona, next)
      lastSyncRef.current = { locale, persona: next }
      syncReport(locale, next)
    },
    [locale, syncReport]
  )

  if (!portfolioFileName || !report) {
    return (
      <div className="report-canvas flex flex-1 items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-[var(--report-text-muted)]" />
      </div>
    )
  }

  return (
    <ReportView
      report={report}
      portfolioFileName={portfolioFileName}
      assessmentDate={assessmentDate}
      persona={persona}
      onPersonaChange={handlePersonaChange}
      isRefreshing={isRefreshing}
    />
  )
}

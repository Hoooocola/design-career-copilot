"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Circle, Loader2, AlertCircle } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/providers/locale-provider"
import { trackAnalyticsEvent } from "@/lib/analytics/client"
import { getPortfolioFile } from "@/lib/client/portfolio-store"
import { ANALYSIS_STEP_IDS, SESSION_KEYS } from "@/lib/constants"
import { translateApiError } from "@/lib/i18n/api-errors"
import { isLocale } from "@/lib/i18n"
import { DEFAULT_REVIEWER_PERSONA, isReviewerPersona } from "@/lib/reviewer"
import type { AnalysisStepStatus } from "@/types/analysis"
import { cn } from "@/lib/utils"

const STEP_DURATION_MS = 1800

export function AnalysisSteps() {
  const router = useRouter()
  const { messages, locale } = useLocale()
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(new Set())
  const [apiDone, setApiDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = useCallback(async () => {
    try {
      const file = await getPortfolioFile()
      console.log("DEBUG file:", file)
      const jd = sessionStorage.getItem(SESSION_KEYS.jobDescription)
      const storedLocale = sessionStorage.getItem(SESSION_KEYS.locale)
      const storedPersona = sessionStorage.getItem(SESSION_KEYS.reviewerPersona)
      const analysisLocale = storedLocale && isLocale(storedLocale) ? storedLocale : locale
      const analysisPersona =
        storedPersona && isReviewerPersona(storedPersona)
          ? storedPersona
          : DEFAULT_REVIEWER_PERSONA

      if (!file || !jd) {
        router.replace("/")
        return
      }

      const safeFile =
        file instanceof File
          ? new File([file], file.name, { type: file.type })
          : file

      const formData = new FormData()
      formData.append("portfolio", safeFile)
      formData.append("jobDescription", jd)
      formData.append("locale", analysisLocale)
      formData.append("reviewerPersona", analysisPersona)

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? messages.analyzing.errors.failed)
      }

      sessionStorage.setItem(SESSION_KEYS.report, JSON.stringify(data))
      sessionStorage.setItem(SESSION_KEYS.reportId, crypto.randomUUID())
      trackAnalyticsEvent("analysis_completed", {
        persona: analysisPersona,
        locale: analysisLocale,
        source: data.meta?.source ?? "unknown",
        matchScore: data.matchScore,
      })
      setApiDone(true)
    } catch (err) {
      const raw = err instanceof Error ? err.message : messages.analyzing.errors.failed
      setError(translateApiError(raw, locale))
    }
  }, [router, locale, messages.analyzing.errors.failed])

  useEffect(() => {
    runAnalysis()
  }, [runAnalysis])

  useEffect(() => {
    if (error) return
    if (activeIndex >= ANALYSIS_STEP_IDS.length - 1) return

    const timeout = setTimeout(() => {
      setCompletedIndices((prev) => new Set([...prev, activeIndex]))
      setActiveIndex((prev) => prev + 1)
    }, STEP_DURATION_MS)

    return () => clearTimeout(timeout)
  }, [activeIndex, error])

  useEffect(() => {
    if (error || !apiDone) return
    if (activeIndex < ANALYSIS_STEP_IDS.length - 1) return

    setCompletedIndices((prev) => new Set([...prev, activeIndex]))
    const timeout = setTimeout(() => router.push("/report"), 600)
    return () => clearTimeout(timeout)
  }, [apiDone, activeIndex, error, router])

  const progress = Math.round(
    ((completedIndices.size +
      (activeIndex < ANALYSIS_STEP_IDS.length && !apiDone ? 0.3 : 0)) /
      ANALYSIS_STEP_IDS.length) *
      100
  )

  const getStepStatus = (index: number): AnalysisStepStatus => {
    if (completedIndices.has(index)) return "complete"
    if (index === activeIndex) return "active"
    return "pending"
  }

  if (error) {
    return (
      <PageContainer size="narrow" className="py-20 sm:py-28">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
            <AlertCircle className="size-5 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {messages.analyzing.failed}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {error}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline">{messages.analyzing.backHome}</Button>
            </Link>
            <Button
              onClick={() => {
                setError(null)
                setApiDone(false)
                runAnalysis()
              }}
            >
              {messages.analyzing.retry}
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer size="narrow" className="py-20 sm:py-28">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/30">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {messages.analyzing.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {messages.analyzing.subtitle}
        </p>
      </div>

      <div className="mt-10 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">
            {messages.common.progress}
          </span>
          <span className="tabular-nums">{Math.min(progress, 100)}%</span>
        </div>
        <Progress value={Math.min(progress, 100)}>
          <ProgressTrack className="h-1.5">
            <ProgressIndicator className="bg-gradient-to-r from-primary/80 to-primary" />
          </ProgressTrack>
        </Progress>
      </div>

      <ul className="mt-10 space-y-1">
        {ANALYSIS_STEP_IDS.map((stepId, index) => {
          const step = messages.analyzing.steps[stepId]
          const status = getStepStatus(index)
          return (
            <li
              key={stepId}
              className={cn(
                "flex items-start gap-4 rounded-xl border px-4 py-4 transition-all duration-500",
                status === "active" &&
                  "border-border/80 bg-muted/40 shadow-[0_0_24px_-4px_oklch(0.55_0.15_265/0.15)]",
                status === "complete" && "border-border/40 bg-transparent opacity-70",
                status === "pending" && "border-transparent opacity-40"
              )}
            >
              <StepIcon status={status} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{step.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </PageContainer>
  )
}

function StepIcon({ status }: { status: AnalysisStepStatus }) {
  if (status === "complete") {
    return (
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Check className="size-3.5 text-primary" />
      </div>
    )
  }
  if (status === "active") {
    return (
      <div className="flex size-6 shrink-0 items-center justify-center">
        <Loader2 className="size-4 animate-spin text-foreground" />
      </div>
    )
  }
  return (
    <div className="flex size-6 shrink-0 items-center justify-center">
      <Circle className="size-3 text-muted-foreground/40" />
    </div>
  )
}

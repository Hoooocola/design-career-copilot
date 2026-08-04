"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"

import { JobDescriptionInput } from "@/components/landing/job-description-input"
import { PortfolioUpload } from "@/components/landing/portfolio-upload"
import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReviewerPersonasHint } from "@/components/landing/reviewer-personas-hint"
import { trackAnalyticsEvent } from "@/lib/analytics/client"
import { savePortfolioFile } from "@/lib/client/portfolio-store"
import { SESSION_KEYS } from "@/lib/constants"
import { DEFAULT_REVIEWER_PERSONA } from "@/lib/reviewer"

export function AnalysisForm() {
  const router = useRouter()
  const { messages, locale } = useLocale()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [errors, setErrors] = useState<{ file?: string; jd?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { file?: string; jd?: string } = {}
    if (!file) newErrors.file = messages.form.errors.fileRequired
    if (!jobDescription.trim()) newErrors.jd = messages.form.errors.jdRequired
    if (jobDescription.trim().length < 50) {
      newErrors.jd = messages.form.errors.jdTooShort
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await savePortfolioFile(file!)
      sessionStorage.setItem(SESSION_KEYS.portfolioFileName, file!.name)
      sessionStorage.setItem(SESSION_KEYS.jobDescription, jobDescription.trim())
      sessionStorage.setItem(SESSION_KEYS.locale, locale)
      sessionStorage.setItem(SESSION_KEYS.reviewerPersona, DEFAULT_REVIEWER_PERSONA)
      sessionStorage.removeItem(SESSION_KEYS.report)
      sessionStorage.removeItem(SESSION_KEYS.reportGeneratedAt)
      trackAnalyticsEvent("portfolio_uploaded", {
        fileName: file!.name,
        fileSize: file!.size,
      })
      trackAnalyticsEvent("jd_submitted", {
        jdLength: jobDescription.trim().length,
      })
      router.push("/analyzing")
    } catch {
      setErrors({ file: messages.form.errors.saveFailed })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{messages.form.title}</CardTitle>
        <CardDescription>{messages.form.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PortfolioUpload
            file={file}
            onFileChange={setFile}
            error={errors.file}
          />
          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
            error={errors.jd}
          />
          <ReviewerPersonasHint />
          <Button
            type="submit"
            size="lg"
            className="h-10 w-full gap-2 text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {messages.form.startingAnalysis}
              </>
            ) : (
              <>
                {messages.form.startAnalysis}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

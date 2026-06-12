"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"

import {
  CheckboxOption,
  FeedbackSection,
  FieldLabel,
  NpsInput,
  RadioOption,
  StarRatingInput,
} from "@/components/feedback/feedback-controls"
import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { trackAnalyticsEvent } from "@/lib/analytics/client"
import {
  PAY_FEATURE_IDS,
  VALUE_FEATURE_IDS,
} from "@/lib/feedback/constants"
import { getFeedbackContext } from "@/lib/feedback/report-context"
import {
  hasFeedbackForReport,
  saveFeedbackSubmission,
} from "@/lib/feedback/storage"
import type {
  FeedbackSubmission,
  PayFeatureId,
  PayIntent,
  PortfolioModifyIntent,
  PmfDisappointment,
  PriceTierId,
  PricingModelId,
  StarRating,
  ValueFeatureId,
} from "@/types/feedback"
import type { ReviewerPersona } from "@/types/reviewer"

const PRICING_MODEL_IDS = [
  "one_time",
  "monthly",
  "annual",
  "pay_per_portfolio",
  "school_license",
  "company_license",
] as const

const PRICE_TIER_IDS = [
  "free_only",
  "5",
  "10",
  "20",
  "50",
  "100_plus",
] as const

export function FeedbackFormPage() {
  const router = useRouter()
  const { messages, locale } = useLocale()
  const fb = messages.feedback

  const [ready, setReady] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState("")
  const [persona, setPersona] = useState<ReviewerPersona>("design_lead")

  const [accuracyScore, setAccuracyScore] = useState<StarRating>(3)
  const [trustScore, setTrustScore] = useState<StarRating>(3)
  const [mostAccurateConclusion, setMostAccurateConclusion] = useState("")
  const [leastAccurateConclusion, setLeastAccurateConclusion] = useState("")

  const [mostValuable, setMostValuable] = useState<ValueFeatureId[]>([])
  const [leastUseful, setLeastUseful] = useState<ValueFeatureId | null>(null)
  const [mostTimeSpent, setMostTimeSpent] = useState<ValueFeatureId | null>(null)
  const [learnedNew, setLearnedNew] = useState<"yes" | "no" | null>(null)
  const [whatLearned, setWhatLearned] = useState("")

  const [actionabilityScore, setActionabilityScore] = useState<StarRating>(3)
  const [willModify, setWillModify] = useState<PortfolioModifyIntent | null>(null)
  const [mostLikelyRec, setMostLikelyRec] = useState("")
  const [firstChange, setFirstChange] = useState("")

  const [wouldPay, setWouldPay] = useState<PayIntent | null>(null)
  const [payFeatures, setPayFeatures] = useState<PayFeatureId[]>([])
  const [whyPay, setWhyPay] = useState("")
  const [pricingModel, setPricingModel] = useState<PricingModelId | null>(null)
  const [priceTier, setPriceTier] = useState<PriceTierId | null>(null)

  const [pmf, setPmf] = useState<PmfDisappointment | null>(null)
  const [nps, setNps] = useState<number | null>(null)
  const [oneImprovement, setOneImprovement] = useState("")

  useEffect(() => {
    const ctx = getFeedbackContext()
    if (!ctx.hasReport) {
      router.replace("/")
      return
    }
    setReportId(ctx.reportId)
    setPersona(ctx.persona)
    if (hasFeedbackForReport(ctx.reportId)) {
      setSubmitted(true)
    }
    setReady(true)
  }, [router])

  const progress = useMemo(() => {
    let filled = 0
    const total = 8
    if (accuracyScore && trustScore) filled += 1
    if (mostValuable.length) filled += 1
    if (leastUseful) filled += 1
    if (actionabilityScore) filled += 1
    if (willModify) filled += 1
    if (wouldPay) filled += 1
    if (pmf) filled += 1
    if (nps !== null) filled += 1
    return Math.round((filled / total) * 100)
  }, [
    accuracyScore,
    trustScore,
    mostValuable,
    leastUseful,
    actionabilityScore,
    willModify,
    wouldPay,
    pmf,
    nps,
  ])

  const toggleValuable = (id: ValueFeatureId) => {
    setMostValuable((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const togglePayFeature = (id: PayFeatureId) => {
    setPayFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    const submission: FeedbackSubmission = {
      id: crypto.randomUUID(),
      reportId,
      persona,
      locale,
      timestamp: Date.now(),
      accuracyScore,
      trustScore,
      mostAccurateConclusion: mostAccurateConclusion.trim(),
      leastAccurateConclusion: leastAccurateConclusion.trim(),
      mostValuableFeatures: mostValuable,
      leastUsefulFeature: leastUseful,
      mostTimeSpentSection: mostTimeSpent,
      learnedSomethingNew: learnedNew,
      whatLearned: whatLearned.trim(),
      actionabilityScore,
      willModifyPortfolio: willModify,
      mostLikelyRecommendation: mostLikelyRec.trim(),
      firstThingToChange: firstChange.trim(),
      wouldPay,
      willingToPayFeatures: payFeatures,
      whyPayForFeature: whyPay.trim(),
      pricingModel,
      priceWillingness: priceTier,
      pmfDisappointment: pmf,
      npsScore: nps,
      oneImprovement: oneImprovement.trim(),
    }
    saveFeedbackSubmission(submission)

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
    } catch {
      // Local copy still saved — server sync best-effort for beta
    }

    trackAnalyticsEvent("feedback_submitted", {
      reportId,
      persona,
      accuracyScore,
      trustScore,
      actionabilityScore,
    })

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!ready) return null

  if (submitted) {
    return (
      <PageContainer size="narrow" className="py-16 sm:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <Check className="size-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{fb.success.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {fb.success.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" nativeButton={false} render={<Link href="/report" />}>
              {fb.success.backToReport}
            </Button>
            <Button nativeButton={false} render={<Link href="/" />}>
              {fb.success.newAnalysis}
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer size="narrow" className="py-10 sm:py-14">
      <Link
        href="/report"
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        {fb.backToReport}
      </Link>

      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {fb.badge}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {fb.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {fb.subtitle}
        </p>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{fb.progress}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-primary/80 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <FeedbackSection title={fb.sections.trust.title}>
          <StarRatingInput
            label={fb.sections.trust.accuracy}
            value={accuracyScore}
            onChange={setAccuracyScore}
          />
          <StarRatingInput
            label={fb.sections.trust.trust}
            value={trustScore}
            onChange={setTrustScore}
          />
          <div className="space-y-2">
            <FieldLabel>{fb.sections.trust.mostAccurate}</FieldLabel>
            <Textarea
              value={mostAccurateConclusion}
              onChange={(e) => setMostAccurateConclusion(e.target.value)}
              placeholder={fb.placeholders.optional}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.trust.leastAccurate}</FieldLabel>
            <Textarea
              value={leastAccurateConclusion}
              onChange={(e) => setLeastAccurateConclusion(e.target.value)}
              placeholder={fb.placeholders.optional}
              rows={3}
            />
          </div>
        </FeedbackSection>

        <FeedbackSection title={fb.sections.value.title}>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.value.mostValuable}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {VALUE_FEATURE_IDS.map((id) => (
                <CheckboxOption
                  key={id}
                  checked={mostValuable.includes(id)}
                  onChange={() => toggleValuable(id)}
                  label={fb.features.value[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.value.leastUseful}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {VALUE_FEATURE_IDS.map((id) => (
                <RadioOption
                  key={id}
                  name="leastUseful"
                  checked={leastUseful === id}
                  onChange={() => setLeastUseful(id)}
                  label={fb.features.value[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.value.mostTime}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {VALUE_FEATURE_IDS.map((id) => (
                <RadioOption
                  key={id}
                  name="mostTime"
                  checked={mostTimeSpent === id}
                  onChange={() => setMostTimeSpent(id)}
                  label={fb.features.value[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <FieldLabel>{fb.sections.value.learnedNew}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <RadioOption
                name="learned"
                checked={learnedNew === "yes"}
                onChange={() => setLearnedNew("yes")}
                label={fb.options.yes}
              />
              <RadioOption
                name="learned"
                checked={learnedNew === "no"}
                onChange={() => setLearnedNew("no")}
                label={fb.options.no}
              />
            </div>
            {learnedNew === "yes" && (
              <Textarea
                value={whatLearned}
                onChange={(e) => setWhatLearned(e.target.value)}
                placeholder={fb.sections.value.whatLearned}
                rows={3}
              />
            )}
          </div>
        </FeedbackSection>

        <FeedbackSection title={fb.sections.actionability.title}>
          <StarRatingInput
            label={fb.sections.actionability.rating}
            value={actionabilityScore}
            onChange={setActionabilityScore}
          />
          <div className="space-y-2">
            <FieldLabel>{fb.sections.actionability.willModify}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                ["definitely", "probably", "not_sure", "no"] as PortfolioModifyIntent[]
              ).map((id) => (
                <RadioOption
                  key={id}
                  name="willModify"
                  checked={willModify === id}
                  onChange={() => setWillModify(id)}
                  label={fb.options.modify[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.actionability.mostLikely}</FieldLabel>
            <Textarea
              value={mostLikelyRec}
              onChange={(e) => setMostLikelyRec(e.target.value)}
              placeholder={fb.placeholders.optional}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.actionability.firstChange}</FieldLabel>
            <Textarea
              value={firstChange}
              onChange={(e) => setFirstChange(e.target.value)}
              placeholder={fb.placeholders.optional}
              rows={2}
            />
          </div>
        </FeedbackSection>

        <FeedbackSection
          title={fb.sections.pricing.title}
          description={fb.sections.pricing.description}
        >
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pricing.wouldPay}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {(["yes", "maybe", "no"] as PayIntent[]).map((id) => (
                <RadioOption
                  key={id}
                  name="wouldPay"
                  checked={wouldPay === id}
                  onChange={() => setWouldPay(id)}
                  label={fb.options.payIntent[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pricing.payFeatures}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAY_FEATURE_IDS.map((id) => (
                <CheckboxOption
                  key={id}
                  checked={payFeatures.includes(id)}
                  onChange={() => togglePayFeature(id)}
                  label={fb.features.pay[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pricing.whyPay}</FieldLabel>
            <Textarea
              value={whyPay}
              onChange={(e) => setWhyPay(e.target.value)}
              placeholder={fb.placeholders.optional}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pricing.pricingModel}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRICING_MODEL_IDS.map((id) => (
                <RadioOption
                  key={id}
                  name="pricingModel"
                  checked={pricingModel === id}
                  onChange={() => setPricingModel(id)}
                  label={fb.options.pricingModel[id]}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pricing.priceAmount}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {PRICE_TIER_IDS.map((id) => (
                <RadioOption
                  key={id}
                  name="priceTier"
                  checked={priceTier === id}
                  onChange={() => setPriceTier(id)}
                  label={fb.options.priceTier[id]}
                />
              ))}
            </div>
          </div>
        </FeedbackSection>

        <FeedbackSection title={fb.sections.pmf.title}>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.pmf.disappointment}</FieldLabel>
            <div className="grid gap-2">
              {(["very", "somewhat", "not"] as PmfDisappointment[]).map((id) => (
                <RadioOption
                  key={id}
                  name="pmf"
                  checked={pmf === id}
                  onChange={() => setPmf(id)}
                  label={fb.options.pmf[id]}
                />
              ))}
            </div>
          </div>
          <NpsInput
            label={fb.sections.pmf.nps}
            value={nps}
            onChange={setNps}
          />
        </FeedbackSection>

        <FeedbackSection title={fb.sections.final.title}>
          <div className="space-y-2">
            <FieldLabel>{fb.sections.final.question}</FieldLabel>
            <Textarea
              value={oneImprovement}
              onChange={(e) => setOneImprovement(e.target.value)}
              placeholder={fb.placeholders.final}
              rows={4}
            />
          </div>
        </FeedbackSection>

        <div className="sticky bottom-4 z-10 rounded-xl border border-border/60 bg-background/90 p-4 backdrop-blur-md">
          <Button type="submit" size="lg" className="w-full">
            {fb.submit}
          </Button>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fb.privacyNote}
          </p>
        </div>
      </form>
    </PageContainer>
  )
}

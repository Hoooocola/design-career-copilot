import {
  PAY_FEATURE_IDS,
  PRICE_TIER_IDS,
  VALUE_FEATURE_IDS,
} from "@/lib/feedback/constants"
import { getFeedbackSubmissions } from "@/lib/feedback/storage"
import type {
  FeedbackAnalytics,
  FeedbackSubmission,
  PayFeatureId,
  PriceTierId,
  PmfDisappointment,
  ValueFeatureId,
} from "@/types/feedback"

const PMF_WEIGHT: Record<PmfDisappointment, number> = {
  very: 100,
  somewhat: 50,
  not: 0,
}

function average(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function topKey<T extends string>(
  counts: Map<T, number>
): T | null {
  let top: T | null = null
  let max = 0
  for (const [key, count] of counts) {
    if (count > max) {
      max = count
      top = key
    }
  }
  return top
}

function countByDate(submissions: FeedbackSubmission[]) {
  const map = new Map<string, number>()
  for (const item of submissions) {
    const date = new Date(item.timestamp).toISOString().slice(0, 10)
    map.set(date, (map.get(date) ?? 0) + 1)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

export function buildFeedbackAnalytics(
  submissions: FeedbackSubmission[]
): FeedbackAnalytics {
  if (!submissions.length) {
    return {
      feedbackCount: 0,
      avgTrustScore: 0,
      avgAccuracyScore: 0,
      avgActionabilityScore: 0,
      mostValuableFeature: null,
      leastValuableFeature: null,
      mostWillingToPayFeature: null,
      priceDistribution: PRICE_TIER_IDS.map((tier) => ({ tier, count: 0 })),
      npsScore: 0,
      pmfScore: 0,
      trend: [],
      valuableFeatureCounts: VALUE_FEATURE_IDS.map((id) => ({ id, count: 0 })),
      payFeatureCounts: PAY_FEATURE_IDS.map((id) => ({ id, count: 0 })),
      source: "empty",
    }
  }

  const valuableCounts = new Map<ValueFeatureId, number>()
  const leastUsefulCounts = new Map<ValueFeatureId, number>()
  const payCounts = new Map<PayFeatureId, number>()
  const priceCounts = new Map<PriceTierId, number>()

  for (const id of VALUE_FEATURE_IDS) {
    valuableCounts.set(id, 0)
    leastUsefulCounts.set(id, 0)
  }
  for (const id of PAY_FEATURE_IDS) payCounts.set(id, 0)
  for (const tier of PRICE_TIER_IDS) priceCounts.set(tier, 0)

  for (const item of submissions) {
    for (const feature of item.mostValuableFeatures) {
      valuableCounts.set(feature, (valuableCounts.get(feature) ?? 0) + 1)
    }
    if (item.leastUsefulFeature) {
      leastUsefulCounts.set(
        item.leastUsefulFeature,
        (leastUsefulCounts.get(item.leastUsefulFeature) ?? 0) + 1
      )
    }
    for (const feature of item.willingToPayFeatures) {
      payCounts.set(feature, (payCounts.get(feature) ?? 0) + 1)
    }
    if (item.priceWillingness) {
      priceCounts.set(
        item.priceWillingness,
        (priceCounts.get(item.priceWillingness) ?? 0) + 1
      )
    }
  }

  const npsValues = submissions
    .map((item) => item.npsScore)
    .filter((score): score is number => score !== null)
  const pmfValues = submissions
    .map((item) => item.pmfDisappointment)
    .filter((value): value is PmfDisappointment => value !== null)
    .map((value) => PMF_WEIGHT[value])

  return {
    feedbackCount: submissions.length,
    avgTrustScore: average(submissions.map((item) => item.trustScore)),
    avgAccuracyScore: average(submissions.map((item) => item.accuracyScore)),
    avgActionabilityScore: average(
      submissions.map((item) => item.actionabilityScore)
    ),
    mostValuableFeature: topKey(valuableCounts),
    leastValuableFeature: topKey(leastUsefulCounts),
    mostWillingToPayFeature: topKey(payCounts),
    priceDistribution: PRICE_TIER_IDS.map((tier) => ({
      tier,
      count: priceCounts.get(tier) ?? 0,
    })),
    npsScore: average(npsValues),
    pmfScore: average(pmfValues),
    trend: countByDate(submissions),
    valuableFeatureCounts: VALUE_FEATURE_IDS.map((id) => ({
      id,
      count: valuableCounts.get(id) ?? 0,
    })).sort((a, b) => b.count - a.count),
    payFeatureCounts: PAY_FEATURE_IDS.map((id) => ({
      id,
      count: payCounts.get(id) ?? 0,
    })).sort((a, b) => b.count - a.count),
    source: "live",
  }
}

export function aggregateFeedbackAnalytics(): FeedbackAnalytics {
  return buildFeedbackAnalytics(getFeedbackSubmissions())
}

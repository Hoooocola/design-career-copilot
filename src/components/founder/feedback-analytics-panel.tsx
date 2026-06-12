"use client"

import { useEffect, useState } from "react"
import { MessageSquare, ThumbsUp, TrendingUp } from "lucide-react"

import { AnalyticsPanel } from "@/components/founder/analytics-panel"
import { useLocale } from "@/components/providers/locale-provider"
import type { FeedbackAnalytics } from "@/types/feedback"
import { formatCount, formatPercent } from "@/lib/founder-analytics/format"
import type { PayFeatureId, PriceTierId, ValueFeatureId } from "@/types/feedback"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
  "bg-sky-500/75",
  "bg-violet-500/75",
  "bg-emerald-500/75",
  "bg-amber-500/75",
  "bg-rose-500/75",
  "bg-cyan-500/75",
]

export function FeedbackAnalyticsPanel() {
  const { messages } = useLocale()
  const fa = messages.founder.feedbackAnalytics
  const featureLabels = messages.feedback.features
  const [data, setData] = useState<FeedbackAnalytics | null>(null)

  useEffect(() => {
    fetch("/api/feedback")
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthorized")
        const json = (await res.json()) as { analytics: FeedbackAnalytics }
        setData(json.analytics)
      })
      .catch(() => {
        setData({
          feedbackCount: 0,
          avgTrustScore: 0,
          avgAccuracyScore: 0,
          avgActionabilityScore: 0,
          mostValuableFeature: null,
          leastValuableFeature: null,
          mostWillingToPayFeature: null,
          priceDistribution: [],
          npsScore: 0,
          pmfScore: 0,
          trend: [],
          valuableFeatureCounts: [],
          payFeatureCounts: [],
          source: "empty",
        })
      })
  }, [])

  if (!data) return null

  const maxValuable = Math.max(
    ...data.valuableFeatureCounts.map((item) => item.count),
    1
  )
  const maxPrice = Math.max(...data.priceDistribution.map((item) => item.count), 1)
  const maxTrend = Math.max(...data.trend.map((item) => item.count), 1)
  const topPay = data.payFeatureCounts.filter((item) => item.count > 0).slice(0, 6)
  const payTotal = topPay.reduce((sum, item) => sum + item.count, 0) || 1

  return (
    <AnalyticsPanel
      title={fa.title}
      description={fa.description}
      action={
        data.source === "live" ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            {fa.liveData}
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fa.noData}
          </span>
        )
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MetricTile label={fa.metrics.feedbackCount} value={formatCount(data.feedbackCount)} />
          <MetricTile
            label={fa.metrics.avgTrust}
            value={data.avgTrustScore ? data.avgTrustScore.toFixed(1) : "—"}
            suffix="/5"
          />
          <MetricTile
            label={fa.metrics.avgAccuracy}
            value={data.avgAccuracyScore ? data.avgAccuracyScore.toFixed(1) : "—"}
            suffix="/5"
          />
          <MetricTile
            label={fa.metrics.avgActionability}
            value={data.avgActionabilityScore ? data.avgActionabilityScore.toFixed(1) : "—"}
            suffix="/5"
          />
          <MetricTile
            label={fa.metrics.nps}
            value={data.npsScore ? data.npsScore.toFixed(1) : "—"}
            suffix="/10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <HighlightCard
            icon={<ThumbsUp className="size-3.5" />}
            label={fa.metrics.mostValuable}
            value={
              data.mostValuableFeature
                ? featureLabels.value[data.mostValuableFeature as ValueFeatureId]
                : "—"
            }
          />
          <HighlightCard
            icon={<MessageSquare className="size-3.5" />}
            label={fa.metrics.leastValuable}
            value={
              data.leastValuableFeature
                ? featureLabels.value[data.leastValuableFeature as ValueFeatureId]
                : "—"
            }
          />
          <HighlightCard
            icon={<TrendingUp className="size-3.5" />}
            label={fa.metrics.mostWillingToPay}
            value={
              data.mostWillingToPayFeature
                ? featureLabels.pay[data.mostWillingToPayFeature as PayFeatureId]
                : "—"
            }
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartBlock title={fa.charts.valuableFeatures}>
            <div className="space-y-2">
              {data.valuableFeatureCounts.slice(0, 8).map((item, index) => (
                <BarRow
                  key={item.id}
                  label={featureLabels.value[item.id]}
                  value={item.count}
                  max={maxValuable}
                  colorClass={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </div>
          </ChartBlock>

          <ChartBlock title={fa.charts.priceDistribution}>
            <div className="space-y-2">
              {data.priceDistribution.map((item, index) => (
                <BarRow
                  key={item.tier}
                  label={messages.feedback.options.priceTier[item.tier as PriceTierId]}
                  value={item.count}
                  max={maxPrice}
                  colorClass={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </div>
          </ChartBlock>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartBlock title={fa.charts.payFeatures}>
            {topPay.length ? (
              <div className="flex flex-wrap items-center gap-4">
                <PieChart
                  slices={topPay.map((item, index) => ({
                    label: featureLabels.pay[item.id],
                    value: item.count,
                    colorClass: CHART_COLORS[index % CHART_COLORS.length],
                  }))}
                />
                <ul className="min-w-0 flex-1 space-y-1.5">
                  {topPay.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            CHART_COLORS[index % CHART_COLORS.length]
                          )}
                        />
                        {featureLabels.pay[item.id]}
                      </span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {formatPercent((item.count / payTotal) * 100, 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{fa.noData}</p>
            )}
          </ChartBlock>

          <ChartBlock title={fa.charts.trend}>
            {data.trend.length ? (
              <div className="flex h-32 items-end gap-1.5">
                {data.trend.map((point) => (
                  <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-sky-500/70 transition-all"
                      style={{
                        height: `${Math.max(8, (point.count / maxTrend) * 100)}%`,
                      }}
                      title={`${point.date}: ${point.count}`}
                    />
                    <span className="font-mono text-[8px] text-muted-foreground/70">
                      {point.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{fa.noData}</p>
            )}
          </ChartBlock>
        </div>

        <div className="rounded-lg border border-border/40 bg-muted/10 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fa.metrics.pmfScore}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            {data.pmfScore ? formatPercent(data.pmfScore, 0) : "—"}
          </p>
        </div>
      </div>
    </AnalyticsPanel>
  )
}

function MetricTile({
  label,
  value,
  suffix,
}: {
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5">
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-muted-foreground">{suffix}</span>
        )}
      </p>
    </div>
  )
}

function HighlightCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="font-mono text-[9px] uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm font-medium leading-snug">{value}</p>
    </div>
  )
}

function ChartBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-4">
      <p className="mb-3 text-sm font-medium">{title}</p>
      {children}
    </div>
  )
}

function BarRow({
  label,
  value,
  max,
  colorClass,
}: {
  label: string
  value: number
  max: number
  colorClass: string
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[minmax(120px,1fr)_1fr_auto] sm:items-center">
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <div className="h-2 overflow-hidden rounded-sm bg-muted/60">
        <div
          className={cn("h-full rounded-sm", colorClass)}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums">{formatCount(value)}</span>
    </div>
  )
}

function PieChart({
  slices,
}: {
  slices: { label: string; value: number; colorClass: string }[]
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1
  let cumulative = 0
  const gradient = slices
    .map((slice) => {
      const start = (cumulative / total) * 100
      cumulative += slice.value
      const end = (cumulative / total) * 100
      const colorMap: Record<string, string> = {
        "bg-sky-500/75": "oklch(0.58 0.14 245)",
        "bg-violet-500/75": "oklch(0.55 0.18 300)",
        "bg-emerald-500/75": "oklch(0.62 0.17 155)",
        "bg-amber-500/75": "oklch(0.72 0.14 75)",
        "bg-rose-500/75": "oklch(0.58 0.18 25)",
        "bg-cyan-500/75": "oklch(0.62 0.12 200)",
      }
      return `${colorMap[slice.colorClass] ?? "oklch(0.55 0.1 260)"} ${start}% ${end}%`
    })
    .join(", ")

  return (
    <div
      className="size-28 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${gradient})` }}
      aria-hidden
    />
  )
}

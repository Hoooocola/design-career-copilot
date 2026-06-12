"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  ChevronRight,
  Clock,
  MessageSquare,
  Target,
  Users,
  Zap,
} from "lucide-react"

import { AnalyticsPanel } from "@/components/founder/analytics-panel"
import { FeedbackAnalyticsPanel } from "@/components/founder/feedback-analytics-panel"
import { PageContainer } from "@/components/layout/page-container"
import { useLocale } from "@/components/providers/locale-provider"
import { Badge } from "@/components/ui/badge"
import {
  formatCount,
  formatDuration,
  formatOptionalDuration,
  formatPercent,
} from "@/lib/founder-analytics/format"
import type { BetaMetrics } from "@/types/analytics"
import type { FounderAnalyticsData } from "@/types/founder-analytics"
import type { FunnelStepId, FounderSectionId } from "@/types/founder-analytics"
import type { EngagementSectionId } from "@/types/engagement"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
  "bg-sky-500/75",
  "bg-violet-500/75",
  "bg-emerald-500/75",
  "bg-amber-500/75",
]

const EMPTY_FOUNDER: FounderAnalyticsData = {
  periodLabel: "all",
  lastUpdated: new Date().toISOString(),
  source: "empty",
  overview: {
    totalSessions: 0,
    activeUsers7d: 0,
    reportCompletionRate: 0,
    feedbackSubmissionRate: 0,
    avgReportDwellMs: 0,
  },
  funnel: [],
  sectionEngagement: [],
  reviewerUsage: [],
  feedback: {
    helpfulRate: 0,
    actionabilityRate: 0,
    totalResponses: 0,
    helpfulCount: 0,
    actionabilityCount: 0,
  },
}

const EMPTY_METRICS: BetaMetrics = {
  totalVisitors: 0,
  analysisCompletionRate: 0,
  feedbackSubmissionRate: 0,
  personaDistribution: [],
  popularModules: [],
  avgSessionDurationMs: 0,
  eventCount: 0,
  source: "empty",
}

export function FounderDashboardPage() {
  const { messages, locale } = useLocale()
  const fd = messages.founder
  const [data, setData] = useState<FounderAnalyticsData | null>(null)
  const [metrics, setMetrics] = useState<BetaMetrics | null>(null)

  useEffect(() => {
    fetch("/api/analytics/events")
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthorized")
        const json = (await res.json()) as {
          founder: FounderAnalyticsData
          metrics: BetaMetrics
        }
        setData(json.founder)
        setMetrics(json.metrics)
      })
      .catch(() => {
        setData(EMPTY_FOUNDER)
        setMetrics(EMPTY_METRICS)
      })
  }, [])

  const maxFunnelCount = useMemo(
    () => Math.max(...(data?.funnel.map((step) => step.count) ?? [1])),
    [data]
  )

  const maxSectionViewers = useMemo(
    () =>
      Math.max(
        ...(data?.sectionEngagement.map((section) => section.viewers) ?? [1])
      ),
    [data]
  )

  const maxReviewerUsage = useMemo(
    () =>
      Math.max(...(data?.reviewerUsage.map((item) => item.usageCount) ?? [1])),
    [data]
  )

  const maxModuleCount = useMemo(
    () => Math.max(...(metrics?.popularModules.map((item) => item.count) ?? [1])),
    [metrics]
  )

  if (!data || !metrics) return null

  const isLive = data.source === "live"
  const sectionLabels = fd.sectionEngagement.sections
  const moduleLabel = (sectionId: EngagementSectionId | "roadmap") => {
    if (sectionId === "roadmap") return sectionLabels.roadmap
    return sectionLabels[sectionId as keyof typeof sectionLabels] ?? sectionId
  }

  return (
    <PageContainer size="wide" className="max-w-7xl py-8 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              {fd.badge}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider",
                isLive
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {isLive ? fd.liveData : fd.noData}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {fd.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {fd.subtitle}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {fd.periodAll}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {fd.updated} {new Date(data.lastUpdated).toLocaleString(locale)}
          </p>
        </div>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={fd.kpi.sessions}
          value={formatCount(data.overview.totalSessions)}
          icon={<Users className="size-3.5" />}
        />
        <KpiCard
          label={fd.kpi.completion}
          value={formatPercent(data.overview.reportCompletionRate)}
          icon={<Target className="size-3.5" />}
        />
        <KpiCard
          label={fd.kpi.feedbackRate}
          value={formatPercent(data.overview.feedbackSubmissionRate)}
          icon={<MessageSquare className="size-3.5" />}
        />
        <KpiCard
          label={fd.kpi.avgSessionDuration}
          value={formatDuration(data.overview.avgReportDwellMs)}
          icon={<Clock className="size-3.5" />}
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <KpiCard
          label={fd.kpi.activeUsers}
          value={formatCount(data.overview.activeUsers7d)}
          icon={<Activity className="size-3.5" />}
        />
        <KpiCard
          label={fd.betaMetrics.eventCount}
          value={formatCount(metrics.eventCount)}
          icon={<Zap className="size-3.5" />}
        />
      </div>

      <div className="space-y-5">
        <AnalyticsPanel
          title={fd.funnel.title}
          description={fd.funnel.description}
        >
          {!isLive ? (
            <EmptyNotice message={fd.noData} />
          ) : (
            <div className="space-y-2">
              {data.funnel.map((step, index) => {
                const width = (step.count / maxFunnelCount) * 100
                const stepLabel = fd.funnel.steps[step.id as FunnelStepId]

                return (
                  <div
                    key={step.id}
                    className="grid gap-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5 sm:grid-cols-[minmax(160px,200px)_1fr_auto] sm:items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium">{stepLabel}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="relative h-2 overflow-hidden rounded-sm bg-muted/70">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm bg-sky-500/75"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                        <span>{formatCount(step.count)}</span>
                        <span>
                          {fd.funnel.conversion} {formatPercent(step.conversionRate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:justify-end">
                      <MetricPill
                        label={fd.funnel.dropOff}
                        value={formatPercent(step.dropOffRate)}
                        variant={step.dropOffRate > 20 ? "warning" : "default"}
                      />
                      {index < data.funnel.length - 1 && (
                        <ChevronRight className="hidden size-3.5 text-muted-foreground/40 sm:block" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </AnalyticsPanel>

        <div className="grid gap-5 xl:grid-cols-2">
          <AnalyticsPanel
            title={fd.sectionEngagement.title}
            description={fd.sectionEngagement.description}
            dense
          >
            {!isLive ? (
              <EmptyNotice message={fd.noData} />
            ) : (
              <DataTable
                headers={[
                  fd.sectionEngagement.section,
                  fd.sectionEngagement.viewers,
                  fd.sectionEngagement.avgDwell,
                  fd.sectionEngagement.totalDwell,
                ]}
              >
                {data.sectionEngagement.map((section) => {
                  const barWidth = (section.viewers / maxSectionViewers) * 100
                  const label =
                    fd.sectionEngagement.sections[section.id as FounderSectionId]

                  return (
                    <tr
                      key={section.id}
                      className="border-b border-border/30 transition-colors hover:bg-muted/15"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="hidden h-1 w-16 overflow-hidden rounded-sm bg-muted/60 sm:block">
                            <div
                              className="h-full rounded-sm bg-violet-500/70"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums">
                        {formatCount(section.viewers)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">
                        {formatOptionalDuration(section.avgDwellMs)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums">
                        {formatOptionalDuration(section.totalDwellMs)}
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            )}
          </AnalyticsPanel>

          <AnalyticsPanel
            title={fd.reviewerUsage.title}
            description={fd.reviewerUsage.description}
            dense
          >
            {!isLive ? (
              <EmptyNotice message={fd.noData} />
            ) : (
              <DataTable
                headers={[
                  fd.reviewerUsage.persona,
                  fd.reviewerUsage.usageCount,
                  fd.reviewerUsage.avgDwell,
                ]}
              >
                {data.reviewerUsage.map((item) => {
                  const barWidth = (item.usageCount / maxReviewerUsage) * 100
                  const label =
                    messages.report.reviewerPersonas[item.persona as ReviewerPersona]

                  return (
                    <tr
                      key={item.persona}
                      className="border-b border-border/30 transition-colors hover:bg-muted/15"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="hidden h-1 w-20 overflow-hidden rounded-sm bg-muted/60 sm:block">
                            <div
                              className="h-full rounded-sm bg-emerald-500/70"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums">
                        {formatCount(item.usageCount)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">
                        {formatOptionalDuration(item.avgDwellMs)}
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            )}
          </AnalyticsPanel>
        </div>

        <AnalyticsPanel
          title={fd.betaMetrics.charts.popularModules}
          description={fd.sectionEngagement.description}
        >
          {!isLive || metrics.popularModules.length === 0 ? (
            <EmptyNotice message={fd.noData} />
          ) : (
            <div className="space-y-2">
              {metrics.popularModules.slice(0, 8).map((item, index) => (
                <BarRow
                  key={item.sectionId}
                  label={moduleLabel(item.sectionId)}
                  value={item.count}
                  max={maxModuleCount}
                  colorClass={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </div>
          )}
        </AnalyticsPanel>

        <FeedbackAnalyticsPanel />
      </div>
    </PageContainer>
  )
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/10 px-4 py-3.5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="font-mono text-[10px] uppercase tracking-wider">{label}</p>
      </div>
      <p className="font-mono text-xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  )
}

function DataTable({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left">
        <thead>
          <tr className="border-b border-border/40 bg-muted/20">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function MetricPill({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string
  variant?: "default" | "warning"
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2 py-1 text-center",
        variant === "warning"
          ? "border-amber-500/20 bg-amber-500/10"
          : "border-border/50 bg-background/50"
      )}
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-xs font-medium tabular-nums",
          variant === "warning" && "text-amber-400"
        )}
      >
        {value}
      </p>
    </div>
  )
}

function EmptyNotice({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/5 px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
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

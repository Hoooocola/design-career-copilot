"use client"

import { Calendar, Clock, Target } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { CareerImprovementRoadmap } from "@/types/report"
import { cn } from "@/lib/utils"

interface ImprovementRoadmapProps {
  data: CareerImprovementRoadmap
}

const SOURCE_STYLES = {
  portfolio_analysis: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  gap_analysis: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  benchmark: "border-sky-500/20 bg-sky-500/10 text-sky-400",
} as const

export function ImprovementRoadmap({ data }: ImprovementRoadmapProps) {
  const { messages } = useLocale()
  const rm = messages.report.roadmap

  const sourceLabels = {
    portfolio_analysis: rm.sourcePortfolio,
    gap_analysis: rm.sourceGap,
    benchmark: rm.sourceBenchmark,
  }

  return (
    <ReportSection
      title={rm.title}
      description={rm.description}
      trackingId="roadmap"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border/60 bg-muted/10 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider"
            >
              {rm.thirtyDayPlan}
            </Badge>
            {data.derivedFrom.map((source) => (
              <Badge
                key={source}
                variant="outline"
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wider",
                  SOURCE_STYLES[source]
                )}
              >
                {sourceLabels[source]}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {data.summary}
          </p>
        </div>

        <div className="relative space-y-4">
          <div
            className="absolute bottom-4 left-[19px] top-4 hidden w-px bg-border/50 sm:block"
            aria-hidden
          />
          {data.weeks.map((week) => (
            <article
              key={week.week}
              className="relative rounded-xl border border-border/60 bg-background sm:pl-12"
            >
              <div className="absolute left-3 top-5 hidden size-[14px] rounded-full border-2 border-primary/60 bg-background sm:block" />

              <div className="border-b border-border/40 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {rm.weekLabel.replace("{n}", String(week.week))}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Calendar className="size-3" />
                    {rm.days} {(week.week - 1) * 7 + 1}–{week.week * 7}
                  </span>
                </div>
              </div>

              <div className="space-y-4 px-5 py-4">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {rm.keyTask}
                  </p>
                  <p className="text-sm leading-[1.7]">{week.keyTask}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard
                    icon={<Clock className="size-3.5 text-amber-400" />}
                    label={rm.estimatedTime}
                    value={week.estimatedTime}
                  />
                  <MetricCard
                    icon={<Target className="size-3.5 text-emerald-400" />}
                    label={rm.expectedBenefit}
                    value={week.expectedBenefit}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ReportSection>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
    </div>
  )
}

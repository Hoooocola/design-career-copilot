"use client"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { OpportunityItem, OpportunityPriority } from "@/types/report"
import { cn } from "@/lib/utils"

interface OpportunityRankingProps {
  opportunities: OpportunityItem[]
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-px tabular-nums" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "text-sm leading-none",
            index < value ? "text-amber-400" : "text-muted-foreground/25"
          )}
        >
          ★
        </span>
      ))}
    </span>
  )
}

const priorityStyles: Record<
  OpportunityPriority,
  { className: string }
> = {
  high: {
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  medium: {
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  low: {
    className: "bg-muted text-muted-foreground border-border/60",
  },
}

export function OpportunityRanking({ opportunities }: OpportunityRankingProps) {
  const { messages } = useLocale()
  const opp = messages.report.opportunityRanking

  const priorityLabels: Record<OpportunityPriority, string> = {
    high: opp.priorityHigh,
    medium: opp.priorityMedium,
    low: opp.priorityLow,
  }

  return (
    <ReportSection
      title={opp.title}
      description={opp.description}
      trackingId="opportunity_ranking"
    >
      <div className="space-y-3">
        {opportunities.map((item, index) => {
          const priorityConfig = priorityStyles[item.priority]

          return (
            <article
              key={`${item.title}-${index}`}
              className="rounded-xl border border-border/60 bg-muted/20 p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {opp.opportunityLabel} #{index + 1}
                  </p>
                  <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 font-mono text-[10px] uppercase tracking-wider",
                    priorityConfig.className
                  )}
                >
                  {priorityLabels[item.priority]}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricRow label={opp.impact} value={item.impact}>
                  <StarRating value={item.impact} />
                </MetricRow>
                <MetricRow label={opp.effort} value={item.effort}>
                  <StarRating value={item.effort} />
                </MetricRow>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-border/40 pt-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {opp.expectedOutcome}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.expectedOutcome}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </ReportSection>
  )
}

function MetricRow({
  label,
  value,
  children,
}: {
  label: string
  value: number
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/50 px-3 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {children}
        <span className="sr-only">{value}</span>
      </div>
    </div>
  )
}

"use client"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

interface MatchScoreProps {
  score: number
}

export function MatchScore({ score }: MatchScoreProps) {
  const { messages } = useLocale()

  function getScoreLabel() {
    if (score >= 80) return messages.report.match.strong
    if (score >= 60) return messages.report.match.moderate
    if (score >= 40) return messages.report.match.partial
    return messages.report.match.low
  }

  function getScoreColor() {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-sky-400"
    if (score >= 40) return "text-amber-400"
    return "text-rose-400"
  }

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const scoreColor = getScoreColor()

  return (
    <ReportSection
      title={messages.report.matchScore}
      description={messages.report.matchScoreDescription}
    >
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-muted/20 py-8 sm:flex-row sm:justify-center sm:gap-12">
        <div className="relative size-36">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/40"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={cn("transition-all duration-1000", scoreColor)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-semibold tabular-nums", scoreColor)}>
              {score}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              / 100
            </span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <p className={cn("text-xl font-medium", scoreColor)}>
            {getScoreLabel()}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {messages.report.matchScoreBasis}
          </p>
        </div>
      </div>
    </ReportSection>
  )
}

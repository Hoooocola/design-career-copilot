"use client"

import { ArrowDown, Minus, Plus } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { ReviewTraceItem } from "@/types/report"
import { cn } from "@/lib/utils"

interface ReviewTracePanelProps {
  traces: ReviewTraceItem[]
}

function confidenceStyle(score: number): string {
  if (score >= 85) return "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
  if (score >= 70) return "border-sky-500/25 bg-sky-500/10 text-sky-400"
  if (score >= 55) return "border-amber-500/25 bg-amber-500/10 text-amber-400"
  return "border-rose-500/25 bg-rose-500/10 text-rose-400"
}

export function ReviewTracePanel({ traces }: ReviewTracePanelProps) {
  const { messages } = useLocale()
  const rt = messages.report.reviewTrace

  return (
    <ReportSection title={rt.title} description={rt.description}>
      <div className="mb-4 rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {rt.auditTrail}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {rt.auditTrailHint}
        </p>
      </div>

      <div className="space-y-4">
        {traces.map((trace, index) => (
          <article
            key={trace.id}
            className="rounded-xl border border-border/60 bg-muted/10"
          >
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {rt.trace} #{index + 1}
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-tight">
                  {trace.label}
                </h3>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 font-mono text-[10px] uppercase tracking-wider",
                  confidenceStyle(trace.confidenceScore)
                )}
              >
                {rt.confidence} {trace.confidenceScore}%
              </Badge>
            </header>

            <div className="space-y-0 px-5 py-4">
              <TraceBlock label={rt.conclusion} content={trace.conclusion} />
              <TraceDivider />

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400/90">
                  {rt.supportingEvidence}
                </p>
                <EvidenceList items={trace.supportingEvidence} variant="present" />
              </div>
              <TraceDivider />

              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-rose-400/90">
                  {rt.missingEvidence}
                </p>
                <EvidenceList items={trace.missingEvidence} variant="missing" />
              </div>
              <TraceDivider />

              <TraceBlock
                label={rt.reasoning}
                content={trace.reasoningProcess}
                variant="reasoning"
              />
              <TraceDivider />

              <TraceBlock
                label={rt.recommendation}
                content={trace.recommendation}
                variant="recommendation"
              />
            </div>
          </article>
        ))}
      </div>
    </ReportSection>
  )
}

function TraceDivider() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="size-3 text-muted-foreground/35" />
    </div>
  )
}

function TraceBlock({
  label,
  content,
  variant = "default",
}: {
  label: string
  content: string
  variant?: "default" | "reasoning" | "recommendation"
}) {
  return (
    <div
      className={cn(
        "rounded-lg px-4 py-3",
        variant === "reasoning" && "border border-border/40 bg-background/40",
        variant === "recommendation" && "border border-primary/20 bg-primary/5",
        variant === "default" && "bg-transparent"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-[1.7] text-muted-foreground">
        {content}
      </p>
    </div>
  )
}

function EvidenceList({
  items,
  variant,
}: {
  items: string[]
  variant: "present" | "missing"
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground/60">
        {variant === "present" ? "—" : "—"}
      </p>
    )
  }

  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
          {variant === "present" ? (
            <Plus className="mt-1 size-3 shrink-0 text-emerald-400/70" />
          ) : (
            <Minus className="mt-1 size-3 shrink-0 text-rose-400/70" />
          )}
          {item}
        </li>
      ))}
    </ul>
  )
}

"use client"

import { ArrowDown } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { EvidenceInsight } from "@/types/framework"
import type { DimensionId } from "@/types/framework"
import { cn } from "@/lib/utils"

interface EvidenceInsightsProps {
  insights: EvidenceInsight[]
}

const evidenceTypeStyles = {
  primary: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  secondary: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  inferred: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  absent: "bg-rose-500/15 text-rose-400 border-rose-500/20",
}

export function EvidenceInsights({ insights }: EvidenceInsightsProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework

  return (
    <ReportSection
      title={fw.evidenceInsights}
      description={fw.evidenceInsightsDescription}
    >
      <div className="space-y-4">
        {insights.map((item) => (
          <article
            key={item.dimensionId}
            className="rounded-xl border border-border/60 bg-muted/20 p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-medium">
                {fw.dimensions[item.dimensionId as DimensionId]}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px] uppercase",
                  evidenceTypeStyles[item.evidenceType]
                )}
              >
                {fw.evidenceTypes[item.evidenceType]}
              </Badge>
            </div>

            <div className="space-y-3">
              <InsightBlock label={fw.insight} content={item.insight} />
              <div className="flex justify-center">
                <ArrowDown className="size-3 text-muted-foreground/40" />
              </div>
              <InsightBlock
                label={fw.evidence}
                content={item.evidence}
                variant="evidence"
              />
              <div className="flex justify-center">
                <ArrowDown className="size-3 text-muted-foreground/40" />
              </div>
              <InsightBlock
                label={fw.recommendation}
                content={item.recommendation}
                variant="recommendation"
              />
            </div>
          </article>
        ))}
      </div>
    </ReportSection>
  )
}

function InsightBlock({
  label,
  content,
  variant = "default",
}: {
  label: string
  content: string
  variant?: "default" | "evidence" | "recommendation"
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3",
        variant === "evidence" && "border-border/40 bg-background/50",
        variant === "recommendation" && "border-primary/20 bg-primary/5",
        variant === "default" && "border-transparent bg-transparent px-0 py-0"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {content}
      </p>
    </div>
  )
}

"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard, UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { ReviewTraceItem } from "@/types/report"

interface ReviewTracePanelProps {
  traces: ReviewTraceItem[]
  embedded?: boolean
}

function confidenceVariant(score: number): "high" | "medium" | "low" {
  if (score >= 75) return "high"
  if (score >= 55) return "medium"
  return "low"
}

export function ReviewTracePanel({ traces, embedded }: ReviewTracePanelProps) {
  const { messages } = useLocale()
  const rt = messages.report.reviewTrace
  const block = messages.report.insightBlock

  const content = (
    <>
      {!embedded && (
        <ReportCard className="mb-2 bg-[var(--report-paper)]">
          <p className="report-caption">{rt.auditTrail}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--report-text-muted)]">
            {rt.auditTrailHint}
          </p>
        </ReportCard>
      )}

      <div className="space-y-4">
        {traces.map((trace, index) => {
          const evidenceText = [
            ...trace.supportingEvidence.map((e) => `+ ${e}`),
            ...trace.missingEvidence.map((e) => `− ${e}`),
          ].join("\n")

          return (
            <UnifiedInsightBlock
              key={trace.id}
              category={`${rt.trace} #${index + 1} · ${trace.label}`}
              priority={`${rt.confidence} ${trace.confidenceScore}%`}
              priorityVariant={confidenceVariant(trace.confidenceScore)}
              finding={trace.conclusion}
              evidence={evidenceText || trace.reasoningProcess}
              implication={trace.recommendation}
              findingLabel={block.finding}
              evidenceLabel={block.evidence}
              implicationLabel={block.implication}
            />
          )
        })}
      </div>
    </>
  )

  if (embedded) return content

  return (
    <ReportSection title={rt.title} description={rt.description}>
      {content}
    </ReportSection>
  )
}

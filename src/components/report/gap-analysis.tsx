"use client"

import { ReportSection } from "@/components/report/report-section"
import { UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { GapItem } from "@/types/report"

interface GapAnalysisProps {
  gaps: GapItem[]
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  const { messages } = useLocale()
  const block = messages.report.insightBlock
  const impactLabels = messages.report.impact

  const impactVariant = {
    high: "high" as const,
    medium: "medium" as const,
    low: "low" as const,
  }

  return (
    <ReportSection
      title={messages.report.gapAnalysis}
      description={messages.report.gapAnalysisDescription}
      trackingId="gap_analysis"
    >
      <div className="space-y-4">
        {gaps.map((gap) => (
          <UnifiedInsightBlock
            key={gap.area}
            category={gap.area}
            priority={impactLabels[gap.impact]}
            priorityVariant={impactVariant[gap.impact]}
            finding={gap.area}
            evidence={gap.description}
            implication={`${impactLabels[gap.impact]} · ${gap.description}`}
            findingLabel={block.finding}
            evidenceLabel={block.evidence}
            implicationLabel={block.implication}
          />
        ))}
      </div>
    </ReportSection>
  )
}

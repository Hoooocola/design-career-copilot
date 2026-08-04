"use client"

import { ReportSection } from "@/components/report/report-section"
import { UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { EvidenceInsight, DimensionId } from "@/types/framework"

interface EvidenceInsightsProps {
  insights: EvidenceInsight[]
}

const evidencePriority = {
  primary: "high" as const,
  secondary: "medium" as const,
  inferred: "low" as const,
  absent: "high" as const,
}

export function EvidenceInsights({ insights }: EvidenceInsightsProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework
  const block = messages.report.insightBlock

  return (
    <ReportSection
      title={fw.evidenceInsights}
      description={fw.evidenceInsightsDescription}
    >
      <div className="space-y-4">
        {insights.map((item) => (
          <UnifiedInsightBlock
            key={item.dimensionId}
            category={fw.dimensions[item.dimensionId as DimensionId]}
            priority={fw.evidenceTypes[item.evidenceType]}
            priorityVariant={evidencePriority[item.evidenceType]}
            finding={item.insight}
            evidence={item.evidence}
            implication={item.recommendation}
            findingLabel={block.finding}
            evidenceLabel={block.evidence}
            implicationLabel={block.implication}
          />
        ))}
      </div>
    </ReportSection>
  )
}

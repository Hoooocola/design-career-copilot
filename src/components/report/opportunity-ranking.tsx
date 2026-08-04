"use client"

import { ReportSection } from "@/components/report/report-section"
import { UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { OpportunityItem, OpportunityPriority } from "@/types/report"

interface OpportunityRankingProps {
  opportunities: OpportunityItem[]
}

export function OpportunityRanking({ opportunities }: OpportunityRankingProps) {
  const { messages } = useLocale()
  const opp = messages.report.opportunityRanking
  const block = messages.report.insightBlock

  const priorityLabels: Record<OpportunityPriority, string> = {
    high: opp.priorityHigh,
    medium: opp.priorityMedium,
    low: opp.priorityLow,
  }

  const priorityVariant: Record<OpportunityPriority, "high" | "medium" | "low"> = {
    high: "high",
    medium: "medium",
    low: "low",
  }

  return (
    <ReportSection
      title={opp.title}
      description={opp.description}
      trackingId="opportunity_ranking"
    >
      <div className="space-y-4">
        {opportunities.map((item, index) => (
          <UnifiedInsightBlock
            key={`${item.title}-${index}`}
            category={`${opp.opportunityLabel} #${index + 1} · ${item.title}`}
            priority={priorityLabels[item.priority]}
            priorityVariant={priorityVariant[item.priority]}
            finding={item.weakness}
            evidence={`${opp.impact}: ${"★".repeat(item.impact)} · ${opp.effort}: ${"★".repeat(item.effort)}`}
            implication={item.expectedOutcome}
            findingLabel={block.finding}
            evidenceLabel={block.evidence}
            implicationLabel={block.implication}
          />
        ))}
      </div>
    </ReportSection>
  )
}

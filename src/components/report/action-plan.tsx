"use client"

import { ReportSection } from "@/components/report/report-section"
import { UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { ActionItem } from "@/types/report"

interface ActionPlanProps {
  items: ActionItem[]
}

export function ActionPlan({ items }: ActionPlanProps) {
  const { messages } = useLocale()
  const block = messages.report.insightBlock

  return (
    <ReportSection
      title={messages.report.actionPlan}
      description={messages.report.actionPlanDescription}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.priority} className="relative">
            <span className="absolute -left-1 top-6 flex size-7 items-center justify-center rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-surface-raised)] text-xs font-semibold text-[var(--workspace-text-primary)]">
              {item.priority}
            </span>
            <UnifiedInsightBlock
              className="ml-4"
              category={item.title}
              priority={item.timeframe}
              priorityVariant="neutral"
              finding={item.title}
              evidence={item.description}
              implication={item.description}
              findingLabel={block.finding}
              evidenceLabel={block.evidence}
              implicationLabel={block.implication}
            />
          </div>
        ))}
      </div>
    </ReportSection>
  )
}

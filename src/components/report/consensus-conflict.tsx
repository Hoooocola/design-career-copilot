"use client"

import { Check, Minus } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import type { ConsensusConflictAnalysis } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ConsensusConflictProps {
  data: ConsensusConflictAnalysis
}

const personaStyles: Record<ReviewerPersona, string> = {
  hr_reviewer: "bg-[var(--report-accent-muted)] text-[var(--report-accent)]",
  design_lead: "bg-[var(--report-paper)] text-[var(--report-text)]",
  ai_product_lead: "bg-[var(--report-caution-bg)] text-[var(--report-caution)]",
  design_engineer: "bg-[var(--report-positive-bg)] text-[var(--report-positive)]",
}

export function ConsensusConflictPanel({ data }: ConsensusConflictProps) {
  const { messages } = useLocale()
  const cc = messages.report.consensusConflict
  const personaLabels = messages.report.reviewerPersonas

  return (
    <ReportSection
      title={cc.title}
      description={cc.description}
      trackingId="consensus"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <ReportCard className="p-0">
          <header className="border-b border-[var(--report-border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-[var(--report-positive-bg)]">
                <Check className="size-3.5 text-[var(--report-positive)]" strokeWidth={2.5} />
              </span>
              <h3 className="text-base font-semibold">{cc.consensus}</h3>
            </div>
            <p className="mt-1 text-sm text-[var(--report-text-muted)]">{cc.consensusHint}</p>
          </header>
          <ul className="divide-y divide-[var(--report-border)]">
            {data.consensus.map((item, index) => (
              <li key={`${item.capability}-${index}`} className="px-5 py-4">
                <p className="text-[0.9375rem] font-medium text-[var(--report-text)]">
                  {item.capability}
                </p>
                {item.detail && (
                  <p className="mt-1 text-sm leading-relaxed text-[var(--report-text-muted)]">
                    {item.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </ReportCard>

        <ReportCard className="p-0">
          <header className="border-b border-[var(--report-border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-[var(--report-caution-bg)]">
                <Minus className="size-3.5 text-[var(--report-caution)]" strokeWidth={2.5} />
              </span>
              <h3 className="text-base font-semibold">{cc.conflict}</h3>
            </div>
            <p className="mt-1 text-sm text-[var(--report-text-muted)]">{cc.conflictHint}</p>
          </header>
          <ul className="divide-y divide-[var(--report-border)]">
            {data.conflicts.map((item, index) => (
              <li key={`${item.topic}-${index}`} className="px-5 py-4">
                <p className="report-caption mb-3">{item.topic}</p>
                <div className="space-y-3">
                  {item.viewpoints.map((viewpoint) => (
                    <div
                      key={`${item.topic}-${viewpoint.persona}`}
                      className="rounded-lg border border-[var(--report-border)] bg-[var(--report-paper)] px-4 py-3"
                    >
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                          personaStyles[viewpoint.persona]
                        )}
                      >
                        {personaLabels[viewpoint.persona]}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--report-text-muted)]">
                        {viewpoint.viewpoint}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </ReportCard>
      </div>
    </ReportSection>
  )
}

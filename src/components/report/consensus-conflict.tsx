"use client"

import { Check, Minus } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { ConsensusConflictAnalysis } from "@/types/report"
import type { ReviewerPersona } from "@/types/reviewer"
import { cn } from "@/lib/utils"

interface ConsensusConflictProps {
  data: ConsensusConflictAnalysis
}

const personaStyles: Record<ReviewerPersona, string> = {
  hr_reviewer: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  design_lead: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  ai_product_lead: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  design_engineer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
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
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border/60 bg-muted/10">
          <header className="border-b border-border/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-emerald-500/15">
                <Check className="size-3 text-emerald-400" strokeWidth={2.5} />
              </span>
              <h3 className="text-sm font-medium">{cc.consensus}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{cc.consensusHint}</p>
          </header>
          <ul className="divide-y divide-border/30">
            {data.consensus.map((item, index) => (
              <li key={`${item.capability}-${index}`} className="px-4 py-3.5">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-snug">
                      {item.capability}
                    </p>
                    {item.detail && (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border/60 bg-muted/10">
          <header className="border-b border-border/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-amber-500/15">
                <Minus className="size-3 text-amber-400" strokeWidth={2.5} />
              </span>
              <h3 className="text-sm font-medium">{cc.conflict}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{cc.conflictHint}</p>
          </header>
          <ul className="divide-y divide-border/30">
            {data.conflicts.map((item, index) => (
              <li key={`${item.topic}-${index}`} className="px-4 py-3.5">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.topic}
                </p>
                <div className="space-y-2.5">
                  {item.viewpoints.map((viewpoint) => (
                    <div
                      key={`${item.topic}-${viewpoint.persona}`}
                      className="rounded-lg border border-border/40 bg-background/40 px-3 py-2.5"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "mb-1.5 font-mono text-[10px] uppercase tracking-wider",
                          personaStyles[viewpoint.persona]
                        )}
                      >
                        {personaLabels[viewpoint.persona]}
                      </Badge>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {viewpoint.viewpoint}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ReportSection>
  )
}

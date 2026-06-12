"use client"

import { ReportSection } from "@/components/report/report-section"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/components/providers/locale-provider"
import type { SkillCoverageItem } from "@/types/report"
import { cn } from "@/lib/utils"

interface SkillCoverageProps {
  skills: SkillCoverageItem[]
}

export function SkillCoverage({ skills }: SkillCoverageProps) {
  const { messages } = useLocale()

  const levelConfig = {
    strong: {
      label: messages.report.levels.strong,
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    partial: {
      label: messages.report.levels.partial,
      className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
    missing: {
      label: messages.report.levels.missing,
      className: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    },
  }

  return (
    <ReportSection
      title={messages.report.skillCoverage}
      description={messages.report.skillCoverageDescription}
    >
      <div className="divide-y divide-border/50 rounded-xl border border-border/60">
        {skills.map((item) => {
          const config = levelConfig[item.level]
          return (
            <div
              key={item.skill}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{item.skill}</span>
                {item.required && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {messages.common.required}
                  </span>
                )}
              </div>
              <Badge
                variant="outline"
                className={cn("font-mono text-[10px] uppercase", config.className)}
              >
                {config.label}
              </Badge>
            </div>
          )
        })}
      </div>
    </ReportSection>
  )
}

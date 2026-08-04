"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
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
      className:
        "bg-[var(--report-positive-bg)] text-[var(--report-positive)] border-[var(--report-positive)]/20",
    },
    partial: {
      label: messages.report.levels.partial,
      className:
        "bg-[var(--report-caution-bg)] text-[var(--report-caution)] border-[var(--report-caution)]/20",
    },
    missing: {
      label: messages.report.levels.missing,
      className:
        "bg-[var(--report-negative-bg)] text-[var(--report-negative)] border-[var(--report-negative)]/20",
    },
  } as const

  return (
    <ReportSection
      title={messages.report.skillCoverage}
      description={messages.report.skillCoverageDescription}
    >
      <ReportCard className="divide-y divide-[var(--report-border)] p-0">
        {skills.map((item) => {
          const config = levelConfig[item.level] ?? levelConfig.missing
          return (
            <div
              key={item.skill}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-[var(--report-text)]">
                  {item.skill}
                </span>
                {item.required && (
                  <span className="report-caption">{messages.common.required}</span>
                )}
              </div>
              <span
                className={cn(
                  "rounded-md border px-2.5 py-0.5 text-xs font-medium",
                  config.className
                )}
              >
                {config.label}
              </span>
            </div>
          )
        })}
      </ReportCard>
    </ReportSection>
  )
}

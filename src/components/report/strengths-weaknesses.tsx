"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: StrengthsWeaknessesProps) {
  const { messages } = useLocale()

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ReportSection title={messages.report.strengths}>
        <ul className="space-y-3">
          {strengths.map((item, i) => (
            <li key={i}>
              <ReportCard accent className="py-4">
                <p className="text-[0.9375rem] leading-relaxed text-[var(--workspace-text-primary)]">
                  {item}
                </p>
              </ReportCard>
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title={messages.report.weaknesses}>
        <ul className="space-y-3">
          {weaknesses.map((item, i) => (
            <li key={i}>
              <ReportCard accent className="border-l-[var(--workspace-danger)] py-4">
                <p className="text-[0.9375rem] leading-relaxed text-[var(--workspace-text-primary)]">
                  {item}
                </p>
              </ReportCard>
            </li>
          ))}
        </ul>
      </ReportSection>
    </div>
  )
}

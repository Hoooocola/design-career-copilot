"use client"

import { Minus, Plus } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
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
    <div className="grid gap-8 sm:grid-cols-2">
      <ReportSection title={messages.report.strengths}>
        <ul className="space-y-3">
          {strengths.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <Plus className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ReportSection>
      <ReportSection title={messages.report.weaknesses}>
        <ul className="space-y-3">
          {weaknesses.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <Minus className="mt-0.5 size-4 shrink-0 text-rose-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ReportSection>
    </div>
  )
}

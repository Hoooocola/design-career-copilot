"use client"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"

interface ExecutiveSummaryProps {
  summary: string
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const { messages } = useLocale()

  return (
    <ReportSection
      title={messages.report.executiveSummary}
      trackingId="executive_summary"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
    </ReportSection>
  )
}

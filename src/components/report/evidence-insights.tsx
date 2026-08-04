"use client"

import { ReportSection } from "@/components/report/report-section"
import { ReportCard, CollapsibleSection, UnifiedInsightBlock } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import {
  computeEvidenceCoverage,
  countMissingEvidence,
  countStrongEvidence,
  rankEvidenceInsights,
} from "@/lib/report/metrics"
import type { EvidenceInsight, DimensionId } from "@/types/framework"

interface EvidenceInsightsProps {
  insights: EvidenceInsight[]
}

const EVIDENCE_PREVIEW_COUNT = 3

const evidencePriority = {
  primary: "high" as const,
  secondary: "medium" as const,
  inferred: "low" as const,
  absent: "high" as const,
}

export function EvidenceInsights({ insights }: EvidenceInsightsProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework
  const eq = messages.report.evidenceQuality
  const block = messages.report.insightBlock

  const sorted = rankEvidenceInsights(insights)
  const preview = sorted.slice(0, EVIDENCE_PREVIEW_COUNT)
  const remainder = sorted.slice(EVIDENCE_PREVIEW_COUNT)
  const coverage = computeEvidenceCoverage(insights)
  const strongCount = countStrongEvidence(insights)
  const missingCount = countMissingEvidence(insights)

  function renderInsight(item: EvidenceInsight) {
    return (
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
    )
  }

  return (
    <ReportSection title={fw.evidenceInsights} description={fw.evidenceInsightsDescription}>
      <dl className="mb-5 grid gap-3 sm:grid-cols-3">
        <SummaryMetric label={eq.evidenceCoverage} value={`${coverage}%`} />
        <SummaryMetric label={eq.strongEvidenceCount} value={String(strongCount)} />
        <SummaryMetric label={eq.missingEvidenceCount} value={String(missingCount)} />
      </dl>

      <div className="space-y-4">{preview.map(renderInsight)}</div>

      {remainder.length > 0 && (
        <div className="mt-4">
          <CollapsibleSection
            title={eq.detailedEvidence.replace("{count}", String(remainder.length))}
            description={eq.detailedEvidenceHint}
            defaultOpen={false}
          >
            <div className="space-y-4">{remainder.map(renderInsight)}</div>
          </CollapsibleSection>
        </div>
      )}
    </ReportSection>
  )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface-raised)] px-4 py-3">
      <dt className="report-caption">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums text-[var(--workspace-text-primary)]">
        {value}
      </dd>
    </div>
  )
}

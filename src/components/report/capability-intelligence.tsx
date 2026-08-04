"use client"

import { useMemo } from "react"

import { useLocale } from "@/components/providers/locale-provider"
import { buildCapabilityIntelligenceView } from "@/lib/report/capability-intelligence"
import type { DimensionScore, EvidenceInsight } from "@/types/framework"
import type { DimensionId } from "@/types/framework"
import type { GapItem, OpportunityItem, SkillCoverageItem } from "@/types/report"

interface CapabilityIntelligenceProps {
  targetRoleLabel?: string
  skillCoverage: SkillCoverageItem[]
  topStrengths: string[]
  criticalGaps: string[]
  dimensionScores: DimensionScore[]
  evidenceInsights: EvidenceInsight[]
  gapAnalysis: GapItem[]
  opportunityRanking: OpportunityItem[]
}

export function CapabilityIntelligence({
  targetRoleLabel,
  skillCoverage,
  topStrengths,
  criticalGaps,
  dimensionScores,
  evidenceInsights,
  gapAnalysis,
  opportunityRanking,
}: CapabilityIntelligenceProps) {
  const { messages } = useLocale()
  const ci = messages.report.capabilityIntelligence
  const fw = messages.report.framework
  const hm = messages.report.heatmap

  const view = useMemo(
    () =>
      buildCapabilityIntelligenceView({
        skillCoverage,
        topStrengths,
        criticalGaps,
        dimensionScores,
        evidenceInsights,
        gapAnalysis,
        opportunityRanking,
        dimensionLabels: fw.dimensions,
        shortDimensionLabels: hm.shortLabels,
        impactLabels: ci.hiringImpactLevels,
      }),
    [
      skillCoverage,
      topStrengths,
      criticalGaps,
      dimensionScores,
      evidenceInsights,
      gapAnalysis,
      opportunityRanking,
      fw.dimensions,
      hm.shortLabels,
      ci.hiringImpactLevels,
    ]
  )

  return (
    <section className="space-y-14">
      <div>
        <h3 className="report-h3">{ci.title}</h3>
        <p className="report-body mt-2 max-w-2xl">{ci.description}</p>
      </div>

      <RoleAlignmentSection
        targetRoleLabel={targetRoleLabel}
        alignment={view.roleAlignment}
        labels={ci.roleAlignment}
      />

      <StrengthSignalsSection
        title={ci.strengthSignals.title}
        description={ci.strengthSignals.description}
        evidenceLabel={ci.strengthSignals.evidence}
        signals={view.strengthSignals}
      />

      <GrowthSignalsSection
        title={ci.growthSignals.title}
        description={ci.growthSignals.description}
        whyLabel={ci.growthSignals.whyItMatters}
        impactLabel={ci.growthSignals.hiringImpact}
        signals={view.growthSignals}
      />
    </section>
  )
}

function RoleAlignmentSection({
  targetRoleLabel,
  alignment,
  labels,
}: {
  targetRoleLabel?: string
  alignment: ReturnType<typeof buildCapabilityIntelligenceView>["roleAlignment"]
  labels: {
    title: string
    requirementsIntro: string
    matched: string
    needsDevelopment: string
    noMatched: string
    noGaps: string
  }
}) {
  return (
    <div className="space-y-6 bg-[color-mix(in_oklch,var(--workspace-surface-raised)_42%,transparent)] px-0 py-7 sm:py-8">
      <div className="space-y-2">
        <p className="text-metadata">{labels.title}</p>
        {targetRoleLabel && (
          <p className="text-[1.0625rem] font-medium text-[var(--workspace-text-primary)]">
            {targetRoleLabel}
          </p>
        )}
        <p className="text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {labels.requirementsIntro}
        </p>
      </div>

      {alignment.requirements.length > 0 && (
        <p className="text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {alignment.requirements.join(" · ")}
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <AlignmentColumn
          label={labels.matched}
          items={alignment.matched}
          emptyLabel={labels.noMatched}
        />
        <AlignmentColumn
          label={labels.needsDevelopment}
          items={alignment.needsDevelopment}
          emptyLabel={labels.noGaps}
        />
      </div>
    </div>
  )
}

function AlignmentColumn({
  label,
  items,
  emptyLabel,
}: {
  label: string
  items: string[]
  emptyLabel: string
}) {
  return (
    <div>
      <p className="text-metadata">{label}</p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="text-[0.9375rem] leading-relaxed text-[var(--workspace-text-primary)]"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--workspace-text-muted)]">{emptyLabel}</p>
      )}
    </div>
  )
}

function StrengthSignalsSection({
  title,
  description,
  evidenceLabel,
  signals,
}: {
  title: string
  description: string
  evidenceLabel: string
  signals: ReturnType<typeof buildCapabilityIntelligenceView>["strengthSignals"]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[1.125rem] font-semibold tracking-tight text-[var(--workspace-text-primary)]">
          {title}
        </h4>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {description}
        </p>
      </div>

      <div className="space-y-7">
        {signals.map((signal) => (
          <article key={signal.index} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
            <span className="pt-0.5 font-mono text-sm tabular-nums text-[var(--workspace-text-muted)]">
              {String(signal.index).padStart(2, "0")}
            </span>
            <div>
              <h5 className="text-[1.0625rem] font-medium text-[var(--workspace-text-primary)]">
                {signal.capability}
              </h5>
              <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
                {signal.summary}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-muted)]">
                <span className="text-[var(--workspace-text-secondary)]">
                  {evidenceLabel}
                </span>{" "}
                {signal.evidence}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function GrowthSignalsSection({
  title,
  description,
  whyLabel,
  impactLabel,
  signals,
}: {
  title: string
  description: string
  whyLabel: string
  impactLabel: string
  signals: ReturnType<typeof buildCapabilityIntelligenceView>["growthSignals"]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[1.125rem] font-semibold tracking-tight text-[var(--workspace-text-primary)]">
          {title}
        </h4>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
          {description}
        </p>
      </div>

      <div className="space-y-7">
        {signals.map((signal) => (
          <article key={signal.index} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
            <span className="pt-0.5 font-mono text-sm tabular-nums text-[var(--workspace-text-muted)]">
              {String(signal.index).padStart(2, "0")}
            </span>
            <div>
              <h5 className="text-[1.0625rem] font-medium text-[var(--workspace-text-primary)]">
                {signal.capability}
              </h5>
              <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-secondary)]">
                {signal.summary}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-muted)]">
                <span className="text-[var(--workspace-text-secondary)]">{whyLabel}</span>{" "}
                {signal.whyItMatters}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--workspace-text-muted)]">
                <span className="text-[var(--workspace-text-secondary)]">{impactLabel}</span>{" "}
                {signal.hiringImpact}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

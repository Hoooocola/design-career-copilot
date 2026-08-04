"use client"

import { useMemo, useState } from "react"
import { BarChart3, Grid3x3 } from "lucide-react"

import { CollapsibleSection } from "@/components/report/report-primitives"
import { useLocale } from "@/components/providers/locale-provider"
import {
  buildCompetencyHeatmap,
  heatmapCellBackground,
  heatmapCellTextClass,
  strengthColor,
  type CompetencyHeatmapRow,
} from "@/lib/framework/build-competency-heatmap"
import type { DimensionScore, EvidenceInsight } from "@/types/framework"
import type { DimensionId } from "@/types/framework"
import { cn } from "@/lib/utils"

type ViewMode = "heatmap" | "bar"

interface CompetencyHeatmapProps {
  dimensionScores: DimensionScore[]
  evidenceInsights: EvidenceInsight[]
}

export function CompetencyHeatmap({
  dimensionScores,
  evidenceInsights,
}: CompetencyHeatmapProps) {
  const { messages } = useLocale()
  const hm = messages.report.heatmap
  const cp = messages.report.capabilityProfile
  const fw = messages.report.framework

  const [view, setView] = useState<ViewMode>("heatmap")

  const rows = useMemo(
    () => buildCompetencyHeatmap(dimensionScores, evidenceInsights),
    [dimensionScores, evidenceInsights]
  )

  function dimensionLabel(row: CompetencyHeatmapRow) {
    return (
      hm.shortLabels[row.dimensionId as DimensionId] ??
      fw.dimensions[row.dimensionId as DimensionId]
    )
  }

  return (
    <CollapsibleSection
      title={cp.dimensionMatrix.replace("{count}", String(rows.length))}
      description={cp.dimensionMatrixHint}
      defaultOpen={false}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-metadata">{hm.sortedByScore}</p>
          <div className="inline-flex rounded-lg bg-[var(--workspace-surface-raised)] p-0.5">
            <ViewToggle
              active={view === "heatmap"}
              onClick={() => setView("heatmap")}
              icon={<Grid3x3 className="size-3.5" />}
              label={hm.heatmapView}
            />
            <ViewToggle
              active={view === "bar"}
              onClick={() => setView("bar")}
              icon={<BarChart3 className="size-3.5" />}
              label={hm.barView}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color-mix(in_oklch,var(--workspace-border)_60%,transparent)]">
                <th className="px-4 py-3 text-left text-metadata">{hm.dimension}</th>
                <th className="px-1 py-3 text-center text-metadata">{hm.score}</th>
                <th className="px-1 py-3 text-center text-metadata">{hm.coverage}</th>
                <th className="px-1 py-3 text-center text-metadata">{hm.visualStrength}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const label = dimensionLabel(row)
                const scorePct = (row.score / 5) * 100

                return (
                  <tr
                    key={row.dimensionId}
                    className="border-b border-[color-mix(in_oklch,var(--workspace-border)_40%,transparent)] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium leading-snug text-[var(--workspace-text-primary)]">
                        {label}
                      </p>
                      <p className="mt-0.5 text-metadata">
                        {fw.scoreLabels[row.scoreLabel]}
                      </p>
                    </td>
                    {view === "heatmap" ? (
                      <>
                        <HeatmapCell value={scorePct} display={`${row.score}/5`} />
                        <HeatmapCell value={row.coverage} display={`${row.coverage}%`} />
                        <HeatmapCell
                          value={row.visualStrength}
                          display={`${row.visualStrength}%`}
                        />
                      </>
                    ) : (
                      <>
                        <BarCell value={scorePct} display={`${row.score}/5`} />
                        <BarCell value={row.coverage} display={`${row.coverage}%`} />
                        <BarCell
                          value={row.visualStrength}
                          display={`${row.visualStrength}%`}
                        />
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="text-metadata">{hm.legendNeutral}</p>
      </div>
    </CollapsibleSection>
  )
}

function ViewToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200",
        active
          ? "bg-[var(--workspace-canvas)] text-[var(--workspace-text-primary)]"
          : "text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text-secondary)]"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function HeatmapCell({ value, display }: { value: number; display: string }) {
  const intensity = Math.min(100, Math.max(0, value))

  return (
    <td className="p-1">
      <div
        className={cn(
          "flex h-11 min-w-[80px] items-center justify-center rounded-sm font-mono text-xs tabular-nums",
          heatmapCellTextClass(intensity)
        )}
        style={{ backgroundColor: heatmapCellBackground(intensity) }}
      >
        {display}
      </div>
    </td>
  )
}

function BarCell({ value, display }: { value: number; display: string }) {
  const width = Math.min(100, Math.max(0, value))

  return (
    <td className="px-3 py-3">
      <div className="mx-auto w-full max-w-[140px] space-y-1.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--workspace-border)_80%,transparent)]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${width}%`,
              backgroundColor: strengthColor(width),
            }}
          />
        </div>
        <p className="text-center font-mono text-[10px] tabular-nums text-[var(--workspace-text-muted)]">
          {display}
        </p>
      </div>
    </td>
  )
}

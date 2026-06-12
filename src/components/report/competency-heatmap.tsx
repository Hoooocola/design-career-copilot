"use client"

import { useMemo, useState } from "react"
import { BarChart3, Grid3x3 } from "lucide-react"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import {
  buildCompetencyHeatmap,
  heatmapCellBackground,
  heatmapCellTextClass,
  strengthColor,
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
  const fw = messages.report.framework

  const [view, setView] = useState<ViewMode>("heatmap")

  const rows = useMemo(
    () => buildCompetencyHeatmap(dimensionScores, evidenceInsights),
    [dimensionScores, evidenceInsights]
  )

  return (
    <ReportSection
      title={hm.title}
      description={hm.description}
      trackingId="heatmap"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hm.sortedByScore}
          </p>
          <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
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

        {view === "heatmap" ? (
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/10">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.dimension}
                  </th>
                  <th className="px-1 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.score}
                  </th>
                  <th className="px-1 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.coverage}
                  </th>
                  <th className="px-1 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.visualStrength}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const label =
                    hm.shortLabels[row.dimensionId as DimensionId] ??
                    fw.dimensions[row.dimensionId as DimensionId]
                  const scorePct = (row.score / 5) * 100

                  return (
                    <tr
                      key={row.dimensionId}
                      className="border-b border-border/20 last:border-0"
                    >
                      <td className="px-4 py-2">
                        <p className="font-medium leading-snug">{label}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                          {fw.scoreLabels[row.scoreLabel]}
                        </p>
                      </td>
                      <HeatmapCell value={scorePct} display={`${row.score}/5`} />
                      <HeatmapCell
                        value={row.coverage}
                        display={`${row.coverage}%`}
                      />
                      <HeatmapCell
                        value={row.visualStrength}
                        display={`${row.visualStrength}%`}
                      />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/10">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left">
                  <th className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.dimension}
                  </th>
                  <th className="px-3 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.score}
                  </th>
                  <th className="px-3 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.coverage}
                  </th>
                  <th className="px-3 py-3 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {hm.visualStrength}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const label =
                    hm.shortLabels[row.dimensionId as DimensionId] ??
                    fw.dimensions[row.dimensionId as DimensionId]
                  const scorePct = (row.score / 5) * 100

                  return (
                    <tr
                      key={row.dimensionId}
                      className="border-b border-border/30 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="min-w-[140px]">
                          <p className="font-medium leading-snug">{label}</p>
                          <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                            {fw.scoreLabels[row.scoreLabel]}
                          </p>
                        </div>
                      </td>
                      <BarCell value={scorePct} display={`${row.score}/5`} />
                      <BarCell
                        value={row.coverage}
                        display={`${row.coverage}%`}
                      />
                      <BarCell
                        value={row.visualStrength}
                        display={`${row.visualStrength}%`}
                      />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 px-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hm.legend}
          </span>
          <LegendSwatch color="rose" label={hm.legendLow} />
          <LegendSwatch color="amber" label={hm.legendMid} />
          <LegendSwatch color="sky" label={hm.legendGood} />
          <LegendSwatch color="emerald" label={hm.legendHigh} />
        </div>
      </div>
    </ReportSection>
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
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
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
        <div className="h-2 overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${width}%`,
              backgroundColor: strengthColor(width),
            }}
          />
        </div>
        <p className="text-center font-mono text-[10px] tabular-nums text-muted-foreground">
          {display}
        </p>
      </div>
    </td>
  )
}

function LegendSwatch({
  color,
  label,
}: {
  color: "rose" | "amber" | "sky" | "emerald"
  label: string
}) {
  const swatchClass = {
    rose: "bg-rose-500/60",
    amber: "bg-amber-500/60",
    sky: "bg-sky-500/60",
    emerald: "bg-emerald-500/60",
  }[color]

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-sm", swatchClass)} />
      {label}
    </span>
  )
}

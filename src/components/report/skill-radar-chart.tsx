"use client"

import { ReportSection } from "@/components/report/report-section"
import { useLocale } from "@/components/providers/locale-provider"
import type { CategoryScore } from "@/types/framework"
import type { CategoryId } from "@/types/framework"

interface SkillRadarChartProps {
  categories: CategoryScore[]
}

const CATEGORY_ORDER: CategoryId[] = [
  "product_strategy",
  "experience_craft",
  "systems_technical",
  "communication_process",
]

export function SkillRadarChart({ categories }: SkillRadarChartProps) {
  const { messages } = useLocale()
  const fw = messages.report.framework

  const scoreMap = new Map(categories.map((c) => [c.categoryId, c.score]))
  const ordered = CATEGORY_ORDER.map((id) => ({
    id,
    score: scoreMap.get(id) ?? 0,
    label: fw.categories[id],
  }))

  const cx = 160
  const cy = 160
  const maxR = 100
  const levels = [25, 50, 75, 100]
  const angleStep = (2 * Math.PI) / ordered.length

  const pointAt = (index: number, score: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (score / 100) * maxR
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const dataPoints = ordered
    .map((item, i) => {
      const p = pointAt(i, item.score)
      return `${p.x},${p.y}`
    })
    .join(" ")

  const labelAt = (index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = maxR + 28
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  return (
    <ReportSection title={fw.skillRadar} description={fw.skillRadarDescription}>
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border/60 bg-muted/20 py-8 lg:flex-row lg:justify-center lg:gap-12">
        <svg viewBox="0 0 320 320" className="h-64 w-64 shrink-0">
          {levels.map((level) => {
            const pts = ordered
              .map((_, i) => {
                const p = pointAt(i, level)
                return `${p.x},${p.y}`
              })
              .join(" ")
            return (
              <polygon
                key={level}
                points={pts}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
            )
          })}
          {ordered.map((_, i) => {
            const p = pointAt(i, 100)
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            )
          })}
          <polygon
            points={dataPoints}
            fill="oklch(0.55 0.15 265 / 0.2)"
            stroke="oklch(0.55 0.15 265 / 0.8)"
            strokeWidth={2}
          />
          {ordered.map((item, i) => {
            const p = pointAt(i, item.score)
            return <circle key={item.id} cx={p.x} cy={p.y} r={3} fill="oklch(0.55 0.15 265)" />
          })}
          {ordered.map((item, i) => {
            const lp = labelAt(i)
            return (
              <text
                key={`label-${item.id}`}
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {item.label}
              </text>
            )
          })}
        </svg>
        <div className="grid w-full max-w-xs gap-2 px-4">
          {ordered.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono tabular-nums">{item.score}</span>
            </div>
          ))}
        </div>
      </div>
    </ReportSection>
  )
}

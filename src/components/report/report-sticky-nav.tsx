"use client"

import { useEffect, useState } from "react"

import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

export const REPORT_NAV_SECTIONS = [
  "overview",
  "capability",
  "evidence",
  "gaps",
  "action-plan",
  "methodology",
] as const

export type ReportNavSection = (typeof REPORT_NAV_SECTIONS)[number]

export function ReportStickyNav() {
  const { messages } = useLocale()
  const nav = messages.report.navigation
  const [active, setActive] = useState<ReportNavSection>("overview")
  const [progress, setProgress] = useState(0)

  const items: { id: ReportNavSection; label: string }[] = [
    { id: "overview", label: nav.overview },
    { id: "capability", label: nav.capability },
    { id: "evidence", label: nav.evidence },
    { id: "gaps", label: nav.gaps },
    { id: "action-plan", label: nav.actionPlan },
    { id: "methodology", label: nav.methodology },
  ]

  useEffect(() => {
    const sectionEls = REPORT_NAV_SECTIONS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[]

    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id as ReportNavSection)
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sectionEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      setProgress(scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function scrollTo(id: ReportNavSection) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="sticky top-14 z-40 border-b border-[var(--workspace-border)] bg-[var(--workspace-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <p className="report-caption hidden sm:block">{nav.readingProgress}</p>
          <p className="report-caption tabular-nums">{progress}%</p>
        </div>
        <div className="h-0.5 overflow-hidden rounded-full bg-[var(--workspace-border)]">
          <div
            className="h-full bg-[var(--workspace-accent)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto pb-0.5"
          aria-label={nav.ariaLabel}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active === item.id
                  ? "bg-[var(--workspace-accent)] text-white"
                  : "text-[var(--workspace-text-secondary)] hover:bg-[var(--workspace-surface-raised)] hover:text-[var(--workspace-text-primary)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

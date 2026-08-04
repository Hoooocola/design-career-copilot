"use client"

import { useEffect, useState } from "react"

import { useLocale } from "@/components/providers/locale-provider"
import { cn } from "@/lib/utils"

export const WORKSPACE_NAV_SECTIONS = [
  "career-position",
  "capability-map",
  "evidence-quality",
  "priority-opportunities",
  "career-action-plan",
  "methodology",
] as const

export type WorkspaceNavSection = (typeof WORKSPACE_NAV_SECTIONS)[number]

export function WorkspaceNav() {
  const { messages } = useLocale()
  const nav = messages.report.workspace.navigation
  const [active, setActive] = useState<WorkspaceNavSection>("career-position")

  const items: { id: WorkspaceNavSection; label: string }[] = [
    { id: "career-position", label: nav.careerPosition },
    { id: "capability-map", label: nav.capabilityMap },
    { id: "evidence-quality", label: nav.evidenceQuality },
    { id: "priority-opportunities", label: nav.priorityOpportunities },
    { id: "career-action-plan", label: nav.careerActionPlan },
    { id: "methodology", label: nav.methodology },
  ]

  useEffect(() => {
    const sectionEls = WORKSPACE_NAV_SECTIONS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[]

    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id as WorkspaceNavSection)
        }
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sectionEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: WorkspaceNavSection) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="workspace-nav sticky top-14 z-40 border-b border-[var(--workspace-border)] bg-[var(--workspace-bg)]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto py-2.5"
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
                  : "text-[var(--workspace-text-secondary)] hover:bg-[var(--workspace-panel)] hover:text-[var(--workspace-text-primary)]"
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

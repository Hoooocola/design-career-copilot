"use client"

import { cn } from "@/lib/utils"

interface ReportWorkspaceProps {
  header: React.ReactNode
  nav: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ReportWorkspace({
  header,
  nav,
  children,
  className,
}: ReportWorkspaceProps) {
  return (
    <div className={cn("report-workspace min-h-screen", className)}>
      {header}
      {nav}
      <main className="workspace-main mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  )
}

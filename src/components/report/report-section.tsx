import type { EngagementSectionId } from "@/types/engagement"
import { cn } from "@/lib/utils"
import { ReportSectionHeader } from "@/components/report/report-primitives"

interface ReportSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  trackingId?: EngagementSectionId
}

export function ReportSection({
  title,
  description,
  children,
  className,
  trackingId,
}: ReportSectionProps) {
  return (
    <section
      className={cn("space-y-5", className)}
      data-engagement-section={trackingId}
    >
      <ReportSectionHeader title={title} description={description} />
      {children}
    </section>
  )
}

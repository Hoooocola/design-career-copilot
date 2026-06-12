import type { EngagementSectionId } from "@/types/engagement"
import { cn } from "@/lib/utils"

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
      className={cn("space-y-4", className)}
      data-engagement-section={trackingId}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

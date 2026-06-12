import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "narrow" | "wide"
}

const sizeClasses = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-12 sm:px-6 sm:py-16",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}

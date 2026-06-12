import { AnalysisForm } from "@/components/landing/analysis-form"
import { HeroSection } from "@/components/landing/hero-section"
import { PageContainer } from "@/components/layout/page-container"

export default function HomePage() {
  return (
    <PageContainer size="default" className="py-16 sm:py-24">
      <div className="space-y-16">
        <HeroSection />
        <AnalysisForm />
      </div>
    </PageContainer>
  )
}

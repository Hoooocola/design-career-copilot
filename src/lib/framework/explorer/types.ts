import type { CategoryId, DimensionId } from "@/types/framework"

export interface FrameworkExplorerDimension {
  id: DimensionId
  categoryId: CategoryId
  title: string
  definition: string
  whyItMatters: string
  evaluationCriteria: string[]
  exampleEvidence: string[]
  commonWeaknesses: string[]
}

import type {
  OpportunityItem,
  OpportunityPriority,
  PortfolioReport,
} from "@/types/report"
import type { ApplicableRole } from "@/types/rubric"

const ROLE_LABELS: Record<ApplicableRole, string> = {
  ai_product_designer: "AI Product Designer",
  ai_ux_designer: "AI UX Designer",
  design_engineer: "Design Engineer",
}

export function computePriorityScore(
  item: Pick<OpportunityItem, "impact" | "effort">
): number {
  return item.impact * 2 - item.effort
}

export function derivePriority(
  impact: number,
  effort: number
): OpportunityPriority {
  if (impact >= 4 && effort <= 3) return "high"
  if (impact >= 3 && effort <= 4) return "medium"
  return "low"
}

function clampRating(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.max(1, Math.round(value))) as 1 | 2 | 3 | 4 | 5
}

export function sortOpportunities(
  items: OpportunityItem[]
): OpportunityItem[] {
  return [...items].sort((a, b) => {
    const scoreDiff = computePriorityScore(b) - computePriorityScore(a)
    if (scoreDiff !== 0) return scoreDiff
    if (b.impact !== a.impact) return b.impact - a.impact
    return a.effort - b.effort
  })
}

export function normalizeOpportunities(
  items: OpportunityItem[]
): OpportunityItem[] {
  return sortOpportunities(
    items.map((item) => {
      const impact = clampRating(item.impact)
      const effort = clampRating(item.effort)
      return {
        ...item,
        impact,
        effort,
        priority: item.priority ?? derivePriority(impact, effort),
      }
    })
  )
}

function titleFromWeakness(weakness: string): string {
  const trimmed = weakness.trim()
  if (trimmed.length <= 56) return `Improve ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`
  return `Address ${trimmed.slice(0, 52).trim()}…`
}

export function buildOpportunitiesFromWeaknesses(
  weaknesses: string[],
  targetRole?: ApplicableRole
): OpportunityItem[] {
  const roleLabel = targetRole ? ROLE_LABELS[targetRole] : "target role"

  return normalizeOpportunities(
    weaknesses.map((weakness, index) => {
      const impact = clampRating(5 - Math.floor(index / 2))
      const effort = clampRating(2 + (index % 3))
      return {
        title: titleFromWeakness(weakness),
        weakness,
        impact,
        effort,
        priority: derivePriority(impact, effort),
        expectedOutcome: `Increase ${roleLabel} role match score by resolving this gap.`,
      }
    })
  )
}

export function ensureOpportunityRanking(
  report: PortfolioReport
): PortfolioReport {
  if (report.opportunityRanking?.length) {
    return {
      ...report,
      opportunityRanking: normalizeOpportunities(report.opportunityRanking),
    }
  }

  return {
    ...report,
    opportunityRanking: buildOpportunitiesFromWeaknesses(
      report.weaknesses,
      report.meta?.targetRole as ApplicableRole | undefined
    ),
  }
}

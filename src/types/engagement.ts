export type EngagementSectionId =
  | "executive_summary"
  | "heatmap"
  | "benchmark"
  | "consensus"
  | "gap_analysis"
  | "opportunity_ranking"
  | "roadmap"

export interface SectionVisit {
  enteredAt: number
  leftAt?: number
  dwellMs?: number
}

export interface SectionEngagementRecord {
  sectionId: EngagementSectionId
  visits: SectionVisit[]
  totalDwellMs: number
}

export interface ReportEngagementSession {
  id: string
  pathname: string
  pageEnteredAt: number
  pageLeftAt?: number
  totalPageDwellMs?: number
  sections: Partial<Record<EngagementSectionId, SectionEngagementRecord>>
}

export interface EngagementStore {
  sessions: ReportEngagementSession[]
  version: 1
}

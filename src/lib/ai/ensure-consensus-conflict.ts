import { getMockConsensusConflict } from "@/lib/mock-consensus-conflict"
import type { Locale } from "@/lib/i18n"
import type { ConsensusConflictAnalysis, PortfolioReport } from "@/types/report"

export function ensureConsensusConflict(
  report: PortfolioReport,
  locale: Locale = "en"
): PortfolioReport {
  if (
    report.consensusConflict?.consensus?.length &&
    report.consensusConflict?.conflicts?.length
  ) {
    return report
  }

  return {
    ...report,
    consensusConflict: getMockConsensusConflict(locale),
  }
}

export function normalizeConsensusConflict(
  data: ConsensusConflictAnalysis
): ConsensusConflictAnalysis {
  return {
    consensus: data.consensus.filter((item) => item.capability.trim()),
    conflicts: data.conflicts
      .filter((item) => item.topic.trim() && item.viewpoints.length >= 2)
      .map((item) => ({
        ...item,
        viewpoints: item.viewpoints.filter((v) => v.viewpoint.trim()),
      }))
      .filter((item) => item.viewpoints.length >= 2),
  }
}

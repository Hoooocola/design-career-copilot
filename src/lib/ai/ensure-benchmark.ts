import { getMockBenchmark } from "@/lib/mock-benchmark"
import type { Locale } from "@/lib/i18n"
import type { PortfolioReport } from "@/types/report"

export function ensureBenchmark(
  report: PortfolioReport,
  locale: Locale = "en"
): PortfolioReport {
  if (report.benchmark?.percentileRanking?.length) {
    return report
  }

  return {
    ...report,
    benchmark: getMockBenchmark(locale),
  }
}

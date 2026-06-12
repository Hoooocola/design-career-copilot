import { EXPLORER_DIMENSIONS_EN } from "@/lib/framework/explorer/en"
import { EXPLORER_DIMENSIONS_ZH } from "@/lib/framework/explorer/zh"
import type { FrameworkExplorerDimension } from "@/lib/framework/explorer/types"
import { FRAMEWORK_CATEGORIES } from "@/lib/framework/categories"
import type { Locale } from "@/lib/i18n"
import type { CategoryId, DimensionId } from "@/types/framework"

export function getExplorerDimensions(
  locale: Locale
): FrameworkExplorerDimension[] {
  return locale === "zh" ? EXPLORER_DIMENSIONS_ZH : EXPLORER_DIMENSIONS_EN
}

export function getExplorerDimensionsByCategory(locale: Locale) {
  const dimensions = getExplorerDimensions(locale)
  const byId = new Map(dimensions.map((d) => [d.id, d]))

  return FRAMEWORK_CATEGORIES.map((cat) => ({
    categoryId: cat.id as CategoryId,
    dimensions: cat.dimensionIds
      .map((id) => byId.get(id))
      .filter((d): d is FrameworkExplorerDimension => Boolean(d)),
  })).filter((group) => group.dimensions.length > 0)
}

export function getExplorerDimension(
  locale: Locale,
  id: DimensionId
): FrameworkExplorerDimension | undefined {
  return getExplorerDimensions(locale).find((d) => d.id === id)
}

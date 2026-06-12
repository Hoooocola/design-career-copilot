import rubric from "./portfolio-review-rubric.json"
import type { ApplicableRole } from "@/types/rubric"

export { rubric }

export function getRoleProfile(role: ApplicableRole) {
  return rubric.role_profiles[role]
}

export function getDimensionWeights(role: ApplicableRole) {
  return rubric.role_profiles[role].dimension_weights
}

export function getCriticalDimensions(role: ApplicableRole) {
  return rubric.role_profiles[role].critical_dimensions
}

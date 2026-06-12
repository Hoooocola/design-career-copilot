import {
  ENGAGEMENT_STORAGE_KEY,
  MAX_STORED_SESSIONS,
  TRACKED_SECTION_IDS,
} from "@/lib/engagement/constants"
import type {
  EngagementSectionId,
  EngagementStore,
  ReportEngagementSession,
  SectionEngagementRecord,
  SectionVisit,
} from "@/types/engagement"

function emptySectionRecord(
  sectionId: EngagementSectionId
): SectionEngagementRecord {
  return { sectionId, visits: [], totalDwellMs: 0 }
}

export function createEngagementSession(pathname: string): ReportEngagementSession {
  const sections = Object.fromEntries(
    TRACKED_SECTION_IDS.map((id) => [id, emptySectionRecord(id)])
  ) as ReportEngagementSession["sections"]

  return {
    id: crypto.randomUUID(),
    pathname,
    pageEnteredAt: Date.now(),
    sections,
  }
}

function readStore(): EngagementStore {
  if (typeof window === "undefined") {
    return { version: 1, sessions: [] }
  }

  try {
    const raw = localStorage.getItem(ENGAGEMENT_STORAGE_KEY)
    if (!raw) return { version: 1, sessions: [] }
    const parsed = JSON.parse(raw) as EngagementStore
    if (parsed.version !== 1 || !Array.isArray(parsed.sessions)) {
      return { version: 1, sessions: [] }
    }
    return parsed
  } catch {
    return { version: 1, sessions: [] }
  }
}

function writeStore(store: EngagementStore) {
  if (typeof window === "undefined") return
  localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(store))
}

export function persistEngagementSession(session: ReportEngagementSession) {
  const store = readStore()
  const withoutDuplicate = store.sessions.filter((s) => s.id !== session.id)
  const sessions = [session, ...withoutDuplicate].slice(0, MAX_STORED_SESSIONS)
  writeStore({ version: 1, sessions })
}

export function getEngagementSessions(): ReportEngagementSession[] {
  return readStore().sessions
}

export function recordSectionEnter(
  session: ReportEngagementSession,
  sectionId: EngagementSectionId,
  enteredAt: number
): ReportEngagementSession {
  const sections = { ...session.sections }
  const record = sections[sectionId] ?? emptySectionRecord(sectionId)
  const openVisit = record.visits.find((visit) => visit.leftAt === undefined)

  if (openVisit) {
    return session
  }

  const visit: SectionVisit = { enteredAt }
  sections[sectionId] = {
    ...record,
    visits: [...record.visits, visit],
  }

  return { ...session, sections }
}

export function recordSectionLeave(
  session: ReportEngagementSession,
  sectionId: EngagementSectionId,
  leftAt: number
): ReportEngagementSession {
  const sections = { ...session.sections }
  const record = sections[sectionId] ?? emptySectionRecord(sectionId)
  const visits = [...record.visits]
  const openIndex = visits.findIndex((visit) => visit.leftAt === undefined)

  if (openIndex === -1) {
    return session
  }

  const enteredAt = visits[openIndex].enteredAt
  const dwellMs = Math.max(0, leftAt - enteredAt)
  visits[openIndex] = { enteredAt, leftAt, dwellMs }

  sections[sectionId] = {
    ...record,
    visits,
    totalDwellMs: record.totalDwellMs + dwellMs,
  }

  return { ...session, sections }
}

export function finalizeEngagementSession(
  session: ReportEngagementSession,
  leftAt: number,
  openSectionIds: EngagementSectionId[]
): ReportEngagementSession {
  let next = session
  for (const sectionId of openSectionIds) {
    next = recordSectionLeave(next, sectionId, leftAt)
  }

  return {
    ...next,
    pageLeftAt: leftAt,
    totalPageDwellMs: Math.max(0, leftAt - next.pageEnteredAt),
  }
}

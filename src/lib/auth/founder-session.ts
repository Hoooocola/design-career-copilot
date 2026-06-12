export const FOUNDER_AUTH_COOKIE = "dcc-founder-auth"
export const BETA_INVITE_COOKIE = "dcc-beta-invite"

export function getFounderSessionToken(): string | undefined {
  return process.env.FOUNDER_SESSION_TOKEN?.trim()
}

export function getFounderPassword(): string | undefined {
  return process.env.FOUNDER_PASSWORD?.trim()
}

export function getBetaInviteCode(): string | undefined {
  return process.env.BETA_INVITE_CODE?.trim()
}

export function isFounderAuthenticated(cookieValue: string | undefined): boolean {
  const token = getFounderSessionToken()
  if (!token || !cookieValue) return false
  return cookieValue === token
}

export function isBetaInviteValid(cookieValue: string | undefined): boolean {
  const code = getBetaInviteCode()
  if (!code) return true
  if (!cookieValue) return false
  return cookieValue === code
}

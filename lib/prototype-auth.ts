const STORAGE_KEY = "clearclaim_prototype_session"

export type PrototypeSession = {
  email: string
  fullName?: string
  at: string
}

export function getPrototypeSession(): PrototypeSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PrototypeSession
  } catch {
    return null
  }
}

export function setPrototypeSession(data: { email: string; fullName?: string }) {
  const payload: PrototypeSession = {
    email: data.email,
    fullName: data.fullName,
    at: new Date().toISOString(),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearPrototypeSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

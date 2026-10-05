import type { Progress } from './types'

export const STORAGE_KEY = 'pypasso:v1'
export const STORAGE_VERSION = 1
export const MAX_CODE_CHARS = 50_000

export function defaultProgress(): Progress {
  return { version: STORAGE_VERSION, completed: [], drafts: {}, labCode: '', lastSlug: null }
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<Progress>
    if (parsed.version !== STORAGE_VERSION) return defaultProgress()
    return {
      version: STORAGE_VERSION,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((s): s is string => typeof s === 'string') : [],
      drafts: parsed.drafts && typeof parsed.drafts === 'object' ? (parsed.drafts as Record<string, string>) : {},
      labCode: typeof parsed.labCode === 'string' ? parsed.labCode : '',
      lastSlug: typeof parsed.lastSlug === 'string' ? parsed.lastSlug : null,
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, version: STORAGE_VERSION }))
  } catch {
    // armazenamento cheio ou indisponível: segue sem persistir
  }
}

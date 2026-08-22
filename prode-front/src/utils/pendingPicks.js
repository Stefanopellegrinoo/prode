// Minimal localStorage persistence for picks saved while offline (design ADR-10).
// No retry queue, no backoff, no conflict resolution — the next `online` event or
// manual save retries whatever is still there (ponytail: single flat map, per-user
// retry queue with backoff if flush ever needs to survive repeated failures).
//
// Keyed per user (`prode:pendingPicks:{userId}`) so two accounts on the same
// browser never see each other's pending picks.
//
// Every localStorage call is wrapped in try/catch — private browsing (Safari)
// and quota-exceeded both throw synchronously on access, not just on write.
// On failure this degrades to "nothing persisted", never to a crash.

export const pendingPicksStore = (userId) => {
  const storageKey = `prode:pendingPicks:${userId}`

  const readPending = () => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const writePending = (map) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(map))
    } catch {
      // private mode / quota exceeded — picks stay in memory only (React state),
      // caller already updated that; this is a best-effort persistence layer.
    }
  }

  const clearPending = (matchIds) => {
    try {
      const next = readPending()
      matchIds.forEach((id) => delete next[id])
      if (Object.keys(next).length) {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch {
      // same degrade as writePending
    }
  }

  return { readPending, writePending, clearPending }
}

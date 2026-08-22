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

// Errors the backend only ever throws for a reason a retry can't fix (match
// already started/finished/deleted) — see prediction.service.js. Anything
// else (network drop, 5xx, timeout) is treated as transient and stays
// pending for the next flush attempt.
const TERMINAL_PREDICTION_ERRORS = new Set([
  "Partido no encontrado",
  "No se puede modificar el pronóstico de un partido ya iniciado",
  "No se puede pronosticar un partido finalizado.",
])

export const isTerminalPredictionError = (message) => TERMINAL_PREDICTION_ERRORS.has(message)

// A plain object keyed by matchId, or {} for anything else (array, string,
// null, garbage JSON) — readPending()'s only contract to its callers.
const isPlainMap = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

// Reconciles the pending map with a fresh pick the instant the user makes it —
// not later, at flush time — so a stale offline commitment never outlives the
// user's actual intent. No-op if nothing was pending for this match yet (the
// entry is only created by the offline branch of handleSave).
export const reconcilePendingOnPick = (pending, matchId, value) => {
  if (pending[matchId] === undefined) return pending
  const next = { ...pending }
  if (value === null) delete next[matchId]
  else next[matchId] = value
  return next
}

export const pendingPicksStore = (userId) => {
  const storageKey = `prode:pendingPicks:${userId}`

  const readPending = () => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      return isPlainMap(parsed) ? parsed : {}
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

// Runnable check for utils/pendingPicks.js — `node src/utils/pendingPicks.check.js`.
// Node has no `localStorage` global — a tiny in-memory shim stands in for it,
// including a broken variant to exercise the try/catch degrade path (private
// browsing mode).
import assert from "node:assert/strict"

const memoryStorage = () => {
  const map = new Map()
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  }
}

globalThis.localStorage = memoryStorage()
const { pendingPicksStore, reconcilePendingOnPick, isTerminalPredictionError } = await import(
  "./pendingPicks.js"
)

// --- basic read/write/clear roundtrip, scoped per user ---
const userA = pendingPicksStore(1)
const userB = pendingPicksStore(2)

assert.deepEqual(userA.readPending(), {})

userA.writePending({ 11: "home", 9: "draw" })
assert.deepEqual(userA.readPending(), { 11: "home", 9: "draw" })
assert.deepEqual(userB.readPending(), {}) // isolated per user

userA.clearPending(["11"])
assert.deepEqual(userA.readPending(), { 9: "draw" })

userA.clearPending(["9"])
assert.deepEqual(userA.readPending(), {}) // key removed entirely, not left as "{}"
assert.equal(localStorage.getItem("prode:pendingPicks:1"), null)

// --- readPending() rejects malformed JSON shapes (array/string/number), never
// --- hands the caller anything but a plain map ---
globalThis.localStorage = memoryStorage()
localStorage.setItem("prode:pendingPicks:4", JSON.stringify(["home", "away"]))
assert.deepEqual(pendingPicksStore(4).readPending(), {})
localStorage.setItem("prode:pendingPicks:5", JSON.stringify("home"))
assert.deepEqual(pendingPicksStore(5).readPending(), {})
localStorage.setItem("prode:pendingPicks:6", "{not json")
assert.deepEqual(pendingPicksStore(6).readPending(), {})

// --- reconcilePendingOnPick: single point of mutation for a pick change ---
// no-op when nothing was pending for this match — most taps never touch storage
const untouched = { 9: "draw" }
assert.equal(reconcilePendingOnPick(untouched, "11", "home"), untouched) // same ref, no entry for 11

// deselect (null) drops the stale entry entirely — this is the CRITICAL fix's repro
assert.deepEqual(reconcilePendingOnPick({ 11: "home", 9: "draw" }, "11", null), { 9: "draw" })

// picking something else overwrites the stale commitment, doesn't just drop it
assert.deepEqual(reconcilePendingOnPick({ 11: "home" }, "11", "away"), { 11: "away" })

// --- isTerminalPredictionError: only the backend's non-retryable messages ---
assert.equal(isTerminalPredictionError("No se puede modificar el pronóstico de un partido ya iniciado"), true)
assert.equal(isTerminalPredictionError("No se puede pronosticar un partido finalizado."), true)
assert.equal(isTerminalPredictionError("Partido no encontrado"), true)
assert.equal(isTerminalPredictionError("Error al guardar la predicción"), false) // generic/network fallback
assert.equal(isTerminalPredictionError(undefined), false)

// --- degrades to no-op, never throws, when localStorage itself is broken ---
const brokenStorage = {
  getItem: () => {
    throw new Error("SecurityError: private mode")
  },
  setItem: () => {
    throw new Error("QuotaExceededError")
  },
  removeItem: () => {
    throw new Error("SecurityError: private mode")
  },
}
globalThis.localStorage = brokenStorage
const userC = pendingPicksStore(3)
assert.doesNotThrow(() => userC.readPending())
assert.deepEqual(userC.readPending(), {})
assert.doesNotThrow(() => userC.writePending({ 1: "home" }))
assert.doesNotThrow(() => userC.clearPending(["1"]))

console.log("pendingPicks.check.js: OK")

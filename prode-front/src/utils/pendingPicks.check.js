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
const { pendingPicksStore } = await import("./pendingPicks.js")

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

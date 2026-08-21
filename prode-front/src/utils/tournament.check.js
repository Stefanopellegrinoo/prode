// Runnable check for utils/tournament.js — `node src/utils/tournament.check.js`.
import assert from "node:assert/strict"
import { pickCurrentTournament } from "./tournament.js"

assert.equal(pickCurrentTournament([]), null)
assert.equal(pickCurrentTournament(), null)

// highest season wins
assert.equal(
  pickCurrentTournament([
    { id: 1, season: "2025" },
    { id: 2, season: "2026" },
    { id: 3, season: "2024" },
  ]).id,
  2
)

// same season -> highest id wins
assert.equal(
  pickCurrentTournament([
    { id: 7, season: "2026" },
    { id: 9, season: "2026" },
    { id: 8, season: "2026" },
  ]).id,
  9
)

console.log("tournament.check.js: OK")

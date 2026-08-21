// Runnable check for utils/fixture.js — `node src/utils/fixture.check.js`.
// No framework, no test runner in this project (see design ADR-9). Asserts run
// against a real payload captured from `GET /matches/enriched/tournament/1`
// (R-D1 gate, tournament seeded by `npm run db:setup`) plus a couple of clearly
// synthetic cases for branches the current seed data can't exercise (multi-fecha
// ordering, finished status, live status).
import assert from "node:assert/strict"
import { normalizeFixture, matchStatus, deriveFechas, getFechaActual } from "./fixture.js"

// --- Real payload, trimmed to 2 matches per subdivision (captured 2026-08-20) ---
const REAL_PAYLOAD = {
  Primera: {
    "2026-08-22": [
      {
        id: 11,
        tournament_id: 1,
        subdivision_id: 1,
        home_team_id: 11,
        away_team_id: 12,
        date: "2026-08-22T18:30:00.000Z",
        home_score: null,
        away_score: null,
        status: "UPCOMING",
        result: null,
        homeTeam: { id: 11, name: "Club Champagnat", logo: null },
        awayTeam: { id: 12, name: "Club Los Tilos", logo: null },
        Subdivision: { id: 1, name: "Primera" },
        Predictions: [{ predicted_winner: "home" }],
        userPrediction: { predicted_winner: "home" },
      },
      {
        id: 9,
        tournament_id: 1,
        subdivision_id: 1,
        home_team_id: 9,
        away_team_id: 10,
        date: "2026-08-22T18:30:00.000Z",
        home_score: null,
        away_score: null,
        status: "UPCOMING",
        result: null,
        homeTeam: { id: 9, name: "Club Regatas de Bella Vista", logo: null },
        awayTeam: { id: 10, name: "Buenos Aires Cricket & Rugby Club", logo: null },
        Subdivision: { id: 1, name: "Primera" },
        Predictions: [],
        userPrediction: null,
      },
    ],
  },
  Intermedia: {
    "2026-08-22": [
      {
        id: 12,
        tournament_id: 1,
        subdivision_id: 2,
        home_team_id: 11,
        away_team_id: 12,
        date: "2026-08-22T18:30:00.000Z",
        home_score: null,
        away_score: null,
        status: "UPCOMING",
        result: null,
        homeTeam: { id: 11, name: "Club Champagnat", logo: null },
        awayTeam: { id: 12, name: "Club Los Tilos", logo: null },
        Subdivision: { id: 2, name: "Intermedia" },
        Predictions: [],
        userPrediction: null,
      },
    ],
  },
}

const normalized = normalizeFixture(REAL_PAYLOAD)

// subdivisions: order of first appearance, real ids/names from the payload
assert.deepEqual(normalized.subdivisions, [
  { id: 1, name: "Primera" },
  { id: 2, name: "Intermedia" },
])

// fechas: single real date key -> "Fecha 1"
assert.equal(normalized.fechas.length, 1)
assert.equal(normalized.fechas[0].key, "2026-08-22")
assert.equal(normalized.fechas[0].number, 1)

// matchesBy: grouped by real subdivision id + date key
const primeraMatches = normalized.matchesBy[1]["2026-08-22"]
assert.equal(primeraMatches.length, 2)

const withPick = primeraMatches.find((m) => m.id === 11)
assert.equal(withPick.savedPick, "home")
assert.equal(withPick.status, "scheduled") // UPCOMING -> scheduled
assert.equal(withPick.home.shortName, "CLU") // no shortName in payload -> name fallback
// exact format depends on the runtime locale (browser vs this Node process) — just
// confirm it derived a real HH:MM-shaped clock time, not an empty string
assert.match(withPick.time, /^\d{1,2}:\d{2}/)

const withoutPick = primeraMatches.find((m) => m.id === 9)
assert.equal(withoutPick.savedPick, null)

// --- matchStatus mapping table (synthetic — seed data has no live/finished matches) ---
assert.equal(matchStatus({ status: "UPCOMING" }), "scheduled")
assert.equal(matchStatus({ status: "programado" }), "scheduled")
assert.equal(matchStatus({ status: "LIVE" }), "live")
assert.equal(matchStatus({ status: "en_vivo" }), "live")
assert.equal(matchStatus({ status: "finished" }), "finished")
assert.equal(matchStatus({ status: "FINAL" }), "finished")
assert.equal(matchStatus({ status: "whatever", result: "home" }), "finished") // fallback via result
assert.equal(matchStatus({ status: undefined }), "scheduled")

// --- deriveFechas ordering (synthetic — multi-date case) ---
const fechas = deriveFechas(new Set(["2026-08-29", "2026-08-15", "2026-08-22"]))
assert.deepEqual(
  fechas.map((f) => f.key),
  ["2026-08-15", "2026-08-22", "2026-08-29"]
)
assert.deepEqual(
  fechas.map((f) => f.number),
  [1, 2, 3]
)

// --- getFechaActual (synthetic — first fecha finished, second not) ---
const syntheticFechas = deriveFechas(new Set(["2026-08-15", "2026-08-22"]))
const syntheticMatchesBy = {
  1: {
    "2026-08-15": [{ status: "finished" }],
    "2026-08-22": [{ status: "scheduled" }],
  },
}
assert.equal(getFechaActual(syntheticFechas, syntheticMatchesBy).key, "2026-08-22")

const allFinishedMatchesBy = {
  1: {
    "2026-08-15": [{ status: "finished" }],
    "2026-08-22": [{ status: "finished" }],
  },
}
assert.equal(getFechaActual(syntheticFechas, allFinishedMatchesBy).key, "2026-08-22") // falls back to last

assert.equal(getFechaActual([], {}), null)

console.log("fixture.check.js: OK")

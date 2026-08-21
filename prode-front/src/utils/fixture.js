// Pure fixture normalization — no React, no axios.
//
// The enriched fixture endpoint (`GET /matches/enriched/tournament/:id`) returns a
// nested object, not an array:
//   { [subdivisionName]: { ['yyyy-MM-dd']: Match[] } }
// verified against prode-back/src/repositories/match.repository.js:65-98 at runtime
// (see sdd/redesign-fidelity/apply-progress, R-D1 gate).
//
// "Fecha N" has no backend column — it is derived here as the 1-indexed position of
// a date key in the ascending-sorted list of unique date keys for the tournament.

const STATUS_MAP = {
  upcoming: "scheduled",
  scheduled: "scheduled",
  programado: "scheduled",
  live: "live",
  en_vivo: "live",
  finished: "finished",
  final: "finished",
}

/**
 * Normalizes a backend match `status` (case/spelling varies — `match.model.js`
 * defaults to `'UPCOMING'`, `ranking.repository.js` filters on lowercase `'finished'`)
 * into one of `'scheduled' | 'live' | 'finished'`.
 */
export const matchStatus = (match) => {
  const raw = String(match?.status ?? "").toLowerCase()
  if (STATUS_MAP[raw]) return STATUS_MAP[raw]
  if (match?.result) return "finished"
  return "scheduled"
}

/**
 * `Team.shortName` exists on the model but the enriched endpoint currently selects
 * only `['id','name','logo']` (verified at runtime — see apply-progress). Prefer it
 * when present so a future backend fix is picked up for free; otherwise derive a
 * 3-letter fallback from the name.
 */
const shortName = (team) => {
  if (!team) return ""
  return team.shortName || team.name?.slice(0, 3).toUpperCase() || ""
}

const normalizeMatch = (match) => {
  const kickoff = new Date(match.date)
  return {
    id: match.id,
    kickoff,
    time: kickoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    home: { shortName: shortName(match.homeTeam), name: match.homeTeam?.name ?? "" },
    away: { shortName: shortName(match.awayTeam), name: match.awayTeam?.name ?? "" },
    status: matchStatus(match),
    result: match.result ?? null,
    savedPick: match.userPrediction?.predicted_winner ?? null,
    homeScore: match.home_score ?? null,
    awayScore: match.away_score ?? null,
  }
}

/**
 * Groups the unique `yyyy-MM-dd` date keys ascending and labels each with its
 * 1-indexed position ("Fecha 1", "Fecha 2", ...).
 */
export const deriveFechas = (fechaKeys) =>
  Array.from(fechaKeys)
    .sort()
    .map((key, index) => ({ key, number: index + 1, date: new Date(`${key}T00:00:00`) }))

/**
 * Flattens the backend's `{ subdivisionName: { dateKey: Match[] } }` shape into:
 *   subdivisions: [{ id, name }]                          in order of first appearance
 *   fechas:       [{ key, number, date }]                  unique date keys, ascending
 *   matchesBy:    { [subdivisionId]: { [fechaKey]: NormalizedMatch[] } }
 */
export const normalizeFixture = (payload = {}) => {
  const subdivisionsById = new Map()
  const fechaKeys = new Set()
  const matchesBy = {}

  for (const dateGroups of Object.values(payload)) {
    for (const [fechaKey, matches] of Object.entries(dateGroups)) {
      fechaKeys.add(fechaKey)
      for (const match of matches) {
        const subdivision = match.Subdivision ?? { id: match.subdivision_id, name: "Sin Subdivisión" }
        if (!subdivisionsById.has(subdivision.id)) {
          subdivisionsById.set(subdivision.id, { id: subdivision.id, name: subdivision.name })
        }
        if (!matchesBy[subdivision.id]) matchesBy[subdivision.id] = {}
        if (!matchesBy[subdivision.id][fechaKey]) matchesBy[subdivision.id][fechaKey] = []
        matchesBy[subdivision.id][fechaKey].push(normalizeMatch(match))
      }
    }
  }

  return {
    subdivisions: Array.from(subdivisionsById.values()),
    fechas: deriveFechas(fechaKeys),
    matchesBy,
  }
}

/**
 * Current fecha = first fecha (ascending) whose matches, across every subdivision,
 * are not all `finished`; falls back to the last fecha if every fecha is complete.
 */
export const getFechaActual = (fechas, matchesBy) => {
  if (!fechas.length) return null

  for (const fecha of fechas) {
    let hasMatches = false
    let allFinished = true
    for (const bySubdivision of Object.values(matchesBy)) {
      const matches = bySubdivision[fecha.key]
      if (!matches?.length) continue
      hasMatches = true
      if (matches.some((m) => m.status !== "finished")) allFinished = false
    }
    if (!hasMatches || !allFinished) return fecha
  }

  return fechas[fechas.length - 1]
}

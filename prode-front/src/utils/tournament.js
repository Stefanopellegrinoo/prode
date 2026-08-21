// Pure helper — no React, no axios.
//
// `Tournament` has no `active` column (verified: prode-back/src/models/tournament.model.js
// only has id, name, description, season, created_at). "Current tournament" is derived as
// the highest `season` (string compare — season is `STRING(10)` holding year values like
// "2025"/"2026", so lexicographic order matches chronological order), tie-broken by the
// highest `id`.
//
// ponytail: heuristic breaks if two tournaments share a season and the newer one has a
// lower id (e.g. imported/backfilled data) — upgrade path is a real `active` column on
// `Tournament` (out of scope for this change, see design ADR-6 option B).
//
// Shared by TournamentContext (F1) and Admin's Torneos Activo/Cerrado badge (F3) so the
// rule lives in exactly one place.
export const pickCurrentTournament = (tournaments = []) => {
  if (!tournaments.length) return null
  return tournaments.reduce((current, candidate) => {
    if (!current) return candidate
    if (candidate.season !== current.season) {
      return candidate.season > current.season ? candidate : current
    }
    return candidate.id > current.id ? candidate : current
  }, null)
}

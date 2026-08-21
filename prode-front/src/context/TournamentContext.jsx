import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { getTournaments } from "../services/tournamentService"
import { getGroupedFixturePredicts } from "../services/fixtureService"
import { getSubdivisions } from "../services/subdivisionService"
import { normalizeFixture, getFechaActual } from "../utils/fixture"
import { pickCurrentTournament } from "../utils/tournament"

const TournamentContext = createContext(null)

// Context + hook colocated in one file matches this codebase's existing pattern
// (AuthContext, ThemeContext, AlertContext all do the same).
// eslint-disable-next-line react-refresh/only-export-components
export const useTournament = () => {
  const ctx = useContext(TournamentContext)
  if (!ctx) {
    throw new Error("useTournament must be used within a TournamentProvider")
  }
  return ctx
}

// Resolves the current tournament (ADR-6) and loads its grouped fixture once
// (ADR-7 — subdivisions/fechas/matches all derive from this single request).
// Must be mounted inside protected routes only: the enriched fixture endpoint
// requires an authenticated user.
export const TournamentProvider = ({ children }) => {
  const [tournament, setTournament] = useState(null)
  const [subdivisions, setSubdivisions] = useState([])
  const [fechas, setFechas] = useState([])
  const [matchesBy, setMatchesBy] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const tournaments = await getTournaments()
      const current = pickCurrentTournament(tournaments)
      setTournament(current)

      if (!current) {
        setSubdivisions([])
        setFechas([])
        setMatchesBy({})
        return
      }

      const payload = await getGroupedFixturePredicts(current.id)
      const normalized = normalizeFixture(payload)

      if (normalized.subdivisions.length === 0) {
        // sinFixture: fall back to /subdivisions so screens like Ranking keep their tabs
        setSubdivisions(await getSubdivisions())
      } else {
        setSubdivisions(normalized.subdivisions)
      }
      setFechas(normalized.fechas)
      setMatchesBy(normalized.matchesBy)
    } catch (err) {
      console.error("Error loading tournament context:", err)
      setError(err.message || "Error al cargar el torneo")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const fechaActual = useMemo(() => getFechaActual(fechas, matchesBy), [fechas, matchesBy])

  const value = {
    tournament,
    subdivisions,
    fechas,
    fechaActual,
    matchesBy,
    loading,
    error,
    refetch: load,
  }

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}

TournamentProvider.propTypes = {
  children: PropTypes.node,
}

"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { X } from 'lucide-react'
import Button from "../ui/Button"
import InputField from "../form/InputField"
import { createMatch, updateMatch } from "../../services/matchService"
import { getTeams } from "../../services/teamService"
import { getTournaments } from "../../services/tournamentService"
import { useToast } from "../../hooks/useToast"

const MatchForm = ({ match, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    homeTeamId: match?.homeTeam?.id || "",
    awayTeamId: match?.awayTeam?.id || "",
    tournamentId: match?.tournamentId || "",
    date: match?.date ? new Date(match.date).toISOString().slice(0, 16) : "",
    stadium: match?.stadium || "",
    status: match?.status || "upcoming",
    homeScore: match?.homeScore || 0,
    awayScore: match?.awayScore || 0,
  })
  const [teams, setTeams] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true)
        const [teamsData, tournamentsData] = await Promise.all([getTeams(), getTournaments()])
        setTeams(teamsData)
        setTournaments(tournamentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        showToast("Error al cargar los datos", "error")
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [showToast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.homeTeamId) {
      newErrors.homeTeamId = "El equipo local es requerido"
    }

    if (!formData.awayTeamId) {
      newErrors.awayTeamId = "El equipo visitante es requerido"
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      newErrors.awayTeamId = "El equipo visitante debe ser diferente al local"
    }

    if (!formData.tournamentId) {
      newErrors.tournamentId = "El torneo es requerido"
    }

    if (!formData.date) {
      newErrors.date = "La fecha y hora son requeridas"
    }

    if (!formData.stadium) {
      newErrors.stadium = "El estadio es requerido"
    }

    if (formData.status === "finished" || formData.status === "live") {
      if (formData.homeScore < 0) {
        newErrors.homeScore = "El resultado debe ser un número positivo"
      }
      if (formData.awayScore < 0) {
        newErrors.awayScore = "El resultado debe ser un número positivo"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      // Prepare data for API
      const matchData = {
        ...formData,
        homeScore: parseInt(formData.homeScore, 10),
        awayScore: parseInt(formData.awayScore, 10),
      }

      let savedMatch
      if (match) {
        savedMatch = await updateMatch(match.id, matchData)
      } else {
        savedMatch = await createMatch(matchData)
      }

      onSave(savedMatch)
    } catch (error) {
      console.error("Error saving match:", error)
      setErrors({
        submit: error.message || "Error al guardar el partido",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">{match ? "Editar Partido" : "Agregar Partido"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipo Local <span className="text-red-500">*</span>
              </label>
              <select
                name="homeTeamId"
                value={formData.homeTeamId}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.homeTeamId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                disabled={dataLoading}
              >
                <option value="">Seleccionar equipo</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.homeTeamId && <p className="text-red-600 text-xs mt-1">{errors.homeTeamId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipo Visitante <span className="text-red-500">*</span>
              </label>
              <select
                name="awayTeamId"
                value={formData.awayTeamId}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.awayTeamId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                disabled={dataLoading}
              >
                <option value="">Seleccionar equipo</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.awayTeamId && <p className="text-red-600 text-xs mt-1">{errors.awayTeamId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Torneo <span className="text-red-500">*</span>
              </label>
              <select
                name="tournamentId"
                value={formData.tournamentId}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.tournamentId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                disabled={dataLoading}
              >
                <option value="">Seleccionar torneo</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
              {errors.tournamentId && <p className="text-red-600 text-xs mt-1">{errors.tournamentId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha y Horaa <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
              />
              {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <InputField
                label="Estadio"
                name="stadium"
                value={formData.stadium}
                onChange={handleChange}
                error={errors.stadium}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="upcoming">Próximo</option>
                <option value="live">En Vivo</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>

            {(formData.status === "live" || formData.status === "finished") && (
              <>
                <div>
                  <InputField
                    label="Puntos Equipo Local"
                    name="homeScore"
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={handleChange}
                    error={errors.homeScore}
                  />
                </div>

                <div>
                  <InputField
                    label="Puntos Equipo Visitante"
                    name="awayScore"
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={handleChange}
                    error={errors.awayScore}
                  />
                </div>
              </>
            )}
          </div>

          {errors.submit && <p className="text-red-600 text-sm mt-4">{errors.submit}</p>}

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {match ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

MatchForm.propTypes = {
  match: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default MatchForm

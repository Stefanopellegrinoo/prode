"use client"

import { useState, useEffect } from "react"
import Card from "../ui/Card"
import Button from "../ui/Button"
import { Plus, Edit, Trash2, Calendar, RefreshCw } from "lucide-react"
import { getMatches, deleteMatch } from "../../services/matchService"
import { useToast } from "../../hooks/useToast"
import LoadingSpinner from "../ui/LoadingSpinner"
import MatchForm from "./forms/MatchForm"
import ConfirmDialog from "../ui/ConfirmDialog"
import SearchInput from "../ui/SearchInput"
import FixtureGeneratorForm from "./forms/FixtureGeneratorForm"
import { getTeams } from "../../services/teamService"

const MatchesAdmin = () => {
  const [matches, setMatches] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showGeneratorForm, setShowGeneratorForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubdivision, setFilterSubdivision] = useState("")
  const { showToast } = useToast()
  const [teams, setTeams] = useState([])
  // Cambiar el filtro de subdivisión por equipo
  const [filterTeam, setFilterTeam] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  // Actualizar para reflejar la nueva estructura

  // Cambiar la función fetchData para obtener equipos directamente
  const fetchData = async () => {
    try {
      setLoading(true)
      const [matchesData, teamsData] = await Promise.all([getMatches(), getTeams()])
      setMatches(matchesData)
      setTeams(teamsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      showToast("Error al cargar los datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMatch = () => {
    setEditingMatch(null)
    setShowForm(true)
  }

  const handleEditMatch = (match) => {
    setEditingMatch(match)
    setShowForm(true)
  }

  const handleDeleteMatch = async () => {
    if (!confirmDelete) return

    try {
      await deleteMatch(confirmDelete.id)
      setMatches(matches.filter((match) => match.id !== confirmDelete.id))
      showToast("Partido eliminado correctamente", "success")
    } catch (error) {
      console.error("Error deleting match:", error)
      showToast("Error al eliminar el partido", "error")
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleMatchSaved = (savedMatch) => {
    if (editingMatch) {
      // Update existing match
      setMatches(matches.map((m) => (m.id === savedMatch.id ? savedMatch : m)))
    } else {
      // Add new match
      setMatches([...matches, savedMatch])
    }
    setShowForm(false)
    showToast(editingMatch ? "Partido actualizado correctamente" : "Partido agregado correctamente", "success")
  }

  const handleFixtureGenerated = (newMatches) => {
    setMatches([...matches, ...newMatches])
    setShowGeneratorForm(false)
    showToast(`Se generaron ${newMatches.length} partidos correctamente`, "success")
  }

  // Actualizar el filtrado de partidos
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam = filterTeam ? match.homeTeam.id === filterTeam || match.awayTeam.id === filterTeam : true
    return matchesSearch && matchesTeam
  })

  const getSubdivisionName = (subdivisionId) => {
    const subdivision = subdivisions.find((s) => s.id === subdivisionId)
    return subdivision ? subdivision.name : "Desconocido"
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <SearchInput
            placeholder="Buscar partidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Actualizar el selector de filtro */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Todos los equipos</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGeneratorForm(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generar Fixture
          </Button>
          <Button variant="primary" onClick={handleAddMatch}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Partido
          </Button>
        </div>
      </div>

      <Card title="Partidos" icon={<Calendar className="h-5 w-5" />}>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  {/* Actualizar la tabla para mostrar la subdivisión del equipo local */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subdivisión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equipos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(match.date).toLocaleDateString("es-AR")}
                      <div className="text-xs text-gray-500">
                        {new Date(match.date).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    {/* Actualizar la celda de la tabla */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{match.homeTeam.subdivision || "Principal"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {match.homeTeam.logo ? (
                            <img
                              src={match.homeTeam.logo || "/placeholder.svg"}
                              alt={match.homeTeam.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">{match.homeTeam.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="mx-2">{match.homeTeam.name}</span>
                        <span className="mx-1">vs</span>
                        <span className="mx-2">{match.awayTeam.name}</span>
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {match.awayTeam.logo ? (
                            <img
                              src={match.awayTeam.logo || "/placeholder.svg"}
                              alt={match.awayTeam.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">{match.awayTeam.name.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          match.status === "upcoming"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : match.status === "live"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {match.status === "upcoming" ? "Próximo" : match.status === "live" ? "En Vivo" : "Finalizado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.status !== "upcoming" ? (
                        <span className="font-medium">
                          {match.homeScore} - {match.awayScore}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditMatch(match)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(match)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm || filterTeam ? "No se encontraron partidos" : "No hay partidos registrados"}
          </div>
        )}
      </Card>

      {showForm && (
        <MatchForm
          match={editingMatch}
          subdivisions={subdivisions}
          onClose={() => setShowForm(false)}
          onSave={handleMatchSaved}
        />
      )}

      {showGeneratorForm && (
        <FixtureGeneratorForm
          subdivisions={subdivisions}
          onClose={() => setShowGeneratorForm(false)}
          onGenerate={handleFixtureGenerated}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Partido"
          message={`¿Estás seguro de que deseas eliminar el partido ${confirmDelete.homeTeam.name} vs ${confirmDelete.awayTeam.name}?`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteMatch}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

export default MatchesAdmin

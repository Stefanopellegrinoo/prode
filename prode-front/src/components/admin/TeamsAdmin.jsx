
import { useState, useEffect } from "react"
import Card from "../ui/Card"
import Button from "../ui/Button"
import { Plus, Edit, Trash2, Users, Trophy } from "lucide-react"
import { getTeams, deleteTeam } from "../../services/teamService"
import { useToast } from "../../hooks/useToast"
import LoadingSpinner from "../ui/LoadingSpinner"
import TeamForm from "./forms/TeamForm"
import ConfirmDialog from "../ui/ConfirmDialog"
import SearchInput from "../ui/SearchInput"
import { getTournaments } from "../../services/tournamentService"

const TeamsAdmin = () => {
  const [teams, setTeams] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubdivision, setFilterSubdivision] = useState("")
  const { showToast } = useToast()
  const [tournaments, setTournaments] = useState([])
  // Cambiar el filtro de subdivisión por torneo
  const [filterTournament, setFilterTournament] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  // Cambiar la función fetchData para obtener equipos por torneo
  const fetchData = async () => {
    try {
      setLoading(true)
      const [teamsData, tournamentsData] = await Promise.all([getTeams(), getTournaments()])
      setTeams(teamsData)
      setTournaments(tournamentsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      showToast("Error al cargar los datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeam = () => {
    setEditingTeam(null)
    setShowForm(true)
  }

  const handleEditTeam = (team) => {
    setEditingTeam(team)
    setShowForm(true)
  }

  const handleDeleteTeam = async () => {
    if (!confirmDelete) return

    try {
      await deleteTeam(confirmDelete.id)
      setTeams(teams.filter((team) => team.id !== confirmDelete.id))
      showToast("Equipo eliminado correctamente", "success")
    } catch (error) {
      console.error("Error deleting team:", error)
      showToast("Error al eliminar el equipo", "error")
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleTeamSaved = async (savedTeam) => {
    if (editingTeam) {
     const teamsData =  await getTeams()
      setTeams(teamsData)

      // setTeams(teams.map((t) => (t.id === savedTeam.id ? savedTeam : t)))
    } else {
      // Add new team
      setTeams([...teams, savedTeam])
    }
    
    setShowForm(false)
    showToast(editingTeam ? "Equipo actualizado correctamente" : "Equipo agregado correctamente", "success")
  }

  // Actualizar el filtrado de equipos
  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTournament = filterTournament ? team.tournament_id == filterTournament : true
    return matchesSearch && matchesTournament
  })

  // Actualizar la función para obtener el nombre del torneo
  const getTournamentName = (tournamentId) => {
    const tournament = tournaments.find((t) => t.id === tournamentId)
    return tournament ? tournament.name : "Desconocido"
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <SearchInput
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Actualizar el selector de filtro */}
          <select
            value={filterTournament}
            onChange={(e) => setFilterTournament(e.target.value)}
            className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Todos los torneos</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        <Button variant="primary" onClick={handleAddTeam}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Equipo
        </Button>
      </div>

      <Card title="Equipos" icon={<Users className="h-5 w-5" />}>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equipo
                  </th>
                  {/* Actualizar la tabla para mostrar el torneo en lugar de la subdivisión */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Torneo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Abreviatura
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {team.logo ? (
                            <img
                            src={`${team.logo}?t=${team.logoUpdatedAt}`}
                              alt={team.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">{team.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-medium ml-3">{team.name}</span>
                      </div>
                    </td>
                    {/* Actualizar la celda de la tabla */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span>{team.Tournament?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded">
                        {team.short_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTeam(team)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(team)}>
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
            {searchTerm || filterTournament ? "No se encontraron equipos" : "No hay equipos registrados"}
          </div>
        )}
      </Card>

      {showForm && (
        <TeamForm
          team={editingTeam}
          tournaments={tournaments}
          onClose={() => setShowForm(false)}
          onSave={handleTeamSaved}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Equipo"
          message={`¿Estás seguro de que deseas eliminar el equipo "${confirmDelete.name}"? Esta acción también eliminará todos los partidos asociados.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteTeam}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

export default TeamsAdmin

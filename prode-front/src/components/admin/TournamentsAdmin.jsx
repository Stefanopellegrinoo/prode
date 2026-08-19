import { useState, useEffect } from "react"
import Card from "../ui/Card"
import Button from "../ui/Button"
import { Plus, Edit, Trash2, Trophy } from 'lucide-react'
import { getTournaments, createTournament, updateTournament, deleteTournament } from "../../services/tournamentService"
import { useToast } from "../../hooks/useToast"
import LoadingSpinner from "../ui/LoadingSpinner"
import TournamentForm from "./forms/TournamentForm"
import ConfirmDialog from "../ui/ConfirmDialog"
import SearchInput from "../ui/SearchInput"
import { getSubdivisions } from "../../services/subdivisionService"

const TournamentsAdmin = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTournament, setEditingTournament] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { showToast } = useToast()
  const [subdivisionsOptions, setSubdivisionsOptions] = useState("")

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
       const [subdiv, tournamentsData] = await Promise.all([getSubdivisions(), getTournaments()])
       setSubdivisionsOptions(subdiv)
      setTournaments(tournamentsData)
    } catch (error) {
      console.error("Error fetching tournaments:", error)
      showToast("Error al cargar los torneos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTournament = () => {
    setEditingTournament(null)
    setShowForm(true)
  }

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament)
    setShowForm(true)
  }

  const handleDeleteTournament = async () => {
    if (!confirmDelete) return

    try {
      await deleteTournament(confirmDelete.id)
      setTournaments(tournaments.filter((tournament) => tournament.id !== confirmDelete.id))
      showToast("Torneo eliminado correctamente", "success")
    } catch (error) {
      console.error("Error deleting tournament:", error)
      showToast("Error al eliminar el torneo", "error")
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleTournamentSaved = (savedTournament) => {
    if (editingTournament) {
      // Update existing tournament
      setTournaments(tournaments.map((t) => (t.id === savedTournament.id ? savedTournament : t)))
    } else {
      // Add new tournament
      setTournaments([...tournaments, savedTournament])
    }
    setShowForm(false)
    showToast(
      editingTournament ? "Torneo actualizado correctamente" : "Torneo agregado correctamente",
      "success"
    )
  }

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchInput
          placeholder="Buscar torneos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button variant="primary" onClick={handleAddTournament}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Torneo
        </Button>
      </div>

      <Card title="Torneos" icon={<Trophy className="h-5 w-5" />}>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Temporada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subdivisiones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{tournament.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {tournament.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{tournament.season || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {tournament?.Subdivisions?.length || 0} subdivisiones
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTournament(tournament)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(tournament)}>
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
            {searchTerm ? "No se encontraron torneos" : "No hay torneos registrados"}
          </div>
        )}
      </Card>

      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          subdivisionsOptions={subdivisionsOptions}
          onClose={() => setShowForm(false)}
          onSave={handleTournamentSaved}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Torneo"
          message={`¿Estás seguro de que deseas eliminar el torneo "${confirmDelete.name}"? Esta acción también eliminará todas las subdivisiones, equipos y partidos asociados.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteTournament}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

export default TournamentsAdmin

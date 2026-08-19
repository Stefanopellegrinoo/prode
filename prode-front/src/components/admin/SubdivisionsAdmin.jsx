import { useState, useEffect } from "react"
import Card from "../ui/Card"
import Button from "../ui/Button"
import { Plus, Edit, Trash2, Layers, Users } from "lucide-react"
import { getSubdivisions, deleteSubdivision } from "../../services/subdivisionService"
import { useToast } from "../../hooks/useToast"
import LoadingSpinner from "../ui/LoadingSpinner"
import SubdivisionForm from "./forms/SubdivisionForm"
import ConfirmDialog from "../ui/ConfirmDialog"
import SearchInput from "../ui/SearchInput"

import { getTournaments } from "../../services/tournamentService"

const SubdivisionsAdmin = () => {
  const [subdivisions, setSubdivisions] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubdivision, setEditingSubdivision] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTournament, setFilterTournament] = useState("")
  const { showToast } = useToast()
  const [tournament, setTeournament] = useState([])
  // Cambiar el filtro de torneo por equipo
  const [filterTeam, setFilterTeam] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  // Cambiar la función fetchData para obtener subdivisiones por equipo
  const fetchData = async () => {
    try {
      setLoading(true)
      const [subdivisionsData, tournamentData] = await Promise.all([getSubdivisions(), getTournaments()])
      setSubdivisions(subdivisionsData)
      setTeournament(tournamentData)
    } catch (error) {
      console.error("Error fetching data:", error)
      showToast("Error al cargar los datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubdivision = () => {
    setEditingSubdivision(null)
    setShowForm(true)
  }

  const handleEditSubdivision = (subdivision) => {
    setEditingSubdivision(subdivision)
    setShowForm(true)
  }

  const handleDeleteSubdivision = async () => {
    if (!confirmDelete) return

    try {
      await deleteSubdivision(confirmDelete.id)
      setSubdivisions(subdivisions.filter((subdivision) => subdivision.id !== confirmDelete.id))
      showToast("Subdivisión eliminada correctamente", "success")
    } catch (error) {
      console.error("Error deleting subdivision:", error)
      showToast("Error al eliminar la subdivisión", "error")
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleSubdivisionSaved = (savedSubdivision) => {
    if (editingSubdivision) {
      // Update existing subdivision
      setSubdivisions(subdivisions.map((s) => (s.id === savedSubdivision.id ? savedSubdivision : s)))
    } else {
      // Add new subdivision
      setSubdivisions([...subdivisions, savedSubdivision])
    }
    setShowForm(false)
    showToast(
      editingSubdivision ? "Subdivisión actualizada correctamente" : "Subdivisión agregada correctamente",
      "success",
    )
  }

  // Actualizar el filtrado de subdivisiones
  const filteredSubdivisions = subdivisions.filter((subdivision) => {
    const matchesSearch = subdivision.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = filterTeam ? subdivision.teamId === filterTeam : true
    return matchesSearch && matchesTeam
  })

  // Actualizar la función para obtener el nombre del equipo
  const getTeamName = (tournamentId) => {
    console.log("tournamentId", tournament, tournamentId.tournamentId)
    const t = tournament.find((t) => t.id == tournamentId.tournamentId)
    console.log(t)
    return t ? t.name : "Desconocido"
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <SearchInput
            placeholder="Buscar subdivisiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <Button variant="primary" onClick={handleAddSubdivision}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Subdivisión
        </Button>
      </div>

      <Card title="Subdivisiones" icon={<Layers className="h-5 w-5" />}>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredSubdivisions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubdivisions.map((subdivision) => (
                  <tr key={subdivision.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                          <Layers className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{subdivision.name}</span>
                      </div>
                    </td>
                    {/* Actualizar la celda de la tabla */}
      

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEditSubdivision(subdivision)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(subdivision)}>
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
            {searchTerm || filterTeam ? "No se encontraron subdivisiones" : "No hay subdivisiones registradas"}
          </div>
        )}
      </Card>

      {showForm && (
        <SubdivisionForm
          subdivision={editingSubdivision}
          tournaments={tournament}
          onClose={() => setShowForm(false)}
          onSave={handleSubdivisionSaved}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Subdivisión"
          message={`¿Estás seguro de que deseas eliminar la subdivisión "${confirmDelete.name}"? Esta acción también eliminará todos los equipos y partidos asociados.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteSubdivision}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

export default SubdivisionsAdmin

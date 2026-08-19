import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import Button from "../../ui/Button"
import InputField from "../../form/InputField"
// import { generateFixture } from "../../../services/fixtureService"
import { getTeams } from "../../../services/teamService"
import { getSubdivisionsByTeam } from "../../../services/subdivisionService"
import { useToast } from "../../../hooks/useToast"
import LoadingSpinner from "../../ui/LoadingSpinner"

const FixtureGeneratorForm = ({ onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    teamId: "",
    subdivisionId: "",
    startDate: new Date().toISOString().slice(0, 10),
    stadium: "",
    roundTrip: true,
    daysBetweenMatches: 7,
  })
  const [teams, setTeams] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [subdivisionsLoading, setSubdivisionsLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (formData.teamId) {
      fetchSubdivisions(formData.teamId)
    } else {
      setSubdivisions([])
    }
  }, [formData.teamId])

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true)
      const teamsData = await getTeams()
      setTeams(teamsData)
    } catch (error) {
      console.error("Error fetching teams:", error)
      showToast("Error al cargar los equipos", "error")
    } finally {
      setTeamsLoading(false)
    }
  }

  const fetchSubdivisions = async (teamId) => {
    try {
      setSubdivisionsLoading(true)
      const subdivisionsData = await getSubdivisionsByTeam(teamId)
      setSubdivisions(subdivisionsData)
    } catch (error) {
      console.error("Error fetching subdivisions:", error)
      showToast("Error al cargar las subdivisiones", "error")
    } finally {
      setSubdivisionsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.teamId) {
      newErrors.teamId = "El equipo es requerido"
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida"
    }

    if (!formData.stadium) {
      newErrors.stadium = "El estadio es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      const fixtureData = {
        ...formData,
        daysBetweenMatches: Number.parseInt(formData.daysBetweenMatches, 10),
      }

    //   const generatedMatches = await generateFixture(fixtureData)
    //   onGenerate(generatedMatches)
    } catch (error) {
      console.error("Error generating fixture:", error)
      showToast(error.message || "Error al generar el fixture", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">Generar Fixture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipo <span className="text-red-500">*</span>
              </label>
              {teamsLoading ? (
                <div className="flex justify-center py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.teamId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    required
                  >
                    <option value="">Seleccionar equipo</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.teamId && <p className="text-red-600 text-xs mt-1">{errors.teamId}</p>}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subdivisión</label>
              {subdivisionsLoading ? (
                <div className="flex justify-center py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <select
                  name="subdivisionId"
                  value={formData.subdivisionId}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  disabled={!formData.teamId || subdivisions.length === 0}
                >
                  <option value="">Principal (sin subdivisión)</option>
                  {subdivisions.map((subdivision) => (
                    <option key={subdivision.id} value={subdivision.id}>
                      {subdivision.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.startDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                required
              />
              {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <InputField
              label="Estadio por defecto"
              name="stadium"
              value={formData.stadium}
              onChange={handleChange}
              error={errors.stadium}
              placeholder="Ej: Estadio Municipal"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Días entre fechas
              </label>
              <input
                type="number"
                name="daysBetweenMatches"
                value={formData.daysBetweenMatches}
                onChange={handleChange}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="roundTrip"
                name="roundTrip"
                checked={formData.roundTrip}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600"
              />
              <label htmlFor="roundTrip" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Generar fixture de ida y vuelta
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Generar Fixture
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

FixtureGeneratorForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
}

export default FixtureGeneratorForm

import { useState } from "react"
import PropTypes from "prop-types"
import { X } from 'lucide-react'
import Button from "../ui/Button"
import InputField from "../form/InputField"
import { createGroup } from "../../services/groupService"

const CreateGroupModal = ({ onClose, onGroupCreated, tournaments }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tournaments: [],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name == 'tournaments') {
      const selectedTournaments = formData.tournaments.includes(value)
      ? formData.tournaments.filter((t) => t !== value)
      : [...formData.tournaments, value]
      setFormData({ ...formData, tournaments: selectedTournaments })
    }
    
    console.log( name, value,formData )
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del grupo es requerido"
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    // if (!formData.description.trim()) {
    //   newErrors.description = "La descripción es requerida"
    // }

    if (!formData.tournaments.length) {
      newErrors.tournament = "Selecciona al menos un torneo";
    }
    setErrors(newErrors)
  
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      console.log("Creating group with data:", formData)
      const newGroup = await createGroup(formData)
      onGroupCreated(newGroup)
    } catch (error) {
      console.error("Error creating group:", error)
      setErrors({
        submit: error.message || "Error al crear el grupo",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">Crear Nuevo Grupo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <InputField
              label="Nombre del Grupo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ej: Amigos del Rugby"
              required
            />

            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción 
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Premio para el ganador del grupo"
                rows="3"
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="torneos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Torneos para el grupo <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center ">
                {tournaments?.map((tournament) => (
                  <div key={tournament.id} className="flex items-center m-2">
                    <input
                      type="checkbox"
                      id={`tournament-${tournament.id}`}
                      name="tournaments"
                      value={tournament.id}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor={`tournament-${tournament.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                      {tournament.name}
                    </label>
                  </div>
                ))}
              </div>
              {errors.tournament && <p className="text-red-600 text-xs mt-1">{errors.tournament}</p>}
            </div>
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Crear Grupo
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

CreateGroupModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGroupCreated: PropTypes.func.isRequired,
}

export default CreateGroupModal


"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import Button from "../../ui/Button"
import InputField from "../../form/InputField"
import { createSubdivision, updateSubdivision } from "../../../services/subdivisionService"
import { useToast } from "../../../hooks/useToast"

// Cambiar la prop de torneos por equipos
const SubdivisionForm = ({ subdivision, tournaments, onClose, onSave }) => {
  // Actualizar el estado inicial
  const [formData, setFormData] = useState({
    name: subdivision?.name || "",
    description: subdivision?.description || "",
    torneoId: subdivision?.torneoId || (tournaments?.length > 0 ? tournaments[0]?.id : ""),
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // Actualizar la validación
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la subdivisión es requerido"
    }

    // if (!formData.torneoId) {
    //   newErrors.torneoId = "El equipo es requerido"
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      let savedSubdivision
      console.log(savedSubdivision)
      if (subdivision) {
        savedSubdivision = await updateSubdivision(subdivision.id, formData)
      } else {
        savedSubdivision = await createSubdivision(formData)
      }

      onSave(savedSubdivision)
    } catch (error) {
      console.error("Error saving subdivision:", error)
      showToast(error.message || "Error al guardar la subdivisión", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">{subdivision ? "Editar Subdivisión" : "Agregar Subdivisión"}</h2>
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
              label="Nombre de la Subdivisión"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ej: Primera"
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
                placeholder="Descripción de la subdivisión"
                rows="3"
                className="block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {subdivision ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

SubdivisionForm.propTypes = {
  subdivision: PropTypes.object,
  torneo: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default SubdivisionForm

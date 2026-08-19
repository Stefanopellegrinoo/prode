"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { X, Upload } from "lucide-react"
import Button from "../../ui/Button"
import InputField from "../../form/InputField"
import { createTeam, updateTeam, uploadTeamLogo } from "../../../services/teamService"
import { useToast } from "../../../hooks/useToast"
import UploadTeamLogo from "./UploadTeamLogo"

// Cambiar la prop de subdivisiones por torneos
const TeamForm = ({ team, tournaments, onClose, onSave }) => {
  // Actualizar el estado inicial
  const [formData, setFormData] = useState({
    name: team?.name || "",
    shortName: team?.short_name || "",
    city: team?.city || "",
    logo: team?.logo || "",
    tournamentId: team?.tournament_id || (tournaments?.length > 0 ? tournaments[0]?.id : ""),
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(team?.logo || "")
  const { showToast } = useToast()
  const [file, setFile] = useState(null); // NUEVO: guardar el archivo subido
console.log("file",team)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For this example, we'll just use a FileReader to create a preview
      // In a real app, you would upload the file to a server and get a URL
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result)
        setFormData({ ...formData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Actualizar la validación
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del equipo es requerido"
    }

    if (!formData.tournamentId) {
      newErrors.tournamentId = "El torneo es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setLoading(true);
  
      let savedTeam;
      if (team) {
        savedTeam = await updateTeam(team.id, formData);
      } else {
        savedTeam = await createTeam(formData);
      }
  
      // ⚡ Si subió un logo nuevo, lo subimos
      if (file) {
        const formDataLogo = new FormData();
        formDataLogo.append("file", file);
        

  
        await uploadTeamLogo(savedTeam.id, formDataLogo);
      }
  
      showToast("Equipo actualizado correctamente", "success");
      onSave(savedTeam);
    } catch (error) {
      console.error("Error saving team:", error);
      showToast(error.message || "Error al guardar el equipo", "error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">{team ? "Editar Equipo" : "Agregar Equipo"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Actualizar el selector de torneos */}
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
                required
              >
                <option value="">Seleccionar torneo</option>
                {tournaments?.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
              {errors.tournamentId && <p className="text-red-600 text-xs mt-1">{errors.tournamentId}</p>}
            </div>

            <InputField
              label="Nombre del Equipo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ej: Club Atlético San Isidro"
              required
            />

            <InputField
              label="Abreviatura"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              error={errors.shortName}
              placeholder="Ej: CASI"
            />

            <InputField
              label="Ciudad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder="Ej: Buenos Aires"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo del Equipo</label>

            </div>
            <UploadTeamLogo team={team} file={file} setFile={setFile} />

          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {team ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

TeamForm.propTypes = {
  team: PropTypes.object,
  tournaments: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default TeamForm

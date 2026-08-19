import { useState } from "react"
import PropTypes from "prop-types"
import { X, Upload, FileText, AlertCircle } from 'lucide-react'
import Button from "../../ui/Button"
import { importFixtureFromCSV } from "../../../services/fixtureService"
import { useToast } from "../../../hooks/useToast"

const ImportFixtureForm = ({ subdivisions, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState(subdivisions.length > 0 ? subdivisions[0].id : "")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "text/csv") {
        setErrors({ file: "El archivo debe ser de tipo CSV" })
        return
      }
      setSelectedFile(file)
      setErrors({})
    }
  }

  const handleSubdivisionChange = (e) => {
    setSelectedSubdivision(e.target.value)
    if (errors.subdivision) {
      setErrors({ ...errors, subdivision: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedSubdivision) {
      newErrors.subdivision = "La subdivisión es requerida"
    }

    if (!selectedFile) {
      newErrors.file = "El archivo CSV es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      const importedMatches = await importFixtureFromCSV(selectedSubdivision, selectedFile)
      onImport(importedMatches)
      showToast(`Se importaron ${importedMatches.length} partidos correctamente`, "success")
    } catch (error) {
      console.error("Error importing fixture:", error)
      showToast(error.message || "Error al importar el fixture", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">Importar Fixture desde CSV</h2>
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
                Subdivisión <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubdivision}
                onChange={handleSubdivisionChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.subdivision
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
                required
              >
                <option value="">Seleccionar subdivisión</option>
                {subdivisions.map((subdivision) => (
                  <option key={subdivision.id} value={subdivision.id}>
                    {subdivision.name}
                  </option>
                ))}
              </select>
              {errors.subdivision && <p className="text-red-600 text-xs mt-1">{errors.subdivision}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Archivo CSV <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600">
                <div className="space-y-1 text-center">
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <span>Subir un archivo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".csv"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">CSV hasta 10MB</p>
                    </>
                  )}
                </div>
              </div>
              {errors.file && <p className="text-red-600 text-xs mt-1">{errors.file}</p>}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Formato del CSV</h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                    <p>
                      El archivo CSV debe tener las siguientes columnas: fecha, hora, equipo_local, equipo_visitante,
                      estadio, ronda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Importar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

ImportFixtureForm.propTypes = {
  subdivisions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
}

export default ImportFixtureForm


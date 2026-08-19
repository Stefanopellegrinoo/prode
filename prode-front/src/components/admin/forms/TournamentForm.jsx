import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import InputField from "../../form/InputField";
import { createTournament, updateTournament } from "../../../services/tournamentService";
import { useToast } from "../../../hooks/useToast";

const TournamentForm = ({ tournament, subdivisionsOptions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    description: tournament?.description || "",
    season: tournament?.season || new Date().getFullYear().toString(),
    subdivisionIds: tournament?.Subdivisions || [] // Nuevo campo para subdivisiones
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
console.log(formData, subdivisionsOptions)

useEffect(() => {
  if (tournament) {
    setFormData({
      name: tournament.name,
      description: tournament.description,
      season: tournament.season,
      subdivisionIds: tournament.Subdivisions?.map(s => s.id) || []
    });
  }
}, [tournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const numericValue = Number(value);
    const currentSubdivisions = formData.subdivisionIds || [];
  
    if (checked) {
      setFormData({
        ...formData,
        subdivisionIds: [...currentSubdivisions, numericValue]
      });
    } else {
      setFormData({
        ...formData,
        subdivisionIds: currentSubdivisions.filter((option) => option !== numericValue)
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    console.log(formData)
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del torneo es requerido";
    }

    if (!formData.season.trim()) {
      newErrors.season = "La temporada es requerida";
    }

    // (Opcional) Validar que al menos se haya seleccionado una subdivisión
    if (!formData.subdivisionIds.length) {
      newErrors.subdivisionIds = "Selecciona al menos una subdivisión";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);   
      let savedTournament;
      if (tournament) {
        console.log(tournament.id, formData)
        savedTournament = await updateTournament(tournament.id, formData);
      } else {
        savedTournament = await createTournament(formData);
      }
      onSave(savedTournament);
    } catch (error) {
      console.error("Error saving tournament:", error);
      showToast(error.message || "Error al guardar el torneo", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">
            {tournament ? "Editar Torneo" : "Agregar Torneo"}
          </h2>
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
              label="Nombre del Torneo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ej: Top 12"
              required
            />

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del torneo"
                rows="3"
                className="block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <InputField
              label="Temporada"
              name="season"
              value={formData.season}
              onChange={handleChange}
              error={errors.season}
              placeholder="Ej: 2023"
              required
            />

            {/* Nueva Sección: Subdivisiones Permitidas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subdivisiones Permitidas
              </label>
              <div className="mt-2 flex flex-wrap gap-4">
                {subdivisionsOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option.id}
                      onChange={handleCheckboxChange}
                      checked={formData?.subdivisionIds?.includes(option.id)}
                      className="form-checkbox h-4 w-4 text-primary"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{option.name}</span>
                  </label>
                ))}
              </div>
              {errors.subdivisionIds && (
                <p className="mt-1 text-sm text-red-500">{errors.subdivisionIds}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {tournament ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

TournamentForm.propTypes = {
  tournament: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TournamentForm;

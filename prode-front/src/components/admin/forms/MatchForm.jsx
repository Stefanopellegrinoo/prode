import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import InputField from "../../form/InputField";
import { createMatch, updateMatch } from "../../../services/matchService";
import { useToast } from "../../../hooks/useToast";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { getTeamsByTournament } from "../../../services/teamService";
import { getSubdivisionsByTeam } from "../../../services/subdivisionService";

const MatchForm = ({ match, tournamentId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // subdivisionId: match?.subdivisionId || (subdivisions.length > 0 ? subdivisions[0].id : ""),
    id: match?.id || "",
    home_team_id: match?.homeTeam?.id || "0",
    away_team_id: match?.awayTeam?.id || "0",
    date: match?.date || "",
    status: match?.status || "upcoming",
    home_score: match?.home_score || 0,
    away_score: match?.away_score || 0,
    round: match?.round || 1,
    tournament_id: tournamentId,
  });
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const { showToast } = useToast();
  const [winner, setWinner] = useState((match?.userPrediction?.result || match.result) ?? "");
  // Actualizar para reflejar la nueva estructura
  const [homeTeamSubdivisions, setHomeTeamSubdivisions] = useState([]);
  const [awayTeamSubdivisions, setAwayTeamSubdivisions] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const teamsData = await getTeamsByTournament(tournamentId);

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      showToast("Error al cargar los equipos", "error");
    } finally {
      setTeamsLoading(false);
    }
  };

  const fetchTeamSubdivisions = async (teamId, type) => {
    try {
      const subdivisionsData = await getSubdivisionsByTeam(teamId);
      if (type === "home") {
        setHomeTeamSubdivisions(subdivisionsData);
      } else {
        setAwayTeamSubdivisions(subdivisionsData);
      }
    } catch (error) {
      console.error(`Error fetching ${type} team subdivisions:`, error);
      showToast(
        `Error al cargar las subdivisiones del equipo ${
          type === "home" ? "local" : "visitante"
        }`,
        "error"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.home_team_id) {
      newErrors.home_team_id = "El equipo local es requerido";
    }

    if (!formData.away_team_id) {
      newErrors.away_team_id = "El equipo visitante es requerido";
    }

    if (formData.home_team_id === formData.away_team_id) {
      newErrors.away_team_id =
        "El equipo visitante debe ser diferente al local";
    }

    if (!formData.date) {
      newErrors.date = "La fecha y hora son requeridas";
    }

    if (formData.status === "finished" || formData.status === "live") {
      // if (formData.home_score < 0) {
      //   newErrors.home_score = "El resultado debe ser un número positivo";
      // }
      // if (formData.away_score < 0) {
      //   newErrors.away_score = "El resultado debe ser un número positivo";
      // }
      if(!winner) {
      
        newErrors.winner = "El resultado es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare data for API
      const matchData = {
        ...formData,
        result: winner || null,
        home_score: Number.parseInt(formData.home_score, 10),
        away_score: Number.parseInt(formData.away_score, 10),
        round: Number.parseInt(formData.round, 10),
      };
      console.log(tournamentId, matchData);
      let savedMatch;
      if (match) {
        savedMatch = await updateMatch(tournamentId, matchData);
        console.log(savedMatch, winner)
      } else {
        savedMatch = await createMatch(tournamentId, matchData);
      }

      onSave(savedMatch);
    } catch (error) {
      // showToast( "Error al guardar el partido")
      console.log("Error saving match:", error);
      const newErrors = {};
      newErrors.mensa = "Error al guardar el partido";

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">
            {match ? "Editar Partido" : "Agregar Partido"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipo Local <span className="text-red-500">*</span>
              </label>
              {teamsLoading ? (
                <div className="flex justify-center py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <select
                    name="home_team_id"
                    value={formData.home_team_id}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.home_team_id
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    required
                  >
                    <option value="">Seleccionar equipo local</option>
                    {teams.map((team) => (
                      <option
                        disabled={formData.status == "finished"}
                        key={team.id}
                        value={team.id}
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.home_team_id && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.home_team_id}
                    </p>
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipo Visitante <span className="text-red-500">*</span>
              </label>
              {teamsLoading ? (
                <div className="flex justify-center py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <select
                    name="away_team_id"
                    value={formData.away_team_id}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.away_team_id
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    required
                  >
                    <option value="">Seleccionar equipo visitante</option>
                    {teams.map((team) => (
                      <option
                        disabled={formData.status == "finished"}
                        key={team.id}
                        value={team.id}
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {errors.away_team_id && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.away_team_id}
                    </p>
                  )}
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formatDate(formData.date)}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-xs mt-1">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="upcoming">Próximo</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>

            {formData.status === "finished" && (
              <>
                <label>
                  <input
                    type="radio"
                    name="winner"
                    value="home"
                    checked={winner === "home"}
                    onChange={(e) => setWinner(e.target.value)}
                  />{" "}
                  Gana {match?.homeTeam?.name}
                </label>
                <label>
                  <input
                    type="radio"
                    name="winner"
                    value="away"
                    checked={winner === "away"}
                    onChange={(e) => setWinner(e.target.value)}
                  />{" "}
                  Gana {match?.awayTeam?.name}
                </label>
                {errors.winner && (
              <p className="text-red-600 text-xs mt-1">{errors.winner}</p>
            )}
                {/* <label>
            <input
              type="radio"
              name="winner"
              value="draw"
              checked={predictedWinner === "draw"}
              onChange={(e) => setPredictedWinner(e.target.value)}
              disabled={locked}
            />{" "}
            Empate
          </label> */}

                {/* <div>
                  <InputField
                    label="Puntos Equipo Local"
                    name="home_score"
                    type="number"
                    min="0"
                    value={formData.home_score}
                    onChange={handleChange}
                    error={errors.homeScore}
                  />
                </div>

                <div>
                  <InputField
                    label="Puntos Equipo Visitante"
                    name="away_score"
                    type="number"
                    min="0"
                    value={formData.away_score}
                    onChange={handleChange}
                    error={errors.away_score}
                  />
                </div> */}
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {errors.mensa && (
              <p className="text-red-600 text-xs mt-1">{errors.mensa}</p>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {match ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

MatchForm.propTypes = {
  match: PropTypes.object,
  subdivisions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default MatchForm;

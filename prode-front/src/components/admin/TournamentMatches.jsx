// src/pages/admin/TournamentMatches.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TournamentMatches = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/api/fixtures/tournament/${tournamentId}`);
        setMatches(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar los partidos");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentId]);

  const handleEdit = (matchId) => {
    navigate(`/admin/matches/${tournamentId}/${matchId}/edit`);
  };

  if (loading) return <div>Cargando partidos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!matches.length) {
    return (
      <div className="bg-gray-700 p-4 rounded text-gray-300">
        No hay partidos registrados para este torneo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fixture del torneo #{tournamentId}</h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Equipo Local</th>
            <th className="py-2 px-4 border">Equipo Visitante</th>
            <th className="py-2 px-4 border">Fecha</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id}>
              <td className="py-2 px-4 border">{m.id}</td>
              <td className="py-2 px-4 border">{m.teamAId}</td>
              <td className="py-2 px-4 border">{m.teamBId}</td>
              <td className="py-2 px-4 border">{new Date(m.date).toLocaleString()}</td>
              <td className="py-2 px-4 border">
                <button
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => handleEdit(m.id)}
                >
                  Editar
                </button>
                {/* Podrías agregar un botón para eliminar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentMatches;

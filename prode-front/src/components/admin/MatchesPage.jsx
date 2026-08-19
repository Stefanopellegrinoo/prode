// src/pages/admin/MatchesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournaments } from "../../services/tournamentService"; // Asegúrate de exportar correctamente tu función en el servicio
import Card from "../ui/Card";
import { Edit, Layers, Trash2 } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const MatchesPage = ({ type }) => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await getTournaments();
        setTournaments(res);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar torneos");
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const handleEditFixture = (tournamentId) => {
    navigate(`/match/${tournamentId}`);
  };

  const viewRanking = (tournamentId) => {
    navigate(`/ranking/${tournamentId}`);
  };

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="text-red-500">{error}</div>;


  return (
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold mb-4">Gestión de Fixtures</h1>

    //   <div className="mb-4 flex items-center">
    //     <input
    //       type="text"
    //       placeholder="Buscar torneos..."
    //       value={searchTerm}
    //       onChange={(e) => setSearchTerm(e.target.value)}
    //       className="px-3 py-2 border rounded mr-4"
    //     />
    //   </div>

    //   <div className="overflow-x-auto">
    //     <table className="min-w-full border bg-white dark:bg-gray-800">
    //       <thead>
    //         <tr>
    //           <th className="py-2 px-4 border">Nombre del Torneo</th>
    //           <th className="py-2 px-4 border">Descripción</th>
    //           <th className="py-2 px-4 border">Acciones</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {filteredTournaments.map((tournament) => (
    //           <tr
    //             key={tournament.id}
    //             className="hover:bg-gray-100 dark:hover:bg-gray-700"
    //           >
    //             <td className="py-2 px-4 border">{tournament.name}</td>
    //             <td className="py-2 px-4 border">{tournament.description}</td>
    //             <td className="py-2 px-4 border">
    //               <button
    //                 onClick={() => handleEditFixture(tournament.id)}
    //                 className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    //               >
    //                 Editar Fixture
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //         {filteredTournaments.length === 0 && (
    //           <tr>
    //             <td colSpan="4" className="py-2 px-4 text-center">
    //               No se encontraron torneos.
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    <Card title={type !== "pronostico" ? "Fixture" : "Ranking"}  icon={<Layers className="h-5 w-5" />}>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : filteredTournaments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nombre de los torneos
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descripcion
                </th> */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fixture
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTournaments.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{t.description}</span>
                    </div>
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {type !== "pronostico" ? (
                      <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEditFixture(t.id)}
                      >
                        <span className="mr-2">Fixtures </span>
                        <Edit className="h-4 w-4" />
                      </Button>     
                      {/* No se deberia eliminar el fixture sino el torneo */}
                      {/* {isAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        //    onClick={() => setConfirmDelete(subdivision)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>    
                    )} */}
                    </>
                    ) : (
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => viewRanking(t.id)}
                      >
                        <span className="mr-2">Ranking </span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    
     
                
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm || "No se encontraron subdivisiones"}
        </div>
      )}
    </Card>
  );
};

export default MatchesPage;

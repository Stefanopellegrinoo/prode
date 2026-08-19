import { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import { Trophy, Search, Users } from "lucide-react";
import { getTournamentRanking } from "../services/rankingService";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs"; // Ajusta la importación a tus componentes de Tabs
import { useParams } from "react-router-dom";
import { getTournamentById } from "../services/tournamentService";

const Ranking = () => {
  const { id } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastContainer } = useToast();
  const [subdivisions, setSubdivisions] = useState([]);
  const [fixtures, setFixtures] = useState({});
  const [activeTab, setActiveTab] = useState("");

  const fetchRanking = async (activeT) => {
    try {
      setLoading(true);
    
      const data = await getTournamentRanking(id, activeT);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching ranking:", error);
      showToast("Error al cargar el ranking", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await getTournamentById(id);
        setSubdivisions(response.Subdivisions);
        fetchRanking(response.Subdivisions[0]?.id);
        setActiveTab(response.Subdivisions[0]?.id || ""); // Establece la primera subdivisión como activa por defecto
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        showToast("Error al cargar los torneos", "error");
      }
    };

    fetchTournaments();
  }, [showToast]);
  useEffect(() => {
    if (activeTab && id) {
      fetchRanking(activeTab); // tu función para traer los datos
    }
  }, [activeTab, id]);

  // .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredUsers = users
    ?.map((u) => u)
    .filter((user) => {
      const userName = user.User.name.toLowerCase();
      return userName.includes(searchTerm.toLowerCase());
    });

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">


        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      {subdivisions?.length === 0 ? (
        <EmptyState
          title="No hay subdivisiones"
          description="Este torneo no tiene subdivisiones configuradas."
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full overflow-x-auto flex-nowrap">
            {subdivisions?.map((subdivision) => (
              <TabsTrigger key={subdivision.id} value={subdivision.id}>
                {subdivision.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {subdivisions?.map((sub) => {
            return (
              <TabsContent key={sub.id} value={sub.id} className="space-y-8">
                <Card title="Ranking" icon={<Trophy className="h-5 w-5" />}>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Posición
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Puntos
                            </th>
            
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUsers.map((user, index) => (
                            <tr
                              key={user.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span
                                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                                      index === 0
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : index === 1
                                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                        : index === 2
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                                    {user.userName.charAt(0)}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium">
                                      {user.User?.username}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold">
                                  {user.points}
                                </div>
                              </td>
          
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No se encontraron usuarios"
                        : "No hay usuarios en el ranking"}
                    </div>
                  )}
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      <ToastContainer />
    </DashboardLayout>
  );
};

export default Ranking;

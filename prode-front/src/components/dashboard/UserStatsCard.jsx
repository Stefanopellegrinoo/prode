import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Award } from "lucide-react";
import Card from "../ui/Card";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs"; // Ajusta la importación a tus componentes de Tabs

const UserStatsCard = ({ stats, loading }) => {
  // console.log("UserStatsCard stats:", stats[0]?.subdivisions[0]?.stats );
  const [activeTab, setActiveTab] = useState(stats[0]?.id || "");
  const [activeTabSubdivisions, setActiveTabSubdivisions] = useState(
    stats[0]?.subdivisions[0].id || ""
  );

  const [subdivisions, setSubdivisions] = useState([]);
  const [tournaments, setTournaments] = useState(stats || []);
  const [userStats, setUserStats] = useState(stats[0]?.subdivisions[0].stats);

// Cuando cambia el torneo, reiniciamos la subdivisión al primero
useEffect(() => {
  const tournament = tournaments.find((t) => t.id === activeTab);
  const firstSub = tournament?.subdivisions[0];

  if (firstSub) {
    setActiveTabSubdivisions(firstSub.id);
    setUserStats(firstSub.stats);
  }
}, [activeTab, tournaments]);

// Cuando cambia la subdivisión dentro del torneo activo
useEffect(() => {
  const tournament = tournaments.find((t) => t.id === activeTab);
  const subdivision = tournament?.subdivisions.find((s) => s.id === activeTabSubdivisions);

  if (subdivision) {
    setUserStats(subdivision.stats);
  }
}, [activeTabSubdivisions, activeTab, tournaments]);

  return (
    <Card title="Mis Estadísticas" icon={<Award className="h-5 w-5" />}>
       
    {loading ? (
      <div className="">
        <LoadingSpinner />
      </div>
    ) : tournaments.length > 0 ? (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2 w-full overflow-x-auto flex-nowrap">
          {tournaments.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.name}
            </TabsTrigger>
          ))}
        </TabsList>
  
        <Tabs value={activeTabSubdivisions} onValueChange={setActiveTabSubdivisions} className="w-full">
          <TabsList className="w-full overflow-x-auto flex-nowrap">
            {tournaments.find((t) => t.id === activeTab)?.subdivisions.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
  
        {tournaments.map((sub) => (
          <TabsContent key={sub.id} value={sub.id} className="space-y-8">
            {userStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Puntos Totales</span>
                  <span className="font-bold text-lg">{userStats.totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronósticos Realizados</span>
                  <span className="font-bold text-lg">{userStats.totalPredictions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronósticos Acertados</span>
                  <span className="font-bold text-lg">{userStats.correctPredictions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Precisión</span>
                  <span className="font-bold text-lg">{userStats.accuracy}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay estadísticas disponibles
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    ) : (
      <EmptyState
        title="No hay estadísticas disponibles"
        description="Parece que no tienes estadísticas para mostrar en este momento."
      />
    )}
  </Card>
  
  );
};

UserStatsCard.propTypes = {
  stats: PropTypes.shape({
    totalPoints: PropTypes.number,
    globalRank: PropTypes.number,
    totalPredictions: PropTypes.number,
    correctPredictions: PropTypes.number,
    accuracy: PropTypes.number,
  }),
  loading: PropTypes.bool.isRequired,
};

export default UserStatsCard;

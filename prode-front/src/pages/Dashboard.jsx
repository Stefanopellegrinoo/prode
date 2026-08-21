import { useState, useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout";
import TeamPlate from "../components/fixture/TeamPlate";
import DrawBar from "../components/fixture/DrawBar";
import StatusBadge from "../components/fixture/StatusBadge";
import { getUpcomingMatches } from "../services/matchService";
import { getUserStats } from "../services/userService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Dashboard = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [matchesData, statsData] = await Promise.all([
          getUpcomingMatches(),
          getUserStats().catch(() => null), // stats might fail if not admin or missing
        ]);
        setUpcomingMatches(matchesData || []);
        setUserStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppLayout showBottomNav={true}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-[22px] pb-[16px] px-4 flex flex-col gap-1 border-b border-prode-border bg-prode-bg">
          <div className="font-display text-[26px] font-[900] uppercase tracking-[-0.01em] leading-none">
            Inicio
          </div>
          <div className="text-[15px] font-[600] text-prode-text-muted">
            URBA Top 12 · Fecha 12
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center pt-10"><LoadingSpinner /></div>
        ) : (
          <div className="px-4 py-[20px] flex flex-col gap-[20px] pb-[120px]">
            {/* Stats */}
            {userStats && (
              <div className="flex gap-[12px]">
                <div className="flex-1 bg-prode-surface border border-prode-border rounded-[10px] p-[16px] flex flex-col gap-[2px]">
                  <div className="text-[12px] font-[800] tracking-[0.08em] uppercase text-prode-text-muted">
                    Posición
                  </div>
                  <div className="font-display text-[26px] font-[900] tabular-nums leading-none mt-1">
                    #{userStats.rankingPosition || "-"}
                  </div>
                </div>
                <div className="flex-1 bg-prode-surface border border-prode-border rounded-[10px] p-[16px] flex flex-col gap-[2px]">
                  <div className="text-[12px] font-[800] tracking-[0.08em] uppercase text-prode-text-muted">
                    Puntos
                  </div>
                  <div className="font-display text-[26px] font-[900] tabular-nums leading-none mt-1">
                    {userStats.totalPoints || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Matches */}
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center justify-between">
                <div className="font-display text-[20px] font-[900] uppercase tracking-[0.01em]">
                  Próximos partidos
                </div>
                <button className="text-[14px] font-[700] text-prode-text-muted hover:text-prode-text transition-colors">
                  Ver fixture →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[16px]">
                {upcomingMatches.length === 0 ? (
                  <div className="text-[14px] font-[600] text-prode-text-muted text-center p-4 col-span-full">
                    No hay próximos partidos.
                  </div>
                ) : (
                  upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-prode-surface border border-prode-border rounded-[12px] overflow-hidden flex flex-col"
                    >
                      <div className="px-4 py-[14px] flex items-center justify-between border-b border-prode-border-divider">
                        <div className="flex items-center gap-[10px]">
                          <div className="font-display text-[15px] font-[900] tabular-nums mt-[1px]">
                            {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="w-[4px] h-[4px] rounded-full bg-prode-border-control"></div>
                          <div className="text-[14px] font-[700] text-prode-text-muted truncate">
                            {match.subdivision?.name || "Primera"}
                          </div>
                        </div>
                        {match.status === "in_progress" ? (
                          <StatusBadge variant="live" />
                        ) : match.status === "finished" ? (
                          <StatusBadge variant="saved" customLabel="Finalizado" />
                        ) : (
                          <StatusBadge variant="unsaved" customLabel="Programado" />
                        )}
                      </div>

                      <div className="p-[8px] flex flex-col sm:flex-row gap-[2px]">
                        <TeamPlate
                          team={{ shortName: (match.homeTeam?.name || "LOC").substring(0,3).toUpperCase(), name: match.homeTeam?.name || "Local" }}
                          isSelected={match.userPrediction?.homeScore > match.userPrediction?.awayScore}
                          isLocked={true}
                        />
                        <DrawBar isSelected={match.userPrediction?.homeScore !== undefined && match.userPrediction?.homeScore === match.userPrediction?.awayScore} isLocked={true} />
                        <TeamPlate
                          team={{ shortName: (match.awayTeam?.name || "VIS").substring(0,3).toUpperCase(), name: match.awayTeam?.name || "Visitante" }}
                          isSelected={match.userPrediction?.awayScore > match.userPrediction?.homeScore}
                          isLocked={true}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;

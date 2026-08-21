import { useState, useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout";
import TeamPlate from "../components/fixture/TeamPlate";
import DrawBar from "../components/fixture/DrawBar";
import StatusBadge from "../components/fixture/StatusBadge";
import { getGroupedFixturePredicts } from "../services/fixtureService";
import { savePrediction } from "../services/predictionService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Predictions = () => {
  const { currentUser } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState("primera");
  
  const [fixtureData, setFixtureData] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [initialPredictions, setInitialPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await getGroupedFixturePredicts(); // Array of grouped matches
        
        // Ensure data is array
        const dataArray = Array.isArray(data) ? data : (data.matches || []);
        
        setFixtureData(dataArray);

        // Initialize predictions from existing data
        const initial = {};
        dataArray.forEach((match) => {
          if (match.userPrediction) {
            initial[match.id] = {
              homeScore: match.userPrediction.homeScore,
              awayScore: match.userPrediction.awayScore,
            };
          }
        });
        setPredictions(initial);
        setInitialPredictions(JSON.parse(JSON.stringify(initial)));
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handlePredictionChange = (matchId, teamType, score) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [teamType]: score,
      }
    }));
  };

  const hasChanges = JSON.stringify(predictions) !== JSON.stringify(initialPredictions);

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      // We iterate and save each one. If the backend supported bulk we would use bulk.
      const promises = Object.keys(predictions).map(matchId => {
        const p = predictions[matchId];
        return savePrediction({
          matchId: parseInt(matchId),
          predictedHomeScore: p.homeScore || 0,
          predictedAwayScore: p.awayScore || 0,
        }, currentUser?.id);
      });

      await Promise.all(promises);
      setInitialPredictions(JSON.parse(JSON.stringify(predictions)));
      showToast("Tus pronósticos se guardaron correctamente.", "success");
    } catch (error) {
      console.error("Error saving predictions:", error);
      showToast("Hubo un error al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Group processing
  const tabsAvailable = [...new Set(fixtureData.map(m => m.subdivision?.name || "Primera"))];
  const displayMatches = fixtureData.filter(m => (m.subdivision?.name || "Primera").toLowerCase() === activeTab.toLowerCase());

  const completedCount = Object.keys(predictions).filter(k => 
    predictions[k]?.homeScore !== undefined && predictions[k]?.awayScore !== undefined
  ).length;
  const totalCount = fixtureData.length;

  return (
    <AppLayout showBottomNav={true}>
      <div className="flex flex-col min-h-screen relative pb-[160px]">
        {/* Header */}
        <div className="pt-[22px] px-4 flex flex-col gap-[14px] border-b border-prode-border bg-prode-bg z-20 sticky top-0">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-display text-[26px] font-[900] uppercase tracking-[-0.01em] leading-none">
                Pronósticos
              </div>
              <div className="text-[15px] font-[600] text-prode-text-muted">
                URBA Top 12 · Fecha 12
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-display text-[24px] font-[900] leading-none tabular-nums text-prode-primary">
                {completedCount}/{totalCount}
              </div>
              <div className="text-[12px] font-[800] uppercase tracking-[0.06em] text-prode-text-muted">
                Completos
              </div>
            </div>
          </div>

          <div className="flex gap-[2px] overflow-x-auto scrollbar-hide -mx-4 px-4 pb-0">
            {(tabsAvailable.length > 0 ? tabsAvailable : ["Primera"]).map((tabName) => {
              const isActive = activeTab.toLowerCase() === tabName.toLowerCase();
              return (
                <button
                  key={tabName}
                  onClick={() => setActiveTab(tabName.toLowerCase())}
                  className={`px-[11px] py-[7px] rounded-t-[5px] text-[13px] cursor-pointer whitespace-nowrap transition-colors ${
                    isActive
                      ? "font-[800] bg-prode-text text-prode-bg"
                      : "font-[600] text-prode-text-muted bg-prode-elevated hover:bg-prode-surface-row"
                  }`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
           <div className="flex justify-center pt-10"><LoadingSpinner /></div>
        ) : (
          <div className="px-4 py-[16px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {displayMatches.length === 0 ? (
              <div className="text-center p-4 text-prode-text-muted text-[14px] font-[600] col-span-full">
                No hay partidos programados para esta división.
              </div>
            ) : (
              displayMatches.map((match) => {
                const p = predictions[match.id] || {};
                const isHomeSelected = p.homeScore > p.awayScore;
                const isAwaySelected = p.awayScore > p.homeScore;
                const isDrawSelected = p.homeScore !== undefined && p.homeScore === p.awayScore;

                return (
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
                          {match.stadium || "Estadio"}
                        </div>
                      </div>
                      <StatusBadge variant="unsaved" customLabel={match.status} />
                    </div>

                    <div className="p-[8px] flex flex-row gap-[2px]">
                      <TeamPlate
                        team={{ shortName: (match.homeTeam?.name || "LOC").substring(0,3).toUpperCase(), name: match.homeTeam?.name || "Local" }}
                        isSelected={isHomeSelected}
                        onClick={() => {
                          handlePredictionChange(match.id, "homeScore", isHomeSelected ? undefined : 1);
                          handlePredictionChange(match.id, "awayScore", isHomeSelected ? undefined : 0);
                        }}
                      />
                      <DrawBar 
                        isSelected={isDrawSelected} 
                        onClick={() => {
                           handlePredictionChange(match.id, "homeScore", isDrawSelected ? undefined : 0);
                           handlePredictionChange(match.id, "awayScore", isDrawSelected ? undefined : 0);
                        }}
                      />
                      <TeamPlate
                        team={{ shortName: (match.awayTeam?.name || "VIS").substring(0,3).toUpperCase(), name: match.awayTeam?.name || "Visitante" }}
                        isSelected={isAwaySelected}
                        onClick={() => {
                          handlePredictionChange(match.id, "homeScore", isAwaySelected ? undefined : 0);
                          handlePredictionChange(match.id, "awayScore", isAwaySelected ? undefined : 1);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Floating Save Action */}
        {hasChanges && (
          <div className="fixed bottom-[88px] md:bottom-0 left-0 right-0 z-30 px-4 pb-4 md:pb-8 bg-gradient-to-t from-prode-bg to-transparent pointer-events-none flex justify-center animate-slide-up">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full max-w-[430px] md:max-w-5xl h-[56px] bg-prode-text text-prode-bg rounded-[8px] flex items-center justify-center font-[800] uppercase tracking-[0.02em] shadow-lg pointer-events-auto hover:opacity-90 transition-opacity"
            >
              {saving ? "Guardando..." : "Guardar pronósticos"}
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </AppLayout>
  );
};

export default Predictions;

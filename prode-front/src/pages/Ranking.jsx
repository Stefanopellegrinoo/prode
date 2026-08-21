import { useState, useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getGlobalRanking } from "../services/rankingService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Ranking = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("primera");
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        // Fallback to global ranking for now since getTournamentRanking requires IDs we don't have
        const data = await getGlobalRanking(); 
        
        // Map backend data to our layout structure
        const mappedRows = (Array.isArray(data) ? data : data.ranking || []).map((r, i) => ({
          id: r.id || r.userId,
          pos: i + 1,
          name: r.User?.name || r.name || "Usuario",
          club: r.User?.username ? `@${r.User.username}` : (r.club || "URBA"),
          pts: r.totalPoints || r.points || 0,
          delta: "—", // Backend doesn't provide delta typically
          me: (r.id === currentUser?.id || r.userId === currentUser?.id),
        }));
        
        setRows(mappedRows);
      } catch (error) {
        console.error("Error fetching ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [currentUser]);

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myRow = rows.find((row) => row.me);

  return (
    <AppLayout showBottomNav={true}>
      <div className="flex flex-col min-h-screen pb-[176px]">
        {/* Header */}
        <div className="pt-[18px] px-4 flex flex-col gap-[14px] border-b border-prode-border">
          <div className="flex items-center justify-between">
            <div className="font-display text-[24px] font-[900] tracking-[-0.01em] uppercase">
              Ranking
            </div>
            <div className="text-[14px] font-[600] text-prode-text-muted">
              Global
            </div>
          </div>
          {/* <div className="flex gap-[2px] overflow-x-auto scrollbar-hide -mx-4 px-4 pb-0">
             Tabs here if needed for tournaments
          </div> */}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <div className="h-[48px] bg-prode-surface border border-prode-border rounded-[6px] flex items-center px-[14px]">
            <input
              type="text"
              placeholder="Buscar jugador…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[15px] outline-none text-prode-text placeholder:text-prode-text-disabled"
            />
          </div>

          <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden min-h-[200px]">
            {/* Table Header */}
            <div className="grid grid-cols-[44px_1fr_62px_56px] px-4 py-[10px] border-b border-prode-border text-[11px] font-[800] tracking-[0.1em] uppercase text-prode-text-disabled">
              <div>#</div>
              <div>Jugador</div>
              <div className="text-right">Pts</div>
              <div className="text-right">Fecha</div>
            </div>

            {loading ? (
              <div className="flex justify-center pt-8"><LoadingSpinner /></div>
            ) : (
              <>
                {filteredRows.map((r, idx) => {
                  const isTop3 = r.pos <= 3;
                  return (
                    <div
                      key={r.id || idx}
                      className={`grid grid-cols-[44px_1fr_62px_56px] px-4 py-[12px] border-b border-prode-border-divider items-center ${
                        r.me ? "bg-prode-elevated" : ""
                      }`}
                    >
                      <div
                        className={`font-display text-[15px] font-[900] tabular-nums ${
                          isTop3 ? "text-[#D8B54A]" : "text-prode-text"
                        }`}
                      >
                        {r.pos}
                      </div>
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="text-[15px] font-[700] whitespace-nowrap overflow-hidden text-ellipsis">
                          {r.name}
                        </div>
                        <div className="text-[13px] text-prode-text-disabled truncate">
                          {r.club}
                        </div>
                      </div>
                      <div className="text-right font-display text-[17px] font-[800] tabular-nums">
                        {r.pts}
                      </div>
                      <div
                        className={`text-right text-[13px] font-[800] tabular-nums ${
                          r.delta === "—" ? "text-prode-text-disabled" : "text-prode-success"
                        }`}
                      >
                        {r.delta}
                      </div>
                    </div>
                  );
                })}
                
                {filteredRows.length === 0 && (
                  <div className="p-6 text-center text-[14px] text-prode-text-muted font-[600]">
                    No se encontraron jugadores.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Fixed My Row */}
        {!loading && myRow && (
          <div className="fixed bottom-[88px] md:bottom-8 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <div className="w-full max-w-[430px] md:max-w-5xl bg-prode-text text-prode-bg rounded-[8px] p-3 px-4 grid grid-cols-[44px_1fr_62px_56px] items-center pointer-events-auto shadow-lg">
              <div className="font-display text-[16px] font-[900] tabular-nums">
                {myRow.pos}
              </div>
              <div className="flex flex-col pr-2">
                <div className="text-[15px] font-[800] truncate">{myRow.name} — vos</div>
                <div className="text-[12px] opacity-60 font-[600]">
                  Mis puntos
                </div>
              </div>
              <div className="text-right font-display text-[17px] font-[900] tabular-nums">
                {myRow.pts}
              </div>
              <div className="text-right text-[13px] font-[800] tabular-nums text-prode-success">
                {myRow.delta}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Ranking;

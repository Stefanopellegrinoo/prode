import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import SubdivisionTabs from "../components/fixture/SubdivisionTabs";
import RankingTable from "../components/ranking/RankingTable";
import PinnedRow from "../components/ranking/PinnedRow";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useTournament } from "../context/TournamentContext";
import { getTournamentRanking } from "../services/rankingService";

const Ranking = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { tournament, subdivisions, fechaActual, loading, error } = useTournament();

  // :id overrides the context's current tournament (e.g. MatchesPage admin
  // links to /ranking/:tournamentId) — subdivisions/tabs still come from the
  // context, per design ADR-7 (only the current tournament's fixture is loaded).
  const tournamentId = id ? Number(id) : tournament?.id;

  const [activeSubId, setActiveSubId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingBySub, setRankingBySub] = useState({});

  const currentSubId = activeSubId ?? subdivisions[0]?.id ?? null;

  // Same lazy, per-tab, fetch-once pattern as Dashboard's "Tu campaña" mini-tabs
  // (apply-progress Unit 5) — the ranking endpoint has no LIMIT/cache, so
  // fanning out to every subdivision on mount would throw away most responses.
  const requestedRankings = useRef(new Set());
  useEffect(() => {
    if (!tournamentId || !currentSubId) return;
    const key = `${tournamentId}:${currentSubId}`;
    if (requestedRankings.current.has(key)) return;
    requestedRankings.current.add(key);

    getTournamentRanking(currentSubId, tournamentId)
      .then((rows) => setRankingBySub((prev) => ({ ...prev, [currentSubId]: rows || [] })))
      .catch(() => requestedRankings.current.delete(key));
  }, [tournamentId, currentSubId]);

  const rankedRows = useMemo(
    () =>
      (rankingBySub[currentSubId] || []).map((r, i) => ({
        userId: r.user_id ?? r.User?.id,
        pos: i + 1,
        name: r.userName || r.User?.name || "Usuario",
        sub: r.User?.username ? `@${r.User.username}` : undefined,
        points: r.points,
        // Backend has no per-fecha delta (ADR-8) — never invented, always "—".
        delta: "—",
      })),
    [rankingBySub, currentSubId]
  );

  const filteredRows = rankedRows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.sub || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myRow = rankedRows.find((r) => r.userId === currentUser?.id);
  const thirdPlace = rankedRows[2];
  const gapToPodium =
    myRow && myRow.pos > 3 && thirdPlace ? thirdPlace.points - myRow.points : null;

  const tabItems = subdivisions.map((s) => ({ id: s.id, name: s.name }));

  return (
    <AppLayout width="default">
      <div className="flex flex-col min-h-screen pb-[176px]">
        <div className="pt-[18px] px-4 flex flex-col gap-[14px] border-b border-prode-border">
          <div className="flex items-center justify-between">
            <div className="font-display text-[24px] font-[900] tracking-[-0.01em] uppercase">
              Ranking
            </div>
            <div className="text-[14px] font-[600] text-prode-text-muted">
              {tournament ? `${tournament.name}${fechaActual ? ` · Fecha ${fechaActual.number}` : ""}` : ""}
            </div>
          </div>
          {tabItems.length > 0 && (
            <SubdivisionTabs
              items={tabItems}
              activeId={currentSubId}
              onChange={setActiveSubId}
              withCounter={false}
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center pt-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="px-4 text-center p-4 text-prode-error text-[14px] font-[600]">{error}</div>
        ) : (
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

            <RankingTable rows={filteredRows} meId={currentUser?.id} showDelta podiumTiered={false} />
          </div>
        )}

        {!loading && !error && myRow && (
          <PinnedRow pos={myRow.pos} name={myRow.name} points={myRow.points} gapToPodium={gapToPodium} />
        )}
      </div>
    </AppLayout>
  );
};

export default Ranking;

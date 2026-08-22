import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import StatCard from "../components/ui/StatCard";
import ProgressSegments from "../components/ui/ProgressSegments";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useTournament } from "../context/TournamentContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useAlert } from "../context/AlertContext";
import { getUserStats } from "../services/userService";
import { getMyGroups } from "../services/groupService";
import { getTournamentRanking } from "../services/rankingService";
import { POINTS } from "../config/constants";
import { getInitials } from "../lib/utils";

const WEEKDAYS_FULL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS_FULL = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

// Same deterministic-locale reasoning as Predictions.jsx (F1.9) — avoids
// toLocaleDateString's runtime/browser locale mismatch.
const formatHeaderDate = (date) =>
  `${WEEKDAYS_FULL[date.getDay()]} ${date.getDate()} de ${MONTHS_FULL[date.getMonth()]}`;

const kickoffLabel = (match) => `${WEEKDAYS_SHORT[match.kickoff.getDay()]} ${match.time}`;

// Never invent a score/points number the backend didn't produce (ADR-9) — same
// win/draw/miss mapping Predictions.jsx already applies to its own badges.
const outcomeFor = (match) => {
  if (!match.savedPick || !match.result) return { correct: false, points: 0 };
  const correct = match.savedPick === match.result;
  return { correct, points: correct ? (match.savedPick === "draw" ? POINTS.DRAW : POINTS.WIN) : POINTS.MISS };
};

const sideLabel = (match, pick) => {
  if (pick === "draw") return "empate";
  if (pick === "home") return match.home.shortName;
  if (pick === "away") return match.away.shortName;
  return null;
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const { tournament, subdivisions, fechas, fechaActual, matchesBy, loading, error } = useTournament();
  const { showToast, hideToast } = useAlert();

  const [campaignSubId, setCampaignSubId] = useState(null);
  const [stats, setStats] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rankingBySub, setRankingBySub] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileFailed, setProfileFailed] = useState(false);
  const [profileReload, setProfileReload] = useState(0);

  const currentSubId = campaignSubId ?? subdivisions[0]?.id ?? null;

  // Stats + groups don't depend on the tournament resolving (a user can have
  // groups with no active fixture), so this runs on mount, in parallel with the
  // TournamentContext load. allSettled instead of .catch(() => []) so a
  // transient failure stays distinguishable from a genuinely empty account —
  // otherwise an active user gets misclassified as "nuevo".
  useEffect(() => {
    let cancelled = false;
    setProfileLoading(true);
    setProfileFailed(false);

    (async () => {
      const [statsRes, groupsRes] = await Promise.allSettled([getUserStats(), getMyGroups()]);
      if (cancelled) return;
      const failed = statsRes.status === "rejected" || groupsRes.status === "rejected";
      setStats(statsRes.status === "fulfilled" ? statsRes.value || [] : []);
      setGroups(groupsRes.status === "fulfilled" ? groupsRes.value || [] : []);
      setProfileFailed(failed);
      setProfileLoading(false);
      if (failed) {
        const toastId = showToast("No pudimos cargar tus datos.", "error", {
          onRetry: () => {
            hideToast(toastId);
            setProfileReload((n) => n + 1);
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileReload, showToast, hideToast]);

  // Ranking is fetched lazily, only for the visible mini-tab, and each
  // subdivision at most once (the endpoint has no LIMIT nor backend cache —
  // fanning out to every subdivision on mount threw away 4 of 5 responses).
  const requestedRankings = useRef(new Set());
  useEffect(() => {
    const tournamentId = tournament?.id;
    if (!tournamentId || !currentSubId) return;
    const key = `${tournamentId}:${currentSubId}`;
    if (requestedRankings.current.has(key)) return;
    requestedRankings.current.add(key);

    getTournamentRanking(currentSubId, tournamentId)
      .then((rows) => setRankingBySub((prev) => ({ ...prev, [currentSubId]: rows || [] })))
      // Drop the key so revisiting the tab retries; a cached sub never refetches.
      .catch(() => requestedRankings.current.delete(key));
  }, [tournament?.id, currentSubId]);

  const fechaKey = fechaActual?.key ?? null;

  const allMatchesForFecha = fechaKey
    ? subdivisions.flatMap((sub) => matchesBy[sub.id]?.[fechaKey] ?? [])
    : [];
  const totalAll = allMatchesForFecha.length;
  const totalDone = allMatchesForFecha.filter((m) => m.savedPick).length;
  const totalPending = totalAll - totalDone;
  const earliestMatch = allMatchesForFecha.length
    ? allMatchesForFecha.reduce((earliest, m) => (m.kickoff < earliest.kickoff ? m : earliest))
    : null;
  const closingLabel = earliestMatch ? kickoffLabel(earliestMatch) : null;

  const fechaLabel = fechaActual
    ? `Fecha ${fechaActual.number}${closingLabel ? ` · cierra ${closingLabel}` : ""}`
    : "Fecha —";

  // "Sin predicciones" derived from the fixture already in context (accurate
  // even before any match is graded) — not from /users/stats, whose rows only
  // exist once a match finishes (calculatePoints.worker.js), which would
  // otherwise misclassify an active early-season user as "nuevo". ANDed with
  // the stats/groups signals so a real edge case never hides real data.
  const hasAnyPrediction = subdivisions.some((sub) =>
    Object.values(matchesBy[sub.id] || {}).some((list) => list.some((m) => m.savedPick))
  );
  const statsForTournament = stats.find((t) => t.id === tournament?.id)?.subdivisions || [];
  // profileFailed guard: an empty stats/groups array we never actually received
  // is not evidence of a new user — fall through to the real dashboard instead.
  const usuarioNuevo =
    !loading &&
    !profileLoading &&
    !profileFailed &&
    !hasAnyPrediction &&
    statsForTournament.length === 0 &&
    groups.length === 0;

  const statsBySubId = Object.fromEntries(statsForTournament.map((s) => [s.id, s.stats]));
  const campaignStats = statsBySubId[currentSubId] || {
    totalPredictions: 0,
    totalPoints: 0,
    correctPredictions: 0,
    accuracy: 0,
  };
  const rankingRows = rankingBySub[currentSubId] || [];
  const myRankIndex = rankingRows.findIndex((r) => r.user_id === currentUser?.id);
  const positionLabel = myRankIndex >= 0 ? `#${myRankIndex + 1}` : "—";
  const totalPlayersLabel = rankingRows.length ? String(rankingRows.length) : "—";

  const campaignCards = [
    { value: campaignStats.totalPoints, label: "puntos" },
    { value: positionLabel, label: `de ${totalPlayersLabel} jugadores` },
    {
      value: campaignStats.correctPredictions,
      label: `aciertos de ${campaignStats.totalPredictions}`,
      tone: "success",
    },
    { value: `${campaignStats.accuracy}%`, label: "de efectividad" },
  ];

  const lastResultsFecha = [...fechas].reverse().find((f) =>
    (matchesBy[currentSubId]?.[f.key] || []).some((m) => m.status === "finished")
  );
  const lastResults = lastResultsFecha
    ? (matchesBy[currentSubId]?.[lastResultsFecha.key] || []).filter((m) => m.status === "finished")
    : [];

  const initials = getInitials(currentUser?.name, "US");
  const firstName = currentUser?.name?.split(" ")[0] || "";

  const starterBody =
    totalAll > 0
      ? `${totalAll} ${totalAll === 1 ? "partido te espera" : "partidos te esperan"}${
          closingLabel ? ` · cierra ${closingLabel}` : ""
        }.`
      : "Arrancá apenas se cargue el próximo fixture.";

  return (
    <AppLayout width="wide">
      <div className="flex flex-col">
        <div className="pt-[18px] pb-4 px-4 flex items-center justify-between">
          <div className="flex flex-col gap-[2px]">
            <div className="text-[14px] font-[600] text-prode-text-muted">
              {formatHeaderDate(new Date())}
            </div>
            <div className="font-display text-[24px] font-[900] uppercase tracking-[-0.01em] leading-none">
              Hola, {firstName}
            </div>
          </div>
          <div className="w-[38px] h-[38px] rounded-[6px] bg-prode-elevated text-prode-text-muted flex items-center justify-center text-[14px] font-[700] shrink-0">
            {initials}
          </div>
        </div>

        {loading || profileLoading ? (
          <div className="flex justify-center pt-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="px-4 text-center p-4 text-prode-error text-[14px] font-[600]">{error}</div>
        ) : usuarioNuevo ? (
          <div className="px-4 flex flex-col gap-3 pb-6 max-w-[520px]">
            <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
              <div className="p-4 flex flex-col gap-2">
                <div className="font-display text-[26px] font-[900] uppercase leading-[1.05]">
                  Tu primera fecha te espera
                </div>
                <div className="text-[15px] leading-[1.5] text-prode-text-muted">{starterBody}</div>
              </div>
              <Link
                to="/predictions"
                className="flex items-center justify-center h-14 bg-prode-select-bg text-prode-select-fg text-[16px] font-[800]"
              >
                Hacer mis pronósticos
              </Link>
            </div>

            <div className="bg-prode-surface border border-prode-border rounded-[10px] p-4 flex flex-col gap-2">
              <div className="text-[15px] font-[700]">Todavía no jugás con nadie</div>
              <div className="text-[14px] leading-[1.5] text-prode-text-muted">
                Los grupos son la gracia del prode: armá uno con los del club o sumate con un código.
              </div>
              <div className="flex gap-2 pt-1">
                <Link
                  to="/groups"
                  className="flex-1 h-11 rounded-[6px] border border-prode-border-control text-[14px] font-[700] flex items-center justify-center"
                >
                  Unirme
                </Link>
                <Link
                  to="/groups"
                  className="flex-1 h-11 rounded-[6px] bg-prode-select-bg text-prode-select-fg text-[14px] font-[800] flex items-center justify-center"
                >
                  Crear grupo
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={`px-4 pb-6 flex flex-col gap-4 ${!darkMode ? "md:grid md:grid-cols-2 md:gap-4" : ""}`}>
            <div className="flex flex-col gap-4">
              <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
                <div className="p-4 flex flex-col gap-3 border-b border-prode-border">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-[700] tracking-[0.14em] uppercase text-prode-text-muted">
                      {fechaLabel}
                    </div>
                    <div className="text-[12px] font-[800] text-prode-success tabular-nums">
                      {totalDone}/{totalAll}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-display text-[38px] font-[900] leading-none">
                      {totalPending} {totalPending === 1 ? "partido" : "partidos"}
                    </div>
                    <div className="text-[15px] font-[600] text-prode-text-muted">sin pronosticar</div>
                  </div>
                  <ProgressSegments total={totalAll} filled={totalDone} />
                </div>
                <Link
                  to="/predictions"
                  className="flex items-center justify-center h-14 bg-prode-select-bg text-prode-select-fg text-[16px] font-[800]"
                >
                  Completar pronósticos
                </Link>
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <div className="font-display text-[17px] font-[800] uppercase tracking-[0.02em]">
                    Tu campaña
                  </div>
                  <div className="flex gap-[2px]">
                    {subdivisions.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setCampaignSubId(sub.id)}
                        className={`px-[11px] py-[7px] rounded-[5px] text-[13px] cursor-pointer ${
                          sub.id === currentSubId
                            ? "font-[800] bg-prode-select-bg text-prode-select-fg"
                            : "font-[600] text-prode-text-muted bg-prode-elevated"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {campaignCards.map((card) => (
                    <StatCard key={card.label} value={card.value} label={card.label} tone={card.tone} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <div className="font-display text-[17px] font-[800] uppercase tracking-[0.02em]">
                Última fecha
              </div>
              <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
                {lastResults.length === 0 ? (
                  <div className="p-6 text-center text-[14px] font-[600] text-prode-text-muted">
                    Todavía no hay resultados.
                  </div>
                ) : (
                  lastResults.map((m) => {
                    const { correct, points } = outcomeFor(m);
                    const played = sideLabel(m, m.savedPick);
                    const dotState = !played ? "none" : correct ? "hit" : "miss";
                    const mark = dotState === "hit" ? "✓" : dotState === "miss" ? "✕" : "–";
                    const detail = !played
                      ? "No pronosticaste"
                      : correct
                      ? `Jugaste ${played} · +${points} pts`
                      : `Jugaste ${played}`;
                    const scoreLabel =
                      m.homeScore != null && m.awayScore != null ? `${m.homeScore}–${m.awayScore}` : "vs";

                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 px-4 py-[13px] border-b border-prode-border-divider last:border-b-0"
                      >
                        <div
                          className={`w-[26px] h-[26px] rounded-[5px] flex items-center justify-center text-[13px] font-[900] shrink-0 ${
                            dotState === "hit"
                              ? "bg-prode-success-bg text-prode-success"
                              : dotState === "miss"
                              ? "bg-prode-error-bg text-prode-error"
                              : "bg-prode-elevated text-prode-text-disabled"
                          }`}
                        >
                          {mark}
                        </div>
                        <div className="flex-1 flex flex-col gap-[1px] min-w-0">
                          <div className="text-[15px] font-[700] truncate">
                            {m.home.name} {scoreLabel} {m.away.name}
                          </div>
                          <div className="text-[14px] text-prode-text-muted truncate">{detail}</div>
                        </div>
                        <div className="font-display text-[16px] font-[800] tabular-nums text-prode-text-muted shrink-0">
                          {correct ? `+${points}` : "0"}
                        </div>
                      </div>
                    );
                  })
                )}
                <Link
                  to="/ranking"
                  className="flex items-center justify-center h-12 text-[14px] font-[700] text-prode-text-muted"
                >
                  Ver ranking completo →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;

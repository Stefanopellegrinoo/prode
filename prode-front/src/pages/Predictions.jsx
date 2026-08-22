import { useState } from "react";
import AppLayout from "../components/layouts/AppLayout";
import MatchCard from "../components/fixture/MatchCard";
import SubdivisionTabs from "../components/fixture/SubdivisionTabs";
import SaveBar from "../components/fixture/SaveBar";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useTournament } from "../context/TournamentContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { savePrediction } from "../services/predictionService";
import { POINTS } from "../config/constants";

// Deterministic Spanish abbreviations — avoids the locale-dependent quirks of
// toLocaleDateString/toLocaleTimeString already flagged in utils/fixture.js (F1.4).
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const formatFechaLabel = (date) =>
  date ? `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}` : "";

// Never invent a score the backend didn't send (same principle as ADR-9's
// shortName/stadium fallbacks) — omit the "· marcador" suffix instead.
const scoreLabel = (match) =>
  match.homeScore != null && match.awayScore != null ? `${match.homeScore}–${match.awayScore}` : null;

const sideLabel = (match, pick) => {
  if (pick === "draw") return "empate";
  if (pick === "home") return match.home.shortName;
  if (pick === "away") return match.away.shortName;
  return null;
};

const Predictions = () => {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const { showToast } = useToast();
  const { subdivisions, fechaActual, matchesBy, loading, error } = useTournament();

  const [activeSubdivisionId, setActiveSubdivisionId] = useState(null);
  // matchId -> 'home'|'away'|'draw'|null — undefined means "no local override".
  const [picks, setPicks] = useState({});
  // matchId -> pick, populated once a POST succeeds (avoids refetching the whole context).
  const [savedOverrides, setSavedOverrides] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const currentSubdivisionId = activeSubdivisionId ?? subdivisions[0]?.id ?? null;
  const fechaKey = fechaActual?.key ?? null;

  const savedPickFor = (match) =>
    savedOverrides[match.id] !== undefined ? savedOverrides[match.id] : match.savedPick;

  const effectivePick = (match) => {
    const local = picks[match.id];
    return local !== undefined ? local : savedPickFor(match);
  };

  const matchesFor = (subdivisionId) => (fechaKey ? matchesBy[subdivisionId]?.[fechaKey] ?? [] : []);

  const countDone = (subdivisionId) => matchesFor(subdivisionId).filter((m) => effectivePick(m)).length;

  const tabs = subdivisions.map((sub) => ({
    id: sub.id,
    name: sub.name,
    done: countDone(sub.id),
    total: matchesFor(sub.id).length,
  }));

  const totalDone = tabs.reduce((n, t) => n + t.done, 0);
  const totalAll = tabs.reduce((n, t) => n + t.total, 0);

  const activeMatches = matchesFor(currentSubdivisionId);
  const activeDone = countDone(currentSubdivisionId);

  const closingTimeLabel = activeMatches.length
    ? activeMatches.reduce((earliest, m) => (m.kickoff < earliest.kickoff ? m : earliest)).time
    : null;

  const subHeaderDate = fechaActual
    ? `${formatFechaLabel(fechaActual.date)}${closingTimeLabel ? ` · cierra ${closingTimeLabel}` : ""}`
    : "";

  const setPick = (matchId, value) => {
    setPicks((prev) => ({ ...prev, [matchId]: value }));
    setSavedFlash(false);
  };

  // Only actual selections count as pending — a local `null` override (re-tapping a saved
  // pick to clear it) has nothing to POST: predicted_winner is NOT NULL, the backend has no
  // way to "unsave" a prediction (verified at runtime, see R-D2 in apply-progress).
  const pendingIds = Object.keys(picks).filter((id) => picks[id]);
  const pendingCount = pendingIds.length;

  const handleSave = async () => {
    if (!pendingCount || saving) return;
    setSaving(true);

    const settled = await Promise.allSettled(
      pendingIds.map((id) => savePrediction({ matchId: Number(id), predicted_winner: picks[id] }))
    );

    const succeeded = [];
    const failed = [];
    settled.forEach((result, i) => {
      (result.status === "fulfilled" ? succeeded : failed).push(pendingIds[i]);
    });

    setSavedOverrides((prev) => {
      const next = { ...prev };
      succeeded.forEach((id) => {
        next[id] = picks[id];
      });
      return next;
    });
    setPicks((prev) => {
      const next = { ...prev };
      succeeded.forEach((id) => delete next[id]);
      return next;
    });
    setSaving(false);

    if (succeeded.length) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    }
    if (failed.length) {
      showToast(
        succeeded.length
          ? "Algunos pronósticos no se pudieron guardar. Probá de nuevo."
          : "Hubo un error al guardar.",
        "error",
        { onRetry: handleSave }
      );
    }
  };

  const buildCardMatch = (match) => {
    const sel = effectivePick(match);
    const scored = scoreLabel(match);
    let badgeVariant = null;
    let customBadgeLabel;
    let resultNote;

    if (match.status === "live" || match.status === "finished") {
      // Locked matches reflect backend-confirmed picks only, never unsent local overrides.
      const confirmed = savedPickFor(match);
      const played = sideLabel(match, confirmed);
      resultNote = played
        ? `Jugaste ${played}${scored ? ` · ${scored}` : ""}`
        : `No pronosticaste${scored ? ` · ${scored}` : ""}`;

      if (match.status === "live") {
        badgeVariant = "live";
      } else {
        const correct = Boolean(confirmed) && confirmed === match.result;
        if (correct) {
          badgeVariant = "hit";
          customBadgeLabel = `✓ +${confirmed === "draw" ? POINTS.DRAW : POINTS.WIN} pts`;
        } else {
          badgeVariant = "miss";
        }
      }
    } else if (sel) {
      const hasLocalOverride = picks[match.id] !== undefined && picks[match.id] !== null;
      badgeVariant = hasLocalOverride ? "unsaved" : "saved";
    }

    return {
      id: match.id,
      time: `${WEEKDAYS[match.kickoff.getDay()]} ${match.time}`,
      home: match.home,
      away: match.away,
      badgeVariant,
      customBadgeLabel,
      resultNote,
    };
  };

  const initials = currentUser?.name?.substring(0, 2).toUpperCase() || "US";

  return (
    <AppLayout width="wide">
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 bg-prode-bg border-b border-prode-border pt-[18px] px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] rounded-[6px] bg-prode-select-bg text-prode-select-fg flex items-center justify-center font-display text-[14px] font-[900]">
                P
              </div>
              <div className="font-display text-[17px] font-[800] uppercase tracking-[0.02em]">
                {fechaActual ? `Fecha ${fechaActual.number}` : "Fecha —"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[28px] px-[10px] rounded-[4px] bg-prode-success-bg text-prode-success text-[12px] font-[800] tabular-nums flex items-center">
                {totalDone}/{totalAll}
              </div>
              <div className="w-[34px] h-[34px] rounded-[6px] bg-prode-elevated text-prode-text-muted flex items-center justify-center text-[14px] font-[700]">
                {initials}
              </div>
            </div>
          </div>
          <div className="-mx-4 px-4">
            <SubdivisionTabs
              items={tabs}
              activeId={currentSubdivisionId}
              onChange={setActiveSubdivisionId}
              withCounter
            />
          </div>
        </div>

        <div className="px-3 pt-3 pb-[120px] flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center pt-10">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-prode-error text-[14px] font-[600]">{error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 pt-[6px] pb-[2px]">
                <div className="text-[14px] font-[600] text-prode-text-muted tabular-nums">
                  {subHeaderDate}
                </div>
                <div className="text-[13px] font-[700] text-prode-success tabular-nums">
                  {activeDone}/{activeMatches.length} pronosticados
                </div>
              </div>

              {activeMatches.length === 0 ? (
                <div className="text-center p-6 text-prode-text-muted text-[14px] font-[600]">
                  No hay partidos programados para esta categoría.
                </div>
              ) : (
                <div className={`flex flex-col gap-2 ${!darkMode ? "md:grid md:grid-cols-2 md:gap-3" : ""}`}>
                  {activeMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={buildCardMatch(match)}
                      prediction={
                        match.status === "live" || match.status === "finished"
                          ? savedPickFor(match)
                          : effectivePick(match)
                      }
                      status={match.status}
                      onPredict={(value) => setPick(match.id, value)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <SaveBar count={pendingCount} saving={saving} flash={savedFlash} onSave={handleSave} />
    </AppLayout>
  );
};

export default Predictions;

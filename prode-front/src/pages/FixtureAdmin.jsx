import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import StatusBadge from "../components/fixture/StatusBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getTournaments } from "../services/tournamentService";
import { getSubdivisions } from "../services/subdivisionService";
import { getTeamsByTournament } from "../services/teamService";
import { getMatchesByTournament, createMatch, updateMatch } from "../services/matchService";
import { pickCurrentTournament } from "../utils/tournament";

const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });
const dayFormatter = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "2-digit", month: "short" });

const isFinishedMatch = (match) =>
  Boolean(match.result) || String(match.status || "").toUpperCase() === "FINISHED";

// "Fecha N" is derived the same way the fixture normalizer for the player-facing screens
// does (H2/ADR-9 in the design): group by calendar day, sort ascending, "current" = first
// day that isn't fully finished, fallback to the last day. Reimplemented locally (not
// imported from utils/fixture.js) because that module doesn't exist on this branch's base
// (F0b) and it's shaped for MatchCard/Predictions, not for a flat admin table — this is the
// ~10 lines Admin actually needs, over a whole normalization pipeline built for a different
// consumer.
const deriveTournamentFecha = (matchesBySubdivision) => {
  const dateKeys = new Set();
  Object.values(matchesBySubdivision).forEach((byDate) => {
    Object.keys(byDate).forEach((key) => dateKeys.add(key));
  });
  const sortedKeys = [...dateKeys].sort();
  if (!sortedKeys.length) return { number: null, dateKey: null, total: 0 };

  const activeKey =
    sortedKeys.find((key) =>
      Object.values(matchesBySubdivision).some((byDate) =>
        (byDate[key] || []).some((match) => !isFinishedMatch(match))
      )
    ) ?? sortedKeys[sortedKeys.length - 1];

  return { number: sortedKeys.indexOf(activeKey) + 1, dateKey: activeKey, total: sortedKeys.length };
};

const deriveAdminStatus = (match) => {
  const status = String(match.status || "").toLowerCase();
  if (status === "live" || status === "en_vivo") return "live";
  if (isFinishedMatch(match)) return "finished";
  return "scheduled";
};

const emptyNewMatch = (subdivisions) => ({
  homeTeamId: "",
  awayTeamId: "",
  datetime: "",
  subdivisionIds: subdivisions.map((s) => s.id),
});

const FixtureAdmin = () => {
  const [activeNav, setActiveNav] = useState("fixture");
  const [activeSubdivisionId, setActiveSubdivisionId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editScores, setEditScores] = useState({ home: "", away: "" });
  const [savingId, setSavingId] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({ homeTeamId: "", awayTeamId: "", datetime: "", subdivisionIds: [] });
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [tournaments, setTournaments] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matchesBySubdivision, setMatchesBySubdivision] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tournament = useMemo(() => pickCurrentTournament(tournaments), [tournaments]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tournamentsData, subdivisionsData] = await Promise.all([getTournaments(), getSubdivisions()]);
        const current = pickCurrentTournament(tournamentsData);

        if (!current) {
          if (!cancelled) {
            setTournaments(tournamentsData);
            setSubdivisions(subdivisionsData);
            setActiveSubdivisionId((prev) => prev ?? subdivisionsData[0]?.id ?? null);
          }
          return;
        }

        const [teamsData, matchesData] = await Promise.all([
          getTeamsByTournament(current.id),
          getMatchesByTournament(current.id),
        ]);
        if (cancelled) return;

        setTournaments(tournamentsData);
        setSubdivisions(subdivisionsData);
        setTeams(teamsData);
        setMatchesBySubdivision(matchesData);
        setActiveSubdivisionId((prev) => prev ?? subdivisionsData[0]?.id ?? null);
        setNewMatch(emptyNewMatch(subdivisionsData));
      } catch (err) {
        if (!cancelled) setError(err.message || "Error al cargar el panel de administración");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const refetchMatches = async () => {
    if (!tournament) return;
    const data = await getMatchesByTournament(tournament.id);
    setMatchesBySubdivision(data);
  };

  const activeSubdivision = subdivisions.find((s) => s.id === activeSubdivisionId) || null;
  const fechaInfo = useMemo(() => deriveTournamentFecha(matchesBySubdivision), [matchesBySubdivision]);

  const partidosEnFecha = useMemo(() => {
    if (!fechaInfo.dateKey) return { total: 0, subdivisiones: 0 };
    let total = 0;
    let subdivisionesConPartidos = 0;
    Object.values(matchesBySubdivision).forEach((byDate) => {
      const rows = byDate[fechaInfo.dateKey];
      if (rows?.length) {
        total += rows.length;
        subdivisionesConPartidos += 1;
      }
    });
    return { total, subdivisiones: subdivisionesConPartidos };
  }, [matchesBySubdivision, fechaInfo.dateKey]);

  const rows = useMemo(() => {
    if (!activeSubdivision || !fechaInfo.dateKey) return [];
    const byDate = matchesBySubdivision[activeSubdivision.name] || {};
    const matches = byDate[fechaInfo.dateKey] || [];
    return [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activeSubdivision, matchesBySubdivision, fechaInfo.dateKey]);

  const subdivisionMatchCounts = useMemo(() => {
    const counts = {};
    subdivisions.forEach((sub) => {
      const byDate = matchesBySubdivision[sub.name] || {};
      counts[sub.id] = Object.values(byDate).reduce((sum, list) => sum + list.length, 0);
    });
    return counts;
  }, [subdivisions, matchesBySubdivision]);

  const openEdit = (match) => {
    setEditingId(match.id);
    setEditScores({ home: match.home_score ?? "", away: match.away_score ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditScores({ home: "", away: "" });
  };

  const saveResult = async (match) => {
    if (editScores.home === "" || editScores.away === "") return;
    const home = Number(editScores.home);
    const away = Number(editScores.away);
    if (Number.isNaN(home) || Number.isNaN(away)) return;

    const result = home === away ? "draw" : home > away ? "home" : "away";
    setSavingId(match.id);
    try {
      await updateMatch(match.id, {
        id: match.id,
        home_score: home,
        away_score: away,
        result,
        status: "FINISHED",
      });
      await refetchMatches();
      cancelEdit();
    } catch (err) {
      setError(err.message || "No se pudo guardar el resultado");
    } finally {
      setSavingId(null);
    }
  };

  const toggleNewSubdivision = (subdivisionId) => {
    setNewMatch((prev) => {
      const on = prev.subdivisionIds.includes(subdivisionId);
      return {
        ...prev,
        subdivisionIds: on
          ? prev.subdivisionIds.filter((id) => id !== subdivisionId)
          : [...prev.subdivisionIds, subdivisionId],
      };
    });
  };

  const openNewMatchModal = () => {
    setModalError(null);
    setNewMatch(emptyNewMatch(subdivisions));
    setNewOpen(true);
  };

  const createNewMatch = async () => {
    setModalError(null);
    if (!tournament) return;
    if (!newMatch.homeTeamId || !newMatch.awayTeamId || !newMatch.datetime || newMatch.subdivisionIds.length === 0) {
      setModalError("Completá equipos, fecha y al menos una subdivisión.");
      return;
    }
    if (newMatch.homeTeamId === newMatch.awayTeamId) {
      setModalError("Los equipos no pueden ser los mismos.");
      return;
    }

    setCreating(true);
    try {
      // Verified in runtime against the real backend (see apply-progress): MatchService#create
      // ignores `subdivision_id` entirely and always loops over the TOURNAMENT'S FULL
      // subdivision set, creating the same matchup in every one of them inside a single
      // transaction — and it's all-or-nothing: a conflict (either team already playing that
      // day) in ANY subdivision throws and rolls back the whole batch, so calling this once
      // per checked chip either duplicates work or guarantees conflicts on every call after
      // the first. One call is correct; the chip selection can't be enforced server-side.
      const created = await createMatch(tournament.id, {
        tournament_id: tournament.id,
        subdivision_id: newMatch.subdivisionIds[0],
        home_team_id: Number(newMatch.homeTeamId),
        away_team_id: Number(newMatch.awayTeamId),
        date: new Date(newMatch.datetime).toISOString(),
      });
      await refetchMatches();
      setNewOpen(false);
      const createdIds = new Set((created || []).map((m) => m.subdivision_id));
      const requestedIds = new Set(newMatch.subdivisionIds);
      const wasPartialSelection = [...createdIds].some((id) => !requestedIds.has(id));
      if (wasPartialSelection) {
        setError(
          "El partido se creó en las 5 subdivisiones del torneo: el backend todavía no permite crearlo solo en las marcadas."
        );
      }
    } catch (err) {
      setModalError(err.message || "No se pudo crear el partido.");
    } finally {
      setCreating(false);
    }
  };

  const renderFixture = () => (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
            Fixture{fechaInfo.number ? ` · Fecha ${fechaInfo.number}` : ""}
          </h1>
          <div className="text-[15px] font-[600] text-prode-text-muted">
            {tournament ? `${tournament.name} — ${tournament.season}` : "Sin torneo activo"}
            {fechaInfo.dateKey && ` · ${dayFormatter.format(new Date(fechaInfo.dateKey))}`}
            {partidosEnFecha.total > 0 &&
              ` · ${partidosEnFecha.total} partidos en ${partidosEnFecha.subdivisiones} subdivisiones`}
          </div>
        </div>
        <div className="flex gap-3">
          {/* ponytail: verified in runtime (see apply-progress) that MatchService#create is
              strictly all-or-nothing across the tournament's full subdivision set — a
              conflict in ANY subdivision (either team already playing that day) throws and
              rolls back everything, with no per-subdivision partial-success info in the
              error. So "duplicate this existing row to whichever subdivisions are missing
              it" can't be done safely: there's no way to tell which ones already have it
              before the call fails, and retrying blind risks losing already-good data.
              Left unwired; reported as a blocked task instead of fabricating a workaround
              the backend doesn't actually support. */}
          <button
            disabled
            title="No disponible: el backend no soporta duplicar un partido existente a las subdivisiones que le faltan."
            className="h-[44px] px-4 border border-prode-border-control rounded-[6px] text-[14px] font-[800] uppercase opacity-50 cursor-not-allowed"
          >
            Duplicar a las 5 subdivisiones
          </button>
          <button
            onClick={openNewMatchModal}
            disabled={!tournament}
            className="h-[44px] px-4 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nuevo partido
          </button>
        </div>
      </div>

      <div className="px-8 pb-4 flex gap-2 flex-wrap">
        {subdivisions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubdivisionId(sub.id)}
            className={`px-4 py-2 rounded-[6px] text-[14px] font-[700] transition-colors ${
              activeSubdivisionId === sub.id
                ? "bg-prode-text text-prode-bg"
                : "bg-prode-elevated text-prode-text-muted hover:text-prode-text"
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <div className="px-8 pb-8 flex-1">
        <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-[820px] w-full">
              <div className="grid grid-cols-[70px_1fr_130px_120px_170px] gap-[12px] px-5 py-[12px] border-b border-prode-border text-[11px] font-[800] uppercase tracking-[0.1em] text-prode-text-disabled bg-prode-elevated">
                <div>Hora</div>
                <div>Partido</div>
                <div>Resultado</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>

              {rows.length === 0 ? (
                <div className="px-5 py-8 text-[14px] text-prode-text-muted">
                  No hay partidos cargados para esta subdivisión.
                </div>
              ) : (
                rows.map((match) => {
                  const status = deriveAdminStatus(match);
                  const editing = editingId === match.id;
                  return (
                    <div
                      key={match.id}
                      className="grid grid-cols-[70px_1fr_130px_120px_170px] gap-[12px] px-5 py-3 border-b border-prode-border-divider items-center hover:bg-prode-surface-row transition-colors"
                    >
                      <div className="font-display text-[15px] font-[800] tabular-nums">
                        {timeFormatter.format(new Date(match.date))}
                      </div>
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="text-[15px] font-[700] truncate">
                          {match.homeTeam?.name} vs {match.awayTeam?.name}
                        </div>
                      </div>

                      <div className="flex items-center">
                        {editing ? (
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={editScores.home}
                              onChange={(e) => setEditScores((prev) => ({ ...prev, home: e.target.value }))}
                              className="w-[44px] h-[36px] bg-prode-bg border border-prode-border-control rounded-[4px] text-center font-display text-[16px] font-[800] tabular-nums outline-none focus:border-prode-text"
                            />
                            <input
                              type="number"
                              value={editScores.away}
                              onChange={(e) => setEditScores((prev) => ({ ...prev, away: e.target.value }))}
                              className="w-[44px] h-[36px] bg-prode-bg border border-prode-border-control rounded-[4px] text-center font-display text-[16px] font-[800] tabular-nums outline-none focus:border-prode-text"
                            />
                          </div>
                        ) : (
                          <div className="font-display text-[16px] font-[800] tabular-nums">
                            {match.home_score != null && match.away_score != null
                              ? `${match.home_score}–${match.away_score}`
                              : "—"}
                          </div>
                        )}
                      </div>

                      <div>
                        {status === "scheduled" && <StatusBadge variant="unsaved" customLabel="Programado" />}
                        {status === "live" && <StatusBadge variant="live" />}
                        {status === "finished" && <StatusBadge variant="hit" customLabel="Finalizado" />}
                      </div>

                      <div className="flex gap-2">
                        {editing ? (
                          <>
                            <button
                              onClick={() => saveResult(match)}
                              disabled={savingId === match.id}
                              className="px-3 h-[36px] bg-prode-text text-prode-bg rounded-[4px] text-[13px] font-[800] whitespace-nowrap disabled:opacity-50"
                            >
                              {savingId === match.id ? "Guardando…" : "Guardar"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={savingId === match.id}
                              className="px-3 h-[36px] border border-prode-border-control rounded-[4px] text-[13px] font-[700] whitespace-nowrap"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openEdit(match)}
                            className="px-3 h-[36px] bg-prode-elevated rounded-[4px] text-[13px] font-[700] hover:brightness-110 transition-all whitespace-nowrap"
                          >
                            {status === "finished" ? "Corregir" : "Cargar resultado"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="p-4 bg-prode-elevated text-[13px] text-prode-text-muted font-[600]">
            Al guardar un resultado se recalculan los puntos de todos los pronósticos de ese partido.
          </div>
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
            Torneos
          </h1>
          <div className="text-[13px] text-prode-text-muted">
            Cada torneo agrupa subdivisiones con fixture propio
          </div>
        </div>
        {/* No creation flow exists in the prototype's own script either (no onClick wired
            for this button in Admin.dc.html) — presentational, matches source fidelity. */}
        <button className="h-[44px] px-4 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 transition-opacity">
          + Nuevo torneo
        </button>
      </div>

      <div className="flex flex-col gap-4 max-w-[720px]">
        {tournaments.length === 0 && (
          <div className="text-[14px] text-prode-text-muted">No hay torneos cargados todavía.</div>
        )}
        {tournaments.map((t) => {
          const isActive = tournament && t.id === tournament.id;
          return (
            <div
              key={t.id}
              className={`bg-prode-surface border border-prode-border rounded-[10px] p-5 flex justify-between items-center gap-4 ${
                isActive ? "" : "opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="font-display text-[18px] font-[800]">
                  {t.name} — {t.season}
                </div>
                <div className="text-[13px] text-prode-text-muted">
                  {isActive
                    ? `${subdivisions.length} subdivisiones · ${teams.length} equipos${
                        fechaInfo.number ? ` · fecha ${fechaInfo.number} de ${fechaInfo.total}` : ""
                      }`
                    : `${subdivisions.length} subdivisiones · finalizado`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <div className="bg-prode-success-bg text-prode-success px-2 py-1 rounded-[4px] text-[12px] font-[800] uppercase tracking-[0.06em]">
                    Activo
                  </div>
                ) : (
                  <div className="bg-prode-elevated text-prode-text-muted px-2 py-1 rounded-[4px] text-[12px] font-[800] uppercase tracking-[0.06em]">
                    Cerrado
                  </div>
                )}
                <button className="text-[13px] font-[700] text-prode-text-muted hover:text-prode-text transition-colors">
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {tournament && (
        <div className="flex flex-col gap-3 max-w-[720px]">
          <div className="text-[12px] font-[800] uppercase tracking-[0.14em] text-prode-text-disabled">
            Subdivisiones de {tournament.name} — {tournament.season}
          </div>
          <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
            {subdivisions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between px-5 py-[13px] border-b border-prode-border-divider last:border-b-0"
              >
                <div className="text-[15px] font-[700]">{sub.name}</div>
                <div className="flex items-center gap-4 text-prode-text-muted">
                  <span className="text-[13px] tabular-nums">{subdivisionMatchCounts[sub.id] ?? 0} partidos</span>
                  <button className="text-prode-text hover:underline">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeams = () => (
    <div className="p-8 flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
            Equipos
          </h1>
          {tournament && (
            <div className="text-[13px] text-prode-text-muted">
              {teams.length} clubes en {tournament.name}
            </div>
          )}
        </div>
        <button className="h-[44px] px-4 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 transition-opacity">
          + Nuevo equipo
        </button>
      </div>
      {teams.length === 0 ? (
        <div className="text-[14px] text-prode-text-muted">No hay equipos cargados para este torneo.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {teams.map((t) => (
            <div
              key={t.id}
              className="bg-prode-surface border border-prode-border rounded-[8px] p-4 flex items-center gap-3"
            >
              <div className="w-[40px] h-[40px] bg-prode-elevated rounded-[6px] flex items-center justify-center font-display text-[15px] font-[900] uppercase shrink-0 text-prode-text-muted">
                {(t.shortName || t.name || "?").slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-[700] truncate">{t.name}</div>
                <div className="text-[12px] text-prode-text-disabled truncate">{t.shortName}</div>
              </div>
              <button className="text-[13px] font-[700] text-prode-text-muted hover:text-prode-text transition-colors">
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const teamOptionsForVisitante = teams.filter((t) => String(t.id) !== newMatch.homeTeamId);
  const teamOptionsForLocal = teams.filter((t) => String(t.id) !== newMatch.awayTeamId);

  return (
    <AdminLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {loading ? (
        <div className="flex justify-center pt-16">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {error && (
            <div className="mx-8 mt-6 p-3 rounded-[6px] bg-prode-error-bg text-prode-error text-[13px] font-[600]">
              {error}
            </div>
          )}
          {activeNav === "fixture" && renderFixture()}
          {activeNav === "tournaments" && renderTournaments()}
          {activeNav === "teams" && renderTeams()}
        </>
      )}

      {newOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#050806] bg-opacity-80" onClick={() => setNewOpen(false)}></div>
          <div className="relative bg-prode-surface border border-prode-border rounded-[10px] w-full max-w-[480px] flex flex-col animate-fade-in shadow-2xl">
            <div className="p-5 border-b border-prode-border">
              <h2 className="font-display text-[20px] font-[900] uppercase">Nuevo Partido</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {modalError && (
                <div className="text-[13px] text-prode-error bg-prode-error-bg rounded-[4px] px-3 py-2">
                  {modalError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                    Local
                  </label>
                  <select
                    value={newMatch.homeTeamId}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, homeTeamId: e.target.value }))}
                    className="h-[44px] bg-prode-bg border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text"
                  >
                    <option value="">Elegir equipo</option>
                    {teamOptionsForLocal.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                    Visitante
                  </label>
                  <select
                    value={newMatch.awayTeamId}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, awayTeamId: e.target.value }))}
                    className="h-[44px] bg-prode-bg border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text"
                  >
                    <option value="">Elegir equipo</option>
                    {teamOptionsForVisitante.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                  Fecha y hora
                </label>
                <input
                  type="datetime-local"
                  value={newMatch.datetime}
                  onChange={(e) => setNewMatch((prev) => ({ ...prev, datetime: e.target.value }))}
                  className="h-[44px] bg-prode-bg border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                  Subdivisiones
                </label>
                <div className="flex flex-wrap gap-2">
                  {subdivisions.map((sub) => {
                    const checked = newMatch.subdivisionIds.includes(sub.id);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => toggleNewSubdivision(sub.id)}
                        className={`px-3 py-1.5 rounded-[4px] text-[13px] font-[800] flex items-center gap-2 transition-colors ${
                          checked ? "bg-prode-text text-prode-bg" : "bg-prode-elevated text-prode-text-muted"
                        }`}
                      >
                        {checked && <span>✓</span>}
                        <span>{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[12px] text-prode-text-muted mt-1">
                  Se crea un partido por cada subdivisión marcada.
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-prode-border bg-prode-elevated flex justify-end gap-3 rounded-b-[10px]">
              <button
                onClick={() => setNewOpen(false)}
                disabled={creating}
                className="h-[44px] px-6 text-[14px] font-[700] hover:bg-prode-surface-row rounded-[6px] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createNewMatch}
                disabled={creating}
                className="h-[44px] px-6 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 disabled:opacity-50"
              >
                {creating ? "Creando…" : "Crear partido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FixtureAdmin;

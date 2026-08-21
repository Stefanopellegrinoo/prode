import { useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import StatusBadge from "../components/fixture/StatusBadge";

// Mocks
const TEAMS = [
  { id: "CAS", name: "CASI" },
  { id: "SIC", name: "SIC" },
  { id: "HIN", name: "Hindú" },
  { id: "CUB", name: "CUBA" },
  { id: "NEW", name: "Newman" },
  { id: "ALU", name: "Alumni" },
  { id: "BEL", name: "Belgrano" },
  { id: "REG", name: "Regatas" },
  { id: "PUC", name: "Pucará" },
  { id: "SLU", name: "San Luis" },
  { id: "ROS", name: "Rosario" },
  { id: "TAL", name: "Tala" },
];

const INITIAL_FIXTURE = [
  {
    id: "m1",
    time: "15:30",
    home: "CASI",
    away: "SIC",
    stadium: "La Catedral",
    result: "—",
    status: "scheduled",
    badge: null,
  },
  {
    id: "m2",
    time: "15:30",
    home: "Hindú",
    away: "CUBA",
    stadium: "Don Bosco",
    result: "17–12",
    status: "live",
    badge: "live",
  },
  {
    id: "m3",
    time: "15:30",
    home: "Newman",
    away: "Alumni",
    stadium: "Benavídez",
    result: "31–22",
    status: "finished",
    badge: "saved",
  },
];

const FixtureAdmin = () => {
  const [activeNav, setActiveNav] = useState("fixture");
  const [activeTab, setActiveTab] = useState("primera");
  const [editingId, setEditingId] = useState(null);
  const [newOpen, setNewOpen] = useState(false);

  const TABS = ["Primera", "Intermedia", "Pre A", "Pre B", "Pre C"];

  const renderFixture = () => (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-6 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
            Fixture · Fecha 12
          </h1>
          <div className="text-[15px] font-[600] text-prode-text-muted">
            URBA Top 12 · sáb 22 ago · 17 partidos en 5 subdivisiones
          </div>
        </div>
        <div className="flex gap-3">
          <button className="h-[44px] px-4 border border-prode-border-control rounded-[6px] text-[14px] font-[800] uppercase transition-colors hover:bg-prode-surface-row">
            Duplicar a las 5 subdivisiones
          </button>
          <button
            onClick={() => setNewOpen(true)}
            className="h-[44px] px-4 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 transition-opacity"
          >
            + Nuevo partido
          </button>
        </div>
      </div>

      <div className="px-8 pb-4 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded-full text-[14px] font-[700] transition-colors ${
              activeTab === tab.toLowerCase()
                ? "bg-prode-text text-prode-bg"
                : "bg-prode-elevated text-prode-text-muted hover:text-prode-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-8 pb-8 flex-1">
        <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-[820px] w-full">
              {/* Table Header */}
              <div className="grid grid-cols-[70px_1fr_130px_120px_170px] gap-[12px] px-5 py-[12px] border-b border-prode-border text-[11px] font-[800] uppercase tracking-[0.1em] text-prode-text-disabled bg-[#111714]">
                <div>Hora</div>
                <div>Partido</div>
                <div>Resultado</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>

              {/* Table Body */}
              {INITIAL_FIXTURE.map((m) => (
                <div
                  key={m.id}
                  className="grid grid-cols-[70px_1fr_130px_120px_170px] gap-[12px] px-5 py-3 border-b border-prode-border-divider items-center hover:bg-prode-surface-row transition-colors"
                >
                  <div className="font-display text-[15px] font-[800] tabular-nums">
                    {m.time}
                  </div>
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="text-[15px] font-[700] truncate">
                      {m.home} vs {m.away}
                    </div>
                    <div className="text-[13px] text-prode-text-muted truncate">
                      {m.stadium}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {editingId === m.id ? (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          className="w-[44px] h-[36px] bg-[#0B0F0D] border border-prode-border-control rounded-[4px] text-center font-display text-[16px] font-[800] tabular-nums outline-none focus:border-prode-text"
                        />
                        <input
                          type="number"
                          className="w-[44px] h-[36px] bg-[#0B0F0D] border border-prode-border-control rounded-[4px] text-center font-display text-[16px] font-[800] tabular-nums outline-none focus:border-prode-text"
                        />
                      </div>
                    ) : (
                      <div className="font-display text-[16px] font-[800] tabular-nums">
                        {m.result}
                      </div>
                    )}
                  </div>

                  <div>
                    {m.status === "scheduled" ? (
                      <StatusBadge variant="unsaved" customLabel="Programado" />
                    ) : m.status === "live" ? (
                      <StatusBadge variant="live" />
                    ) : (
                      <StatusBadge variant="saved" customLabel="Finalizado" />
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === m.id ? (
                      <>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 h-[36px] bg-prode-success text-prode-bg rounded-[4px] text-[13px] font-[800] whitespace-nowrap"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 h-[36px] border border-prode-border-control rounded-[4px] text-[13px] font-[700] whitespace-nowrap"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingId(m.id)}
                        className="px-3 h-[36px] bg-prode-elevated rounded-[4px] text-[13px] font-[700] hover:brightness-110 transition-all whitespace-nowrap"
                      >
                        {m.result === "—" ? "Cargar resultado" : "Corregir"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-[#111714] text-[13px] text-prode-text-muted font-[600]">
            Nota: Al guardar un resultado se recalculan los puntos de todos los pronósticos de ese partido.
          </div>
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
          Torneos
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {/* Active Tournament */}
        <div className="bg-prode-surface border border-prode-border rounded-[10px] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="font-display text-[22px] font-[800] uppercase">
                URBA Top 12 — 2026
              </div>
              <div className="bg-prode-success-bg text-prode-success px-2 py-1 rounded-[4px] text-[12px] font-[800] uppercase tracking-[0.06em]">
                Activo
              </div>
            </div>
          </div>
          <div className="text-[14px] font-[600] text-prode-text-muted">
            5 subdivisiones · 12 equipos · fecha 12 de 22
          </div>
          <div className="border-t border-prode-border-divider pt-4 flex flex-col gap-2">
            {TABS.map((sub, i) => (
              <div key={i} className="flex justify-between items-center text-[14px] font-[600]">
                <span>{sub}</span>
                <div className="flex items-center gap-4 text-prode-text-muted">
                  <span>132 partidos</span>
                  <button className="text-prode-text hover:underline">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closed Tournament */}
        <div className="bg-prode-surface border border-prode-border rounded-[10px] p-5 flex flex-col gap-4 opacity-60">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="font-display text-[22px] font-[800] uppercase">
                URBA Top 12 — 2025
              </div>
              <div className="bg-prode-elevated text-prode-text-muted px-2 py-1 rounded-[4px] text-[12px] font-[800] uppercase tracking-[0.06em]">
                Cerrado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="p-8 flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <h1 className="font-display text-[28px] font-[900] uppercase tracking-[-0.01em] leading-none">
          Equipos
        </h1>
        <button className="h-[44px] px-4 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90 transition-opacity">
          + Nuevo equipo
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {TEAMS.map((t) => (
          <div key={t.id} className="bg-prode-surface border border-prode-border rounded-[8px] p-4 flex items-center gap-3">
            <div className="w-[40px] h-[40px] bg-prode-elevated rounded-[6px] flex items-center justify-center font-display text-[15px] font-[900] uppercase">
              {t.id}
            </div>
            <div className="flex-1 text-[15px] font-[700] truncate">
              {t.name}
            </div>
            <button className="text-[13px] font-[700] text-prode-text-muted hover:text-prode-text transition-colors">
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AdminLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {activeNav === "fixture" && renderFixture()}
      {activeNav === "tournaments" && renderTournaments()}
      {activeNav === "teams" && renderTeams()}

      {/* Modal Nuevo Partido */}
      {newOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#050806] bg-opacity-80" onClick={() => setNewOpen(false)}></div>
          <div className="relative bg-prode-surface border border-prode-border rounded-[10px] w-full max-w-[480px] flex flex-col animate-fade-in shadow-2xl">
            <div className="p-5 flex flex-col gap-1 border-b border-prode-border">
              <h2 className="font-display text-[20px] font-[900] uppercase">Nuevo Partido</h2>
              <p className="text-[14px] text-prode-text-muted">Completá los datos y seleccioná las subdivisiones donde aplica.</p>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">Local</label>
                  <select className="h-[44px] bg-[#0B0F0D] border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text">
                    {TEAMS.map(t => <option key={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">Visitante</label>
                  <select className="h-[44px] bg-[#0B0F0D] border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text">
                    <option>SIC</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">Fecha y hora</label>
                  <input type="datetime-local" className="h-[44px] bg-[#0B0F0D] border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">Estadio</label>
                  <input type="text" placeholder="Ej: La Catedral" className="h-[44px] bg-[#0B0F0D] border border-prode-border-control rounded-[6px] px-3 text-[14px] font-[600] outline-none focus:border-prode-text" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">Subdivisiones</label>
                <div className="flex flex-wrap gap-2">
                  {TABS.map(t => (
                    <div key={t} className="px-3 py-1.5 rounded-[4px] bg-prode-text text-prode-bg text-[13px] font-[800] flex items-center gap-2 cursor-pointer">
                      <span>✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[12px] text-prode-text-muted mt-1">Se crea un partido por cada subdivisión marcada.</div>
              </div>
            </div>
            <div className="p-5 border-t border-prode-border bg-[#111714] flex justify-end gap-3 rounded-b-[10px]">
              <button onClick={() => setNewOpen(false)} className="h-[44px] px-6 text-[14px] font-[700] hover:bg-[#1C2620] rounded-[6px] transition-colors">
                Cancelar
              </button>
              <button onClick={() => setNewOpen(false)} className="h-[44px] px-6 bg-prode-text text-prode-bg rounded-[6px] text-[14px] font-[800] uppercase hover:opacity-90">
                Crear partido
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FixtureAdmin;

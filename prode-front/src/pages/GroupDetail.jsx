import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import StatusBadge from "../components/fixture/StatusBadge";

const TABS = [
  { id: "primera", label: "Primera" },
  { id: "inter", label: "Inter" },
  { id: "preA", label: "Pre A" },
];

const INITIAL_ROWS = [
  { id: "u1", pos: 1, name: "Fede Martínez", pts: 268, delta: "+15", me: false },
  { id: "u2", pos: 2, name: "Mateo B. — vos", pts: 247, delta: "+9", me: true },
  { id: "u3", pos: 3, name: "Santi Pérez", pts: 240, delta: "+6", me: false },
  { id: "u4", pos: 4, name: "Nico Aguirre", pts: 219, delta: "+3", me: false },
];

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Using params to fit react-router
  
  const [activeTab, setActiveTab] = useState("primera");
  const [infoOpen, setInfoOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialog, setDialog] = useState(null); // { kind: 'leave' | 'remove', id?: string, name?: string }

  const handleCopy = () => {
    navigator.clipboard.writeText("RGB-7K42");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRemove = (rowId, rowName) => {
    setDialog({ kind: "remove", id: rowId, name: rowName });
  };

  const handleLeave = () => {
    setDialog({ kind: "leave" });
  };

  const myRow = INITIAL_ROWS.find(r => r.me);

  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col min-h-screen bg-prode-bg pb-[120px]">
        {/* Header */}
        <div className="pt-[14px] px-4 flex flex-col gap-[14px] border-b border-prode-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate("/groups")}
                className="w-[38px] h-[38px] rounded-[6px] bg-prode-elevated flex items-center justify-center text-prode-text hover:bg-prode-surface-row transition-colors shrink-0"
              >
                ←
              </button>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2">
                  <div className="font-display text-[20px] font-[900] tracking-[-0.01em] uppercase leading-none">
                    Los del club
                  </div>
                  <StatusBadge variant="admin" />
                </div>
                <div className="text-[13px] font-[600] text-prode-text-muted">
                  14 miembros · creado por vos
                </div>
              </div>
            </div>
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className={`w-[38px] h-[38px] rounded-[6px] flex items-center justify-center font-display font-[900] transition-colors shrink-0 ${
                infoOpen
                  ? "bg-prode-text text-prode-bg"
                  : "bg-prode-elevated text-prode-text hover:bg-prode-surface-row"
              }`}
            >
              ⓘ
            </button>
          </div>

          <div className="flex gap-[2px] overflow-x-auto scrollbar-hide -mx-4 px-4 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-[11px] py-[7px] rounded-t-[5px] text-[13px] cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "font-[800] bg-prode-text text-prode-bg"
                    : "font-[600] text-prode-text-muted bg-prode-elevated"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        {infoOpen && (
          <div className="bg-prode-surface border-b border-prode-border p-4 flex flex-col gap-5 animate-slide-up origin-top">
            <div className="flex flex-col gap-1">
              <div className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                Premio en juego
              </div>
              <div className="text-[15px] font-[600]">
                El último puesto paga el asado de fin de año.
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted">
                Código de invitación
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-[44px] bg-[#141A16] border border-[#253029] rounded-[6px] px-3 flex items-center font-display text-[16px] font-[800] tracking-[0.2em] text-prode-text-muted">
                  RGB-7K42
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-4 h-[44px] rounded-[6px] text-[14px] font-[700] transition-colors ${
                    copied
                      ? "bg-prode-success-bg text-prode-success"
                      : "bg-prode-elevated text-prode-text hover:brightness-110"
                  }`}
                >
                  {copied ? "✓ Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-prode-border-divider">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`h-[44px] border rounded-[6px] text-[14px] font-[700] transition-colors ${
                  isEditing
                    ? "bg-prode-text text-prode-bg border-prode-text"
                    : "border-prode-border-control text-prode-text hover:bg-prode-surface-row"
                }`}
              >
                {isEditing ? "Terminar de administrar" : "Administrar grupo"}
              </button>
              <button
                onClick={handleLeave}
                className="h-[44px] border border-prode-error text-prode-error rounded-[6px] text-[14px] font-[700] hover:bg-prode-error-bg transition-colors"
              >
                Abandonar grupo
              </button>
            </div>
          </div>
        )}

        {/* Content Table */}
        <div className="p-4 flex flex-col gap-3">
          <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
            {/* Header */}
            <div
              className={`grid px-4 py-[10px] border-b border-prode-border text-[11px] font-[800] tracking-[0.1em] uppercase text-prode-text-disabled ${
                isEditing ? "grid-cols-[44px_1fr_62px_32px]" : "grid-cols-[44px_1fr_62px_56px]"
              }`}
            >
              <div>#</div>
              <div>Jugador</div>
              <div className="text-right">Pts</div>
              <div className="text-right">{isEditing ? "" : "Fecha"}</div>
            </div>

            {/* Rows */}
            {INITIAL_ROWS.map((r) => {
              const isTop3 = r.pos <= 3;
              return (
                <div
                  key={r.id}
                  className={`grid px-4 py-[12px] border-b border-prode-border-divider items-center ${
                    isEditing ? "grid-cols-[44px_1fr_62px_32px]" : "grid-cols-[44px_1fr_62px_56px]"
                  } ${r.me ? "bg-prode-elevated" : ""}`}
                >
                  <div
                    className={`font-display text-[15px] font-[900] tabular-nums ${
                      isTop3 ? "text-[#D8B54A]" : "text-prode-text"
                    }`}
                  >
                    {r.pos}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-[15px] font-[700] whitespace-nowrap overflow-hidden text-ellipsis">
                      {r.name}
                    </div>
                  </div>
                  <div className="text-right font-display text-[17px] font-[800] tabular-nums">
                    {r.pts}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex justify-end">
                      {!r.me && (
                        <button
                          onClick={() => handleRemove(r.id, r.name)}
                          className="w-[32px] h-[32px] rounded-[4px] bg-prode-error-bg text-prode-error flex items-center justify-center text-[16px] font-[900]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`text-right text-[13px] font-[800] tabular-nums ${
                        r.delta.startsWith("+")
                          ? "text-prode-success"
                          : "text-prode-text-disabled"
                      }`}
                    >
                      {r.delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed My Row */}
        {!isEditing && myRow && (
          <div className="fixed bottom-[24px] md:bottom-8 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <div className="w-full max-w-[430px] md:max-w-5xl bg-prode-text text-prode-bg rounded-[8px] p-3 px-4 grid grid-cols-[44px_1fr_62px_56px] items-center pointer-events-auto shadow-lg">
              <div className="font-display text-[16px] font-[900] tabular-nums">
                {myRow.pos}
              </div>
              <div className="flex flex-col">
                <div className="text-[15px] font-[800]">Mateo B. — vos</div>
                <div className="text-[12px] opacity-60 font-[600]">
                  a 21 pts del 1°
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

      {/* Dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-[#050806] bg-opacity-80"
            onClick={() => setDialog(null)}
          ></div>
          <div className="relative bg-prode-surface border border-prode-border rounded-[14px] w-full max-w-[360px] p-5 flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-2">
              <div className="font-display text-[18px] font-[900] uppercase tracking-[-0.01em]">
                {dialog.kind === "leave" ? "¿ABANDONAR EL GRUPO?" : `¿ELIMINAR A ${dialog.name.toUpperCase()}?`}
              </div>
              <div className="text-[15px] font-[600] text-prode-text-muted leading-snug">
                {dialog.kind === "leave" 
                  ? 'Salís de "Los del club". Tus puntos en el ranking general no se pierden, pero desaparecés de la tabla del grupo.'
                  : 'Sale del grupo y de su tabla. Puede volver a entrar con el código de invitación.'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDialog(null)}
                className="flex-1 h-[48px] bg-prode-elevated text-prode-text rounded-[6px] text-[15px] font-[800] uppercase"
              >
                {dialog.kind === "leave" ? "Quedarme" : "Cancelar"}
              </button>
              <button
                onClick={() => {
                  setDialog(null);
                  if (dialog.kind === "leave") navigate("/groups");
                }}
                className="flex-1 h-[48px] bg-prode-error text-white rounded-[6px] text-[15px] font-[800] uppercase"
              >
                {dialog.kind === "leave" ? "Abandonar" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default GroupDetail;

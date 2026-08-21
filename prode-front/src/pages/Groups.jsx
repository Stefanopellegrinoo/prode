import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import StatusBadge from "../components/fixture/StatusBadge";
import { getMyGroups, joinGroup, createGroup } from "../services/groupService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Groups = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getMyGroups();
      setGroupsData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleJoin = async () => {
    if (!joinCode) return;
    setJoining(true);
    setJoinError("");
    try {
      await joinGroup(joinCode);
      setJoinOpen(false);
      setJoinCode("");
      await fetchGroups();
    } catch (err) {
      setJoinError(err.message || "Error al unirse al grupo");
    } finally {
      setJoining(false);
    }
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      await createGroup({ name: createName.trim() });
      setCreateOpen(false);
      setCreateName("");
      await fetchGroups();
    } catch (err) {
      setCreateError(err.message || "Error al crear el grupo");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppLayout showBottomNav={true}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-4 pt-[18px] pb-5 flex flex-col gap-[14px]">
          <div className="flex items-center justify-between">
            <div className="font-display text-[24px] font-[900] tracking-[-0.01em] uppercase">
              Grupos
            </div>
            <div className="text-[14px] font-[600] text-prode-text-muted">
              Jugás en {groupsData.length} grupos
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setJoinOpen(true)}
              className="flex-1 h-[44px] border border-prode-border-control rounded-[6px] text-[15px] font-[800] uppercase tracking-[0.02em] hover:bg-prode-surface-row transition-colors"
            >
              Unirme
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex-1 h-[44px] bg-prode-text text-prode-bg rounded-[6px] text-[15px] font-[800] uppercase tracking-[0.02em] hover:opacity-90 transition-opacity"
            >
              + Crear
            </button>
          </div>
        </div>

        {/* Group Cards */}
        <div className="px-4 pb-[24px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {loading ? (
            <div className="flex justify-center pt-8 col-span-full"><LoadingSpinner /></div>
          ) : groupsData.length === 0 ? (
            <div className="text-center p-6 text-[15px] font-[600] text-prode-text-muted col-span-full">
              No estás en ningún grupo todavía.
            </div>
          ) : (
            groupsData.map((g) => {
              const isAdmin = g.adminId === currentUser?.id;
              // Safe fallback if top3 is missing from backend format
              const top3 = Array.isArray(g.ranking) ? g.ranking.slice(0,3) : [];
              const membersCount = g.membersCount || g._count?.users || g.users?.length || 0;
              const myRank = Array.isArray(g.ranking) ? g.ranking.findIndex(r => r.userId === currentUser?.id) + 1 : "-";

              return (
                <div
                  key={g.id}
                  className="bg-prode-surface border border-prode-border rounded-[10px] flex flex-col"
                >
                  <div className="p-4 flex flex-col gap-4 border-b border-prode-border-divider">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="font-display text-[19px] font-[800] uppercase leading-none mt-1">
                            {g.name}
                          </div>
                          {isAdmin && <StatusBadge variant="admin" />}
                        </div>
                        <div className="text-[13px] font-[600] text-prode-text-muted">
                          {membersCount} miembros
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0">
                        <div className="font-display text-[22px] font-[900] leading-none tabular-nums text-prode-text">
                          {myRank === 0 ? "-" : myRank}°
                        </div>
                        <div className="text-[12px] font-[700] text-prode-text-muted">
                          tu puesto
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {top3.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-[14px]"
                        >
                          <div
                            className={`w-[22px] h-[22px] rounded-[4px] flex items-center justify-center font-display text-[13px] font-[900] tabular-nums text-prode-bg ${
                              idx === 0
                                ? "bg-[#D8B54A]"
                                : idx === 1
                                ? "bg-[#98A399]"
                                : "bg-[#8A6D4A]"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div
                            className={`flex-1 font-[700] ${
                              t.userId === currentUser?.id ? "text-prode-text" : "text-prode-text-muted"
                            }`}
                          >
                            {t.User?.name || "Usuario"}
                          </div>
                          <div className="font-display text-[15px] font-[800] tabular-nums text-prode-text-muted">
                            {t.totalPoints || t.points || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex h-[48px]">
                    <button
                      onClick={() => handleCopy(g.id, g.inviteCode)}
                      className={`flex-1 flex items-center justify-center text-[14px] font-[700] border-r border-prode-border-divider transition-colors ${
                        copiedId === g.id
                          ? "text-prode-success bg-prode-success-bg"
                          : "text-prode-text-muted hover:bg-prode-surface-row"
                      }`}
                    >
                      {copiedId === g.id ? "✓ Código copiado" : "Copiar invitación"}
                    </button>
                    <button
                      onClick={() => navigate(`/groups/${g.id}`)}
                      className="flex-1 flex items-center justify-center text-[14px] font-[700] text-prode-text-muted hover:bg-prode-surface-row transition-colors"
                    >
                      Ver grupo →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Join Bottom Sheet */}
      {joinOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#050806] bg-opacity-80"
            onClick={() => setJoinOpen(false)}
          ></div>
          <div className="relative bg-prode-surface rounded-t-[14px] flex flex-col items-center pt-2 pb-8 px-4 animate-slide-up">
            <div className="w-[36px] h-[4px] bg-prode-border-control rounded-full mb-5"></div>
            <div className="w-full flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[6px]">
                <div className="font-display text-[20px] font-[900] uppercase tracking-[-0.01em]">
                  Unirme a un grupo
                </div>
                <div className="text-[15px] font-[600] text-prode-text-muted">
                  Pedile el código de invitación al admin del grupo.
                </div>
              </div>
              
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="RGB-····"
                className="w-full h-[56px] bg-prode-bg border border-prode-border-control rounded-[6px] px-4 font-display text-[20px] font-[800] tracking-[0.3em] uppercase text-prode-text placeholder:text-prode-text-disabled outline-none focus:border-prode-text transition-colors"
              />
              
              {joinError && (
                <div className="text-prode-error text-[14px] font-[600]">{joinError}</div>
              )}

              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full h-[56px] bg-prode-text text-prode-bg rounded-[6px] text-[16px] font-[800] uppercase hover:opacity-90 transition-opacity"
              >
                {joining ? "Entrando..." : "Entrar al grupo"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Bottom Sheet */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#050806] bg-opacity-80"
            onClick={() => setCreateOpen(false)}
          ></div>
          <div className="relative bg-prode-surface rounded-t-[14px] flex flex-col items-center pt-2 pb-8 px-4 animate-slide-up">
            <div className="w-[36px] h-[4px] bg-prode-border-control rounded-full mb-5"></div>
            <div className="w-full flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[6px]">
                <div className="font-display text-[20px] font-[900] uppercase tracking-[-0.01em]">
                  Crear un grupo
                </div>
                <div className="text-[15px] font-[600] text-prode-text-muted">
                  Dale un nombre a tu grupo. Luego vas a poder invitar a otros con el código.
                </div>
              </div>
              
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nombre del grupo..."
                className="w-full h-[56px] bg-prode-bg border border-prode-border-control rounded-[6px] px-4 text-[16px] font-[600] text-prode-text placeholder:text-prode-text-disabled outline-none focus:border-prode-text transition-colors"
              />
              
              {createError && (
                <div className="text-prode-error text-[14px] font-[600]">{createError}</div>
              )}

              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full h-[56px] bg-prode-text text-prode-bg rounded-[6px] text-[16px] font-[800] uppercase hover:opacity-90 transition-opacity"
              >
                {creating ? "Creando..." : "Crear grupo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Groups;

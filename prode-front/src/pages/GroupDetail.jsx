import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import SubdivisionTabs from "../components/fixture/SubdivisionTabs";
import RankingTable from "../components/ranking/RankingTable";
import GroupInfoPanel from "../components/groups/GroupInfoPanel";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { getGroupDetail, leaveGroup, removeUserFromGroup } from "../services/groupService";
import { pickCurrentTournament } from "../utils/tournament";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { showToast } = useAlert();

  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [activeSubId, setActiveSubId] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialog, setDialog] = useState(null); // { kind: 'leave' | 'remove', userId?, name? }
  const [dialogBusy, setDialogBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getGroupDetail(id)
      .then((data) => {
        if (cancelled) return;
        setGroupData(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "No pudimos cargar el grupo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const currentTournament = pickCurrentTournament(groupData?.tournaments || []);
  const subdivisions = currentTournament?.subdivisions || [];
  const currentSubId = activeSubId ?? subdivisions[0]?.id ?? null;
  const currentSub = subdivisions.find((s) => s.id === currentSubId) || subdivisions[0];

  // Every subdivision's `ranking` is built from the same group member list
  // (groupDetails.service.js#groupMembers), so any one of them gives the
  // real member count regardless of which tab is active.
  const memberCount = subdivisions[0]?.ranking?.length ?? 0;
  const isAdmin = groupData?.creator?.id === currentUser?.id;
  const grupoNuevo = memberCount === 1;

  const rankingRows = (currentSub?.ranking || []).map((r, i) => ({
    userId: r.userId,
    pos: i + 1,
    name: r.name || "Usuario",
    // No club field from the backend (same gap as Ranking, ADR-8) — @username instead of inventing one.
    sub: r.userName ? `@${r.userName}` : undefined,
    points: r.points,
  }));

  const handleCopy = () => {
    if (!groupData?.inviteCode) return;
    navigator.clipboard.writeText(groupData.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const closeDialog = () => setDialog(null);

  const confirmDialog = async () => {
    if (!dialog) return;
    setDialogBusy(true);
    try {
      if (dialog.kind === "leave") {
        await leaveGroup(id);
        navigate("/groups");
        return;
      }
      await removeUserFromGroup(id, dialog.userId);
      setReloadKey((k) => k + 1);
    } catch (err) {
      showToast(err.message || "No pudimos completar la acción.", "error");
    } finally {
      setDialogBusy(false);
      setDialog(null);
    }
  };

  if (loading) {
    return (
      <AppLayout width="narrow" showBottomNav={false}>
        <div className="flex justify-center pt-10">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !groupData) {
    return (
      <AppLayout width="narrow" showBottomNav={false}>
        <div className="px-4 text-center p-4 text-prode-error text-[14px] font-[600]">
          {error || "Grupo no encontrado."}
        </div>
      </AppLayout>
    );
  }

  const tabItems = subdivisions.map((s) => ({ id: s.id, name: s.name }));

  return (
    <AppLayout width="narrow" showBottomNav={false}>
      <div className="flex flex-col min-h-screen bg-prode-bg pb-8">
        <div className="pt-[14px] px-4 flex flex-col gap-[14px] border-b border-prode-border">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/groups")}
              className="w-[38px] h-[38px] rounded-[6px] bg-prode-elevated flex items-center justify-center text-prode-text hover:bg-prode-surface-row transition-colors shrink-0"
            >
              ←
            </button>
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-display text-[22px] font-[900] tracking-[-0.01em] uppercase leading-none truncate">
                  {groupData.groupName}
                </div>
                {isAdmin && (
                  <div className="h-[22px] px-[7px] rounded-[4px] bg-prode-elevated text-prode-text-muted text-[11px] font-[800] tracking-[0.08em] uppercase flex items-center shrink-0">
                    Admin
                  </div>
                )}
              </div>
              <div className="text-[14px] font-[600] text-prode-text-muted">
                {memberCount} {memberCount === 1 ? "miembro" : "miembros"} · creado por{" "}
                {isAdmin ? "vos" : groupData.creator?.name || "—"}
              </div>
            </div>
            <button
              onClick={() => setInfoOpen((v) => !v)}
              className={`w-[38px] h-[38px] rounded-[6px] flex items-center justify-center font-display font-[900] transition-colors shrink-0 ${
                infoOpen
                  ? "bg-prode-text text-prode-bg"
                  : "border border-prode-border-control text-prode-text-muted hover:bg-prode-surface-row"
              }`}
            >
              ⓘ
            </button>
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

        {infoOpen && (
          <GroupInfoPanel
            prize={groupData.groupDescription || "Este grupo todavía no definió un premio."}
            inviteCode={groupData.inviteCode}
            copied={copied}
            onCopy={handleCopy}
            isAdmin={isAdmin}
            editing={editing}
            onToggleEdit={() => setEditing((v) => !v)}
            onLeave={() => setDialog({ kind: "leave" })}
          />
        )}

        {grupoNuevo ? (
          <div className="p-4">
            <div className="bg-prode-surface border border-prode-border rounded-[10px] p-6 flex flex-col gap-[10px]">
              <div className="font-display text-[22px] font-[900] leading-[1.1] uppercase">
                Sos el único acá
              </div>
              <div className="text-[14px] leading-[1.5] text-prode-text-muted">
                Un prode de una persona es solo un fixture. Pasá el código:
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-[52px] bg-prode-elevated border border-dashed border-prode-border-control rounded-[6px] flex items-center justify-center font-display text-[20px] font-[800] tracking-[0.25em]">
                  {groupData.inviteCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-[52px] px-4 rounded-[6px] bg-prode-select-bg text-prode-select-fg text-[14px] font-[800]"
                >
                  {copied ? "✓ Copiado" : "Compartir"}
                </button>
              </div>
              <div className="text-[13px] text-prode-text-disabled">
                El ranking del grupo aparece cuando haya al menos 2 miembros.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            <RankingTable
              rows={rankingRows}
              meId={currentUser?.id}
              onRemove={editing ? (userId, name) => setDialog({ kind: "remove", userId, name }) : undefined}
              showDelta={false}
              podiumTiered
            />
            {editing && (
              <div className="text-[14px] text-prode-text-muted text-center">
                Modo administración: tocá ✕ para eliminar un miembro.
              </div>
            )}
          </div>
        )}
      </div>

      {dialog && (
        <ConfirmDialog
          title={dialog.kind === "leave" ? `¿Abandonar el grupo?` : `¿Eliminar a ${dialog.name}?`}
          message={
            dialog.kind === "leave"
              ? `Salís de "${groupData.groupName}". Tus puntos en el ranking general no se pierden, pero desaparecés de la tabla del grupo.`
              : "Sale del grupo y de su tabla. Puede volver a entrar con el código de invitación."
          }
          confirmLabel={dialogBusy ? "..." : dialog.kind === "leave" ? "Abandonar" : "Eliminar"}
          cancelLabel={dialog.kind === "leave" ? "Quedarme" : "Cancelar"}
          onConfirm={confirmDialog}
          onCancel={closeDialog}
        />
      )}
    </AppLayout>
  );
};

export default GroupDetail;

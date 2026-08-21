import { useEffect, useState } from "react";
import AppLayout from "../components/layouts/AppLayout";
import StatCard from "../components/ui/StatCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTournament } from "../context/TournamentContext";
import { getUserStats, updateUserProfile, updatePassword } from "../services/userService";
import { getTournamentRanking } from "../services/rankingService";
import { useToast } from "../hooks/useToast";

const InputLabel = ({ label }) => (
  <div className="text-[13px] font-[700] text-prode-text-muted mb-1">{label}</div>
);

const Profile = () => {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const { darkMode } = useTheme();
  const { tournament, subdivisions, loading: tournamentLoading } = useTournament();
  const { showToast, ToastContainer } = useToast();

  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const [savedPersonal, setSavedPersonal] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [passOpen, setPassOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const [stats, setStats] = useState([]);
  const [rankingRows, setRankingRows] = useState(null); // null = not fetched yet

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  useEffect(() => {
    getUserStats()
      .then((data) => setStats(data || []))
      .catch((err) => console.error("Error fetching stats for profile", err));
  }, []);

  // "Puntos"/"General"/"Efectividad" are scoped to the same reference
  // subdivision (subdivisions[0], typically Primera) — there's no backend
  // notion of a cross-category rank, and Perfil.dc.html's own numbers
  // (247 pts / #4 / 69%) are exactly the Ranking Primera-tab values for the
  // same demo user, confirming this is a single-category view, not an
  // invented aggregate across every subdivision the user plays.
  const primarySubId = subdivisions[0]?.id ?? null;

  useEffect(() => {
    if (!tournament?.id || !primarySubId) return;
    getTournamentRanking(primarySubId, tournament.id)
      .then((rows) => setRankingRows(rows || []))
      .catch(() => setRankingRows([]));
  }, [tournament?.id, primarySubId]);

  const primaryStats = stats
    .find((t) => t.id === tournament?.id)
    ?.subdivisions?.find((s) => s.id === primarySubId)?.stats;

  const myRankIndex = (rankingRows || []).findIndex((r) => r.user_id === currentUser?.id);
  const positionLabel = myRankIndex >= 0 ? `#${myRankIndex + 1}` : "—";
  const pointsValue = primaryStats?.totalPoints ?? 0;
  const accuracyValue = primaryStats ? `${primaryStats.accuracy}%` : "—";

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      // updateProfile only accepts name/email — username is display-only,
      // the backend has no route to change it (user.service.js#updateProfile).
      const { user: updated } = await updateUserProfile({ name, email });
      setCurrentUser((prev) => ({ ...prev, ...updated }));
      setSavedPersonal(true);
      setTimeout(() => setSavedPersonal(false), 1800);
    } catch (err) {
      showToast(err.message || "No pudimos guardar los datos.", "error");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast("Completá todos los campos.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden.", "error");
      return;
    }
    setSavingPass(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPassOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Contraseña actualizada con éxito.", "success");
    } catch (err) {
      showToast(err.message || "No pudimos cambiar la contraseña.", "error");
    } finally {
      setSavingPass(false);
    }
  };

  const initials = name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <AppLayout width="default">
      <div className="flex flex-col min-h-screen">
        <div className="px-4 pt-[18px] pb-5 flex items-center gap-[14px] border-b border-prode-border">
          <div className="w-[56px] h-[56px] rounded-[8px] bg-prode-elevated flex items-center justify-center font-display text-[20px] font-[900] text-prode-text-muted shrink-0">
            {initials}
          </div>
          <div className="flex flex-col gap-[1px] min-w-0">
            <div className="font-display text-[22px] font-[900] tracking-[-0.01em] uppercase truncate">
              {name}
            </div>
            <div className="text-[14px] text-prode-text-muted truncate">@{username}</div>
          </div>
        </div>

        {tournamentLoading ? (
          <div className="flex justify-center pt-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="p-4 grid grid-cols-3 gap-2 border-b border-prode-border">
            <StatCard value={pointsValue} label="puntos" />
            <StatCard value={positionLabel} label="general" />
            <StatCard value={accuracyValue} label="efectividad" tone="success" />
          </div>
        )}

        <div className={`p-4 flex flex-col gap-[10px] ${!darkMode ? "md:grid md:grid-cols-2 md:gap-4 md:items-start" : ""}`}>
          <div className="flex flex-col gap-[10px]">
            <div className="text-[12px] font-[800] uppercase tracking-[0.14em] text-prode-text-disabled px-[2px]">
              Datos de la cuenta
            </div>
            <form
              onSubmit={handleSavePersonal}
              className="bg-prode-surface border border-prode-border rounded-[10px] p-4 flex flex-col gap-[14px]"
            >
              <div>
                <InputLabel label="Nombre" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-focus transition-colors"
                />
              </div>
              <div>
                <InputLabel label="Usuario" />
                <input
                  type="text"
                  value={username}
                  disabled
                  className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] text-prode-text-disabled outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <InputLabel label="Email" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-focus transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={savingPersonal}
                className="w-full h-[52px] rounded-[6px] bg-prode-select-bg text-prode-select-fg text-[15px] font-[800] hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {savingPersonal ? "Guardando..." : savedPersonal ? "✓ Guardado" : "Guardar cambios"}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-[10px]">
            <div className="text-[12px] font-[800] uppercase tracking-[0.14em] text-prode-text-disabled px-[2px]">
              Seguridad
            </div>
            <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
              <button
                type="button"
                onClick={() => setPassOpen((v) => !v)}
                className="flex items-center justify-between w-full p-4 text-[15px] font-[700]"
              >
                <span>Cambiar contraseña</span>
                <span className="text-prode-text-disabled">{passOpen ? "▲" : "▼"}</span>
              </button>

              {passOpen && (
                <div className="px-4 pb-4 flex flex-col gap-[10px]">
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-focus transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Nueva contraseña (mín. 8)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-focus transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Repetir nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[52px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-focus transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleSavePassword}
                    disabled={savingPass}
                    className="w-full h-[52px] border border-prode-border-control rounded-[6px] text-[15px] font-[700] hover:bg-prode-surface-row transition-colors disabled:opacity-60"
                  >
                    {savingPass ? "Actualizando..." : "Actualizar contraseña"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="w-full h-[52px] border border-prode-error text-prode-error rounded-[6px] text-[15px] font-[700] hover:bg-prode-error-bg transition-colors mt-1"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  );
};

export default Profile;

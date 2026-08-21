import { useState, useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getUserStats, updateUserProfile, updatePassword } from "../services/userService";
import { useToast } from "../hooks/useToast";

const Profile = () => {
  const { currentUser, logout, setCurrentUser } = useAuth(); // useAuth provides currentUser in AuthContext
  const { showToast, ToastContainer } = useToast();
  
  // Account data
  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [club, setClub] = useState(currentUser?.club || "URBA");
  
  const [savedPersonal, setSavedPersonal] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  
  const [passOpen, setPassOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    // If user changes, update fields
    if (currentUser) {
      setName(currentUser.name || "");
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setClub(currentUser.club || "URBA");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats for profile", err);
      }
    };
    fetchStats();
  }, []);

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      const updated = await updateUserProfile({ name, username, email, club });
      setCurrentUser(updated); // Update context
      setSavedPersonal(true);
      setTimeout(() => setSavedPersonal(false), 1800);
      showToast("Datos actualizados correctamente", "success");
    } catch (err) {
      showToast(err.message || "Error al actualizar los datos", "error");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    if (!currentPassword || !newPassword) {
      showToast("Completá todos los campos", "error");
      return;
    }
    setSavingPass(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPassOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Contraseña actualizada con éxito", "success");
    } catch (err) {
      showToast(err.message || "Error al cambiar la contraseña", "error");
    } finally {
      setSavingPass(false);
    }
  };

  const initials = name ? name.substring(0,2).toUpperCase() : "MB";

  const InputLabel = ({ label }) => (
    <div className="text-[12px] font-[800] uppercase tracking-[0.1em] text-prode-text-muted mb-1">
      {label}
    </div>
  );

  return (
    <AppLayout showBottomNav={true}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-4 pt-[24px] pb-6 flex flex-col items-center gap-[12px] border-b border-prode-border text-center">
          <div className="w-[56px] h-[56px] rounded-[10px] bg-prode-elevated flex items-center justify-center text-[20px] font-[700] text-prode-text-muted">
            {initials}
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="font-display text-[22px] font-[900] tracking-[-0.01em] uppercase">
              {name}
            </div>
            <div className="text-[14px] font-[600] text-prode-text-muted">
              @{username} · {club}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-prode-border">
          <div className="bg-prode-surface border border-prode-border rounded-[8px] p-3 flex flex-col items-center gap-[2px]">
            <div className="font-display text-[24px] font-[900] tabular-nums">{stats?.totalPoints || 0}</div>
            <div className="text-[11px] font-[800] uppercase tracking-[0.06em] text-prode-text-muted">Puntos</div>
          </div>
          <div className="bg-prode-surface border border-prode-border rounded-[8px] p-3 flex flex-col items-center gap-[2px]">
            <div className="font-display text-[24px] font-[900] tabular-nums">#{stats?.rankingPosition || "-"}</div>
            <div className="text-[11px] font-[800] uppercase tracking-[0.06em] text-prode-text-muted">General</div>
          </div>
        </div>

        {/* Form Account */}
        <form onSubmit={handleSavePersonal} className="p-4 flex flex-col gap-4">
          <div className="font-display text-[17px] font-[800] uppercase tracking-[0.02em] mb-1">
            Datos de la cuenta
          </div>
          
          <div>
            <InputLabel label="Nombre completo" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
            />
          </div>
          <div>
            <InputLabel label="Usuario" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
            />
          </div>
          <div>
            <InputLabel label="Email" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={savingPersonal}
            className={`w-full h-[52px] rounded-[6px] text-[15px] font-[800] uppercase transition-colors mt-2 ${
              savedPersonal
                ? "bg-prode-success text-prode-bg"
                : "bg-prode-text text-prode-bg hover:opacity-90"
            }`}
          >
            {savingPersonal ? "Guardando..." : savedPersonal ? "✓ Guardado" : "Guardar cambios"}
          </button>
        </form>

        {/* Security Accordion */}
        <div className="p-4 flex flex-col gap-4 border-t border-prode-border border-b">
          <div className="font-display text-[17px] font-[800] uppercase tracking-[0.02em] mb-1">
            Seguridad
          </div>
          
          <button
            type="button"
            onClick={() => setPassOpen(!passOpen)}
            className="flex items-center justify-between w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] font-[700]"
          >
            <span>Cambiar contraseña</span>
            <span className="font-display font-[900] text-prode-text-muted">{passOpen ? "▲" : "▼"}</span>
          </button>

          {passOpen && (
            <div className="flex flex-col gap-4 animate-slide-up origin-top">
              <div>
                <InputLabel label="Contraseña actual" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
                />
              </div>
              <div>
                <InputLabel label="Nueva contraseña" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
                />
              </div>
              <div>
                <InputLabel label="Repetir nueva contraseña" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-[52px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[15px] outline-none focus:border-prode-text transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={savingPass}
                className="w-full h-[52px] border border-prode-border-control rounded-[6px] text-[15px] font-[800] uppercase hover:bg-prode-surface-row transition-colors mt-2"
              >
                {savingPass ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4 pt-6 pb-8">
          <button
            onClick={logout}
            className="w-full h-[52px] border border-prode-error text-prode-error rounded-[6px] text-[15px] font-[800] uppercase hover:bg-prode-error-bg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <ToastContainer />
    </AppLayout>
  );
};

export default Profile;

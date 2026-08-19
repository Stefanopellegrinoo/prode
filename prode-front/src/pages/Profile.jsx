import { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/form/InputField";
import { User, Mail, Key, Award, Shield } from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getUserStats,
} from "../services/userService";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UserStatsCard from "../components/dashboard/UserStatsCard";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [stats, setStats] = useState(null);
  const { showToast, ToastContainer } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [st, data ] = await Promise.all([getUserStats(), getUserProfile()])
        // const st = await getUserStats();
        // const data = await getUserProfile();

        setProfileData({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          avatar: data.avatar || "",
        });
        setStats(st);
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Error al cargar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showToast]);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Ingrese un email válido";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });

    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors({ ...profileErrors, [name]: "" });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    try {
      setSavingProfile(true);
      await updateUserProfile(profileData);
      showToast("Perfil actualizado correctamente", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.message || "Error al actualizar el perfil", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    try {
      setSavingPassword(true);
      await updatePassword(passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Contraseña actualizada correctamente", "success");
    } catch (error) {
      console.error("Error updating password:", error);
      showToast(error.message || "Error al actualizar la contraseña", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Mi Perfil">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Información Personal"
            icon={<User className="h-5 w-5" />}
          >
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <div className="w-full">
                    <InputField
                      label="Nombre"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      error={profileErrors.name}
                      disabled={true}
                      
                    />
                  </div>
                  <div className="w-full mt-2">
                    <InputField
                      label="Nombre de usuario"
                      name="name"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      error={profileErrors.username}
                      disabled={true}
                      
                    />
                  </div>
                </div>
                <div className="w-full">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={profileErrors.email}
                    disabled={!currentUser?.isAdmin} // Only admins can change email
                    
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={savingProfile}>
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Card>

          <Card
            title="Cambiar Contraseña"
            icon={<Key className="h-5 w-5" />}
            className="mt-6"
          >
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <InputField
                label="Contraseña Actual"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                required
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <InputField
                    label="Nueva Contraseña"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                    required
                  />
                </div>
                <div className="w-full">
                  <InputField
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={savingPassword}>
                  Actualizar Contraseña
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          {/* <Card title="Estadísticas" icon={<Award className="h-5 w-5" />}>
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Puntos Totales</span>
                  <span className="font-bold text-lg">{stats.totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Posición Global</span>
                  <span className="font-bold text-lg">#{stats.globalRank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronósticos Realizados</span>
                  <span className="font-bold text-lg">{stats.totalPredictions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pronósticos Acertados</span>
                  <span className="font-bold text-lg">{stats.correctPredictions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Precisión</span>
                  <span className="font-bold text-lg">{stats.accuracy}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No hay estadísticas disponibles
              </div>
            )}
          </Card> */}
          <UserStatsCard stats={stats} />
          {currentUser?.isAdmin && (
            <Card
              title="Administración"
              icon={<Shield className="h-5 w-5" />}
              className="mt-6"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tienes permisos de administrador en esta plataforma.
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => (window.location.href = "/admin/fixture")}
                >
                  Administrar Fixture
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => (window.location.href = "/admin/users")}
                >
                  Administrar Usuarios
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <ToastContainer />
    </DashboardLayout>
  );
};

export default Profile;

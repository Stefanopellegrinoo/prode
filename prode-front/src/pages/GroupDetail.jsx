import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Users, Trophy, Copy, LogOut, Settings } from "lucide-react";
import { getGroupDetail, leaveGroup, updateGroupDescription, removeUserFromGroup } from "../services/groupService";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/ui/EmptyState";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs"; // Ajusta la importación a tus componentes de Tabs
import { set } from "date-fns";

const GroupDetail = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState("");
  const [activeTabSubdivisions, setActiveTabSubdivisions] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [loadingB, setLoadingB] = useState(false);

  const [editing, setEditing] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (editing) {
      setEditedDescription(group.groupDescription);
    }
  }, [editing]);
  
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setLoading(true);
        const data = await getGroupDetail(id, 16, 1);

        setTournaments(data.tournaments);
        setActiveTab(data.tournaments[0]?.id || "");
        setActiveTabSubdivisions(data.tournaments[0].subdivisions[0].id);
        setUsers(data.tournaments[0].subdivisions[0].ranking);
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group detail:", error);
        showToast("Error al cargar los detalles del grupo", "error");
        navigate("/groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [id, navigate, showToast]);

  useEffect(() => {
    const tournament = tournaments.find((t) => t.id === activeTab);
    const subdivision = tournament?.subdivisions.find(
      (s) => s.id === activeTabSubdivisions
    );
    if (subdivision) {
      setUsers(subdivision.ranking);
    }
  }, [activeTab, activeTabSubdivisions, tournaments]);

  const handleCopyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      showToast("Código de invitación copiado al portapapeles", "success");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(id);
      showToast("Has abandonado el grupo", "success");
      navigate("/groups");
    } catch (error) {
      console.error("Error leaving group:", error);
      showToast("Error al abandonar el grupo", "error");
    } finally {
      setShowLeaveConfirm(false);
    }
  };

  const handleSaveDescription = async () => {
    try {
      setLoadingB(true)
      await updateGroupDescription(id, editedDescription); // ⚠️ este endpoint lo tenés que tener
      setGroup((prev) => ({ ...prev, groupDescription: editedDescription }));
      showToast("Descripción actualizada", "success");
    } catch (err) {
      showToast("Error al actualizar la descripción", "error");
    }finally{
      setLoadingB(false)
    }
  };
  
  const handleRemoveUser = async (userId) => {
    try {
      await removeUserFromGroup(id, userId); // ⚠️ este endpoint también debe existir
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      showToast("Usuario eliminado del grupo", "success");
    } catch (error) {
      console.error("Error removing user:", error);
      showToast("Error al eliminar usuario", "error");
    }
  };

  
  if (loading) {
    return (
      <DashboardLayout title="Detalle del Grupo">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!group) {
    return (
      <DashboardLayout title="Detalle del Grupo">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontró el grupo
          </p>
        </div>
      </DashboardLayout>
    );
  }
  const isAdmin = group?.creator?.id === currentUser?.id;

  const filteredUsers = users
    ?.map((u) => u)
    .filter((user) => {
      const userName = user.userName.toLowerCase();
      return userName.includes(searchTerm.toLowerCase());
    });
  return (
    <DashboardLayout title={group.groupName}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tournaments?.length === 0 ? (
            <EmptyState
              title="No hay torneos"
              description="Este torneo no tiene torneos configuradas."
            />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-2 w-full overflow-x-auto flex-nowrap">
                {tournaments?.map((t) => (
                  <TabsTrigger key={t.id} value={t.id}>
                    {t.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Tabs
                value={activeTabSubdivisions}
                onValueChange={setActiveTabSubdivisions}
                className="w-full"
              >
                <TabsList className=" w-full overflow-x-auto flex-nowrap">
                  {tournaments[0]?.subdivisions?.map((t) => (
                    <TabsTrigger key={t.id} value={t.id}>
                      {t.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              {tournaments?.map((sub) => {
                return (
                  <TabsContent
                    key={sub.id}
                    value={sub.id}
                    className="space-y-8"
                  >
                    <Card title="Ranking" icon={<Trophy className="h-5 w-5" />}>
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Posición
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Puntos
                                </th>
                                {editing && (
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Eliminar
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {filteredUsers.map((user, index) => (
                                <tr
                                  key={user.userId}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span
                                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                                          index === 0
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            : index === 1
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                            : index === 2
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        }`}
                                      >
                                        {index + 1}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                                        {user.userName.charAt(0)}
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium">
                                          {user.userName}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold">
                                      {user.points}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold">
                                      {currentUser?.id != user.userId &&
                                        editing && (
                                          <Button
                                          variant="danger"
                                          size="sm"
                                          className="text-xs"
                                          onClick={() => handleRemoveUser(user.userId)}
                                        >
                                          Eliminar
                                        </Button>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? "No se encontraron usuarios"
                            : "No hay usuarios en el ranking"}
                        </div>
                      )}
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>

        <div>
          <Card
            title="Información del Grupo"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="space-y-4">
              {!editing ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Descripcion:
                  </span>
                  <p className="font-bold"> {group.groupDescription}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Premio para el ganador del grupo"
                    rows="3"
                    className={`block w-full rounded-md shadow-sm sm:text-sm 
                    "border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                `}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Miembros
                </span>
                <span className="font-bold">{group.members?.length}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Creado por
                </span>
                <span className="font-medium">{group.creator?.name}</span>
              </div>

              {isAdmin && (
                <div className="mt-6">
                  <div className="mb-2 font-medium">Código de Invitación</div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md font-mono text-sm">
                      {group.inviteCode}
                    </div>
                    <button
                      onClick={handleCopyInviteCode}
                      className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark"
                      title="Copiar código"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Comparte este código para invitar a otros usuarios
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                {isAdmin ? (
           <Button
           variant="outline"
           fullWidth
           loading={loadingB}
           onClick={async () => {
             if (editing) {
               if (editedDescription !== group.groupDescription) {
                
                 await handleSaveDescription();
               }
             }
             setEditing(!editing);
           }}
  
         >
           <Settings className="h-4 w-4 mr-2" />
           {!editing ? "Administrar Grupo" : "Listo"}
         </Button>
         
                ) : (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowLeaveConfirm(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Abandonar Grupo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showLeaveConfirm && (
        <ConfirmDialog
          title="Abandonar Grupo"
          message={`¿Estás seguro de que deseas abandonar el grupo "${group.groupName}"?`}
          confirmLabel="Abandonar"
          cancelLabel="Cancelar"
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}

      <ToastContainer />
    </DashboardLayout>
  );
};

export default GroupDetail;

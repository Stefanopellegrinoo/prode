import { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import JoinGroupModal from "../components/groups/JoinGroupModal";
import { Users, Plus, LogIn } from "lucide-react";
import { getMyGroups } from "../services/groupService";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getTournaments } from "../services/tournamentService";

const Groups = () => {
  const { showToast, ToastContainer } = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await getTournaments();
        setTournaments(res);
      } catch (err) {
        showToast(err.response?.data?.message || "Error al cargar torneos");
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [showToast]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await getMyGroups();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        showToast("Error al cargar los grupos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [showToast]);

  const handleGroupCreated = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setShowCreateModal(false);
    showToast("Grupo creado correctamente", "success");
  };

  const handleGroupJoined = (joinedGroup) => {
    setGroups((prevGroups) => [...prevGroups, joinedGroup]);
    setShowJoinModal(false);
    showToast("Te has unido al grupo correctamente", "success");
  };

  return (
    <DashboardLayout title="Mis Grupos">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Participas en{" "}
            <span className="font-bold text-primary">{groups.length}</span>{" "}
            grupos
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>
            <LogIn className="h-4 w-4 mr-2" />
            Unirse a Grupo
          </Button>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Grupo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No participas en ningún grupo
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crea un grupo nuevo o únete a uno existente para competir con tus
              amigos
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => setShowJoinModal(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Unirse a Grupo
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Grupo
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={handleGroupCreated}
          tournaments={tournaments}
        />
      )}

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onGroupJoined={handleGroupJoined}
        />
      )}

      <ToastContainer />
    </DashboardLayout>
  );
};

export default Groups;

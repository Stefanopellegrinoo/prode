import api from "./authService";

export const getMyGroups = async () => {
  try {
    const response = await api.get("/groups");
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener los grupos"
    );
  }
};

export const getGroupDetail = async (id, tournamentId, subdivisionId) => {
  try {
    // const response = await api.get(`/ranking/group/${id}/${subdivisionId}/${tournamentId}`)
    const response = await api.get(`/groups/${id}/details`);

    return response.data;
  } catch (error) {
    console.error("Error fetching group detail:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener los detalles del grupo"
    );
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await api.post("/groups", groupData);
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error(error.response?.data?.message || "Error al crear el grupo");
  }
};

export const joinGroup = async (inviteCode) => {
  try {
    const response = await api.post("/groups/join", { inviteCode });
    return response.data;
  } catch (error) {
    console.error("Error joining group:", error);
    throw new Error(
      error.response?.data?.message || "Error al unirse al grupo"
    );
  }
};

export const leaveGroup = async (groupId) => {
  try {
    await api.post(`/groups/${groupId}/leave`);
    return true;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw new Error(
      error.response?.data?.message || "Error al abandonar el grupo"
    );
  }
};

export const getGroupRanking = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}/ranking`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group ranking:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener el ranking del grupo"
    );
  }
};
export const updateGroupDescription = async (groupId, description) => {
  try {
    const res = await api.put(`/groups/${groupId}/description`, {
      description,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching group ranking:", error);
    throw new Error(
      error.response?.data?.message ||
        "Error al modificar descripcion del grupo"
    );
  }
};

export const removeUserFromGroup = async (groupId, userId) => {
  try {
    const response = await api.delete(`/groups/${groupId}/users/${userId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching group ranking:", error);
    throw new Error(
      error.response?.data?.message || "Error al remover usuario del grupo"
    );
  }
};

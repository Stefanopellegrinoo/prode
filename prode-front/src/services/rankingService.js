import api from "./authService"

export const getGlobalRanking = async () => {
  try {
    const response = await api.get("/ranking/global")
    return response.data
  } catch (error) {
    console.error("Error fetching global ranking:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el ranking global")
  }
}

export const getGroupRanking = async (groupId) => {
  try {
    const response = await api.get(`/ranking/group/${groupId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching group ranking:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el ranking del grupo")
  }
}

export const getTournamentRanking = async (subdivisionId,tournamentId) => {
  try {
    const response = await api.get(`/ranking/subdivision/${subdivisionId}/tournament/${tournamentId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching tournament ranking:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el ranking del torneo")
  }
}

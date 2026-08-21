import api from "./authService"

// getGlobalRanking() removed (ADR-8 / F2.5): it hit `/ranking/global`, which
// doesn't exist in ranking.routes.js — a guaranteed 404. Ranking.jsx uses
// getTournamentRanking (per-subdivision, real endpoint) instead.

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

import api from "./authService"

export const getMatches = async () => {
  try {
    const response = await api.get("/matches")
    return response.data
  } catch (error) {
    console.error("Error fetching matches:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos")
  }
}

export const getMatchDetail = async (id) => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching match detail:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los detalles del partido")
  }
}

export const getUpcomingMatches = async (limit = 15) => {
  try {
    const response = await api.get(`/matches/upcoming/${limit}`)
    return response.data
  } catch (error) {
    console.error("Error fetching upcoming matches:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los próximos partidos")
  }
}

export const getRecentResults = async (limit = 5) => {
  try {
    const response = await api.get(`/matches/recent?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error("Error fetching recent results:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los resultados recientes")
  }
}

export const getMatchesForPrediction = async () => {
  try {
    const response = await api.get("/matches/for-prediction")
    return response.data
  } catch (error) {
    console.error("Error fetching matches for prediction:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos para pronóstico")
  }
}

export const createMatch = async (tournamentId, matchData) => {
  try {
    const response = await api.post(`/matches`, matchData);
    return response.data
  } catch (error) {
    console.error("Error creating match:", error.response?.data?.error )
    throw new Error(error.response?.data?.error || "Error al crear el partido")
  }
}

export const updateMatch = async (id, matchData) => {
  try {
    const match_id = matchData.id
    const response = await api.put(`/matches/${match_id}`, matchData)
    return response.data
  } catch (error) {
    console.error("Error updating match:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el partido")
  }
}

export const deleteMatch = async (id) => {
  try {
    await api.delete(`/matches/${id}`)
    return true
  } catch (error) {
    console.error("Error deleting match:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar el partido")
  }
}

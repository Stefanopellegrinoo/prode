import api from "./authService"

export const getTournaments = async () => {
  try {
    const response = await api.get("/tournament")
    return response.data
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los torneos")
  }
}

export const getTournamentById = async (id) => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching tournament:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el torneo")
  }
}

export const createTournament = async (tournamentData) => {
  try {
    const response = await api.post("/tournament", tournamentData)
    return response.data
  } catch (error) {
    console.error("Error creating tournament:", error)
    throw new Error(error.response?.data?.message || "Error al crear el torneo")
  }
}

export const updateTournament = async (id, tournamentData) => {
  try {
    const response = await api.put(`/tournament/${id}`, tournamentData)
    return response.data
  } catch (error) {
    console.error("Error updating tournament:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el torneo")
  }
}

export const deleteTournament = async (id) => {
  try {
    await api.delete(`/tournament/${id}`)
    return true
  } catch (error) {
    console.error("Error deleting tournament:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar el torneo")
  }
}

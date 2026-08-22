import api from "./authService"

export const getTeams = async () => {
  try {
    const response = await api.get("/teams")
    return response.data
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los equipos")
  }
}

export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/teams/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching team:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el equipo")
  }
}

export const getTeamsByTournament = async (tournamentId) => {
  try {
    const response = await api.get(`/teams/tournament/${tournamentId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching teams by tournament:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los equipos del torneo")
  }
}

export const createTeam = async (teamData) => {
  try {
    const response = await api.post("/teams", teamData)
    return response.data
  } catch (error) {
    console.error("Error creating team:", error)
    throw new Error(error.response?.data?.message || "Error al crear el equipo")
  }
}

export const updateTeam = async (id, teamData) => {
  try {
    const response = await api.put(`/teams/${id}`, teamData)
    return response.data
  } catch (error) {
    console.error("Error updating team:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el equipo")
  }
}

export const deleteTeam = async (id) => {
  try {
    await api.delete(`/teams/${id}`)
    return true
  } catch (error) {
    console.error("Error deleting team:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar el equipo")
  }
}

export const uploadTeamLogo = async (id, logoFile) => {
  try {


    const response = await api.post(`/teams/${id}/logo`, logoFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error uploading team logo:", error)
    throw new Error(error.response?.data?.message || "Error al subir el logo del equipo")
  }
}


export const getTeamsBySubdivision = async (subdivisionId) => {
  try {
    const response = await api.get(`/teams/subdivision/${subdivisionId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching teams by subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los equipos de la subdivision")
  }
}

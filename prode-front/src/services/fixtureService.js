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

export const getTeamsBySubdivision = async (subdivisionId) => {
  try {
    const response = await api.get(`/teams/subdivision/${subdivisionId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching teams by subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los equipos de la subdivisión")
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
    const formData = new FormData()
    formData.append("logo", logoFile)

    const response = await api.post(`/teams/${id}/logo`, formData, {
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


export const getFixturesByTournament = async (tournamentId) => {
  try {
    
    const response = await api.get(`/matches/tournament/${tournamentId}`)
  
    return response.data
  } catch (error) {
    console.error("Error fetching fixtures by tournament:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos del torneo")
  }
}

export const getGroupedFixture = async (tournamentId) => {
  try {
    const response = await api.get(`/fixture/grouped/tournament/${tournamentId}`)
  
    return response.data
  } catch (error) {
    console.error("Error fetching fixtures by tournament:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos del torneo")
  }
}

export const getGroupedFixturePredicts = async (tournamentId) => {
  try {
    const response = await api.get(`/matches/enriched/tournament/${tournamentId}`)
  
    return response.data
  } catch (error) {
    console.error("Error fetching fixtures by tournament:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos del torneo")
  }
}

export const getFixturesByTournamentAndSubdivision = async (tournamentId, subdivisionId) => {
  try {
    const response = await api.get(`/fixtures/tournament/${tournamentId}/subdivision/${subdivisionId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching fixtures by tournament and subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los partidos de la subdivisión")
  }
}

export const generateFixtures = async (data) => {
  try {
    const response = await api.post("/fixtures/generate", data)
    return response.data
  } catch (error) {
    console.error("Error generating fixtures:", error)
    throw new Error(error.response?.data?.message || "Error al generar el fixture")
  }
}

export const importFixtures = async (formData) => {
  try {
    const response = await api.post("/fixtures/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error importing fixtures:", error)
    throw new Error(error.response?.data?.message || "Error al importar el fixture")
  }
}

export const updateFixtureMatch = async (matchId, matchData) => {
  try {
    const response = await api.put(`/fixtures/match/${matchId}`, matchData)
    return response.data
  } catch (error) {
    console.error("Error updating fixture match:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el partido")
  }
}

export const addFixtureMatch = async (tournamentId, matchData) => {
  try {
    const response = await api.post(`/api/fixtures/tournament/${tournamentId}`, matchData);
    return response.data
  } catch (error) {
    console.error("Error updating fixture match:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el partido")
  }
}

export const deleteFixtureMatch = async (matchId) => {
  try {
    await api.delete(`/fixtures/match/${matchId}`)
    return true
  } catch (error) {
    console.error("Error deleting fixture match:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar el partido")
  }
}

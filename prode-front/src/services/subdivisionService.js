import api from "./authService"

export const getSubdivisions = async () => {
  try {
    const response = await api.get("/subdivisions")
    return response.data
  } catch (error) {
    console.error("Error fetching subdivisions:", error)
    throw new Error(error.response?.data?.message || "Error al obtener las subdivisiones")
  }
}

export const getSubdivisionById = async (id) => {
  try {
    const response = await api.get(`/subdivisions/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al obtener la subdivisión")
  }
}

export const getSubdivisionsByTeam = async (teamId) => {
  try {
    const response = await api.get(`/subdivisions/team/${teamId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching subdivisions by team:", error)
    throw new Error(error.response?.data?.message || "Error al obtener las subdivisiones del equipo")
  }
}

export const createSubdivision = async (subdivisionData) => {
  try {
    const response = await api.post("/subdivisions", subdivisionData)
    return response.data
  } catch (error) {
    console.error("Error creating subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al crear la subdivisión")
  }
}

export const updateSubdivision = async (id, subdivisionData) => {
  try {
    const response = await api.put(`/subdivisions/${id}`, subdivisionData)
    return response.data
  } catch (error) {
    console.error("Error updating subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar la subdivisión")
  }
}

export const deleteSubdivision = async (id) => {
  try {
    await api.delete(`/subdivisions/${id}`)
    return true
  } catch (error) {
    console.error("Error deleting subdivision:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar la subdivisión")
  }
}

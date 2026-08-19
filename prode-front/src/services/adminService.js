import api from "./authService"

export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw new Error(error.response?.data?.message || "Error al obtener las estadísticas")
  }
}

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching admin users:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los usuarios")
  }
}

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  } catch (error) {
    console.error("Error updating user role:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el rol del usuario")
  }
}

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/admin/users/${userId}`)
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error(error.response?.data?.message || "Error al eliminar el usuario")
  }
}

export const getSystemLogs = async (params = {}) => {
  try {
    const response = await api.get("/admin/logs", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching system logs:", error)
    throw new Error(error.response?.data?.message || "Error al obtener los registros del sistema")
  }
}

export const getSystemSettings = async () => {
  try {
    const response = await api.get("/admin/settings")
    return response.data
  } catch (error) {
    console.error("Error fetching system settings:", error)
    throw new Error(error.response?.data?.message || "Error al obtener la configuración del sistema")
  }
}

export const updateSystemSettings = async (settings) => {
  try {
    const response = await api.put("/admin/settings", settings)
    return response.data
  } catch (error) {
    console.error("Error updating system settings:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar la configuración del sistema")
  }
}

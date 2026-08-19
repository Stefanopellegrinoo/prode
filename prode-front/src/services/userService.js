import api from "./authService"

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw new Error(error.response?.data?.message || "Error al obtener el perfil")
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData)
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar el perfil")
  }
}

export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put("/users/password", passwordData)
    return response.data
  } catch (error) {
    console.error("Error updating password:", error)
    throw new Error(error.response?.data?.message || "Error al actualizar la contraseña")
  }
}

export const getUserStats = async () => {
  try {
    const response = await api.get("/users/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw new Error(error.response?.data?.message || "Error al obtener las estadísticas")
  }
}

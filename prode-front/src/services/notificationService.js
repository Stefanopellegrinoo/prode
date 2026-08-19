import api from "./authService"

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications")
    return response.data
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw new Error(error.response?.data?.message || "Error al obtener las notificaciones")
  }
}

export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error(error.response?.data?.message || "Error al marcar la notificación como leída")
  }
}

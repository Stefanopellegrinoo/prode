"use client"

import PropTypes from "prop-types"
import { Bell } from 'lucide-react'
import Card from "../ui/Card"
import LoadingSpinner from "../ui/LoadingSpinner"
import { formatDate } from "../../utils/dateUtils"
import { markNotificationAsRead } from "../../services/notificationService"

const NotificationsCard = ({ notifications, loading }) => {
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      // You would typically update the notifications state here
      // This would be handled by the parent component
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return (
    <Card title="Notificaciones" icon={<Bell className="h-5 w-5" />}>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-md ${
                notification.read
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              {!notification.read && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Marcar como leída
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No tienes notificaciones</div>
      )}
    </Card>
  )
}

NotificationsCard.propTypes = {
  notifications: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default NotificationsCard

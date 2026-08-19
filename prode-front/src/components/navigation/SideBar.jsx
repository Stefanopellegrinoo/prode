import PropTypes from "prop-types"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { Home, Calendar, Users, Award, User, Settings, LogOut, X } from "lucide-react"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { currentUser, logout, isAdmin } = useAuth()
  const { darkMode } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pronósticos", href: "/predictions", icon: Calendar },
    { name: "Grupos", href: "/groups", icon: Users },
    { name: "Ranking", href: "/ranking", icon: Award },
    { name: "Perfil", href: "/profile", icon: User },
  ]

  // Admin-only navigation items
  if (isAdmin) {
    navigation.push({ name: "Administrar Fixture", href: "/admin/fixture", icon: Settings })
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${darkMode ? "bg-gray-800" : "bg-white"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:static md:z-auto
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <img className="h-8 w-auto" src="/logo.svg" alt="Rugby Prode Logo" />
            <span className="ml-2 text-xl font-bold">Rugby Prode</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{currentUser?.name || "Usuario"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email || "usuario@ejemplo.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="px-4 py-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Sidebar

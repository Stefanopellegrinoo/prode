import PropTypes from "prop-types"
import { Menu, Bell } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import ThemeToggle from "../ui/ThemeToggle"

const Header = ({ title, onMenuClick }) => {
  const { currentUser } = useAuth()
  const { darkMode } = useTheme()

  return (
    <header
      className={`sticky top-0 z-10 flex-shrink-0 flex h-16 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-sm`}
    >
      <div className="flex-1 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            onClick={onMenuClick}
          >
            <span className="sr-only">Abrir menú</span>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="hidden md:block text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
           <ThemeToggle /> 

          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none relative"
          >
            <span className="sr-only">Ver notificaciones</span>
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              {currentUser?.name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  onMenuClick: PropTypes.func.isRequired,
}

export default Header

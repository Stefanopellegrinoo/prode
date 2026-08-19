import PropTypes from "prop-types"
import { useTheme } from "../../context/ThemeContext"
import ThemeToggle from "../ui/ThemeToggle"

const AuthLayout = ({ children, title }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
 <div className="absolute top-4 right-4">
  <ThemeToggle />
</div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img className="h-16 w-auto" src="/logo.svg" alt="Rugby Prode Logo" />
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {title}
          </h2>
        </div>
        <div className={`p-8 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>{children}</div>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export default AuthLayout

import { useTheme } from "../../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${
        darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      } transition-colors duration-200`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle

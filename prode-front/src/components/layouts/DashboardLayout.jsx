
import PropTypes from "prop-types"
import { useState } from "react"
import Header from "../navigation/Header"
import { useTheme } from "../../context/ThemeContext"
import Sidebar from "../navigation/SideBar"

const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { darkMode } = useTheme()

  return (
    <div
      className={`h-screen flex overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Sidebar for mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

export default DashboardLayout

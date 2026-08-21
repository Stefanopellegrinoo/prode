import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AdminLayout = ({ children, activeNav, onNavChange }) => {
  const navItems = [
    { id: "fixture", label: "Fixture y resultados" },
    { id: "tournaments", label: "Torneos" },
    { id: "teams", label: "Equipos" },
  ];

  return (
    <div className="min-h-screen bg-prode-bg text-prode-text font-body flex">
      {/* Sidebar 220px */}
      <div className="w-[220px] fixed inset-y-0 left-0 bg-[#131A16] border-r border-[#253029] flex flex-col pt-6 pb-6 px-4 z-10">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-[32px] h-[32px] bg-prode-text text-prode-bg rounded-[6px] flex items-center justify-center font-display text-[16px] font-[900] pt-[2px]">
            P
          </div>
          <div className="font-display text-[16px] font-[900] tracking-[-0.01em] uppercase">
            ADMIN
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex items-center h-[44px] px-3 rounded-[6px] text-[15px] font-[700] transition-colors ${
                activeNav === item.id
                  ? "bg-prode-text text-prode-bg"
                  : "text-[#98A399] hover:bg-[#1C2620] hover:text-prode-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-[#253029]">
          <Link
            to="/dashboard"
            className="flex items-center h-[44px] px-3 text-[14px] font-[700] text-[#98A399] hover:text-prode-text transition-colors"
          >
            ← Volver a la app
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] min-h-screen relative">
        {children}
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeNav: PropTypes.string.isRequired,
  onNavChange: PropTypes.func.isRequired,
};

export default AdminLayout;

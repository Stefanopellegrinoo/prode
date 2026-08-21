import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// No "Admin Light" prototype exists (Admin.dc.html is dark-only, desktop-only). Forcing
// `.dark` on this subtree keeps Admin dark regardless of the global ThemeContext toggle —
// same CSS-variable-cascade mechanism ADR-2 uses to force Landing light.
const AdminLayout = ({ children, activeNav, onNavChange }) => {
  const navItems = [
    { id: "fixture", label: "Fixture y resultados" },
    { id: "tournaments", label: "Torneos" },
    { id: "teams", label: "Equipos" },
  ];

  return (
    <div className="dark min-h-screen bg-prode-bg text-prode-text font-body flex">
      {/* Sidebar 220px */}
      <div className="w-[220px] fixed inset-y-0 left-0 bg-prode-surface border-r border-prode-border flex flex-col pt-5 pb-5 px-3 gap-6 z-10">
        <div className="flex items-center gap-[10px] px-2">
          <div className="w-[32px] h-[32px] bg-prode-text text-prode-bg rounded-[6px] flex items-center justify-center font-display text-[15px] font-[900] shrink-0">
            P
          </div>
          <div className="flex flex-col leading-tight">
            <div className="font-display text-[15px] font-[900] uppercase leading-[1.1]">
              Rugby Prode
            </div>
            <div className="text-[11px] font-[700] uppercase tracking-[0.1em] text-prode-text-disabled">
              Admin
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-[2px]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex items-center h-[44px] px-3 rounded-[6px] text-[14px] transition-colors text-left ${
                activeNav === item.id
                  ? "bg-prode-text text-prode-bg font-[800]"
                  : "text-prode-text-muted font-[600] hover:bg-prode-elevated hover:text-prode-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-[2px]">
          <Link
            to="/dashboard"
            className="flex items-center h-[44px] px-3 text-[14px] font-[600] text-prode-text-muted hover:text-prode-text transition-colors"
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

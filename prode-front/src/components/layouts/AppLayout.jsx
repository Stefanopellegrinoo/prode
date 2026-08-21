import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import BottomNav from "../navigation/BottomNav";
import { useAuth } from "../../context/AuthContext";

const DesktopNav = () => {
  const location = useLocation();
  const { logout, isAdmin } = useAuth();
  const path = location.pathname;

  const navItems = [
    { path: "/dashboard", label: "Inicio" },
    { path: "/predictions", label: "Pronósticos" },
    { path: "/ranking", label: "Ranking" },
    { path: "/groups", label: "Grupos" },
    { path: "/profile", label: "Perfil" },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin/fixture", label: "Admin" });
  }

  return (
    <div className="hidden md:flex w-full h-[72px] bg-prode-surface border-b border-prode-border items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-[32px] h-[32px] bg-prode-text text-prode-bg rounded-[6px] flex items-center justify-center font-display text-[16px] font-[900] pt-[2px]">
            P
          </div>
          <div className="font-display text-[20px] font-[900] tracking-[-0.01em] uppercase">
            Rugby Prode
          </div>
        </Link>
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const isActive = path.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-[6px] text-[14px] font-[700] transition-colors ${
                  isActive
                    ? "bg-prode-elevated text-prode-text"
                    : "text-prode-text-muted hover:bg-prode-surface-row hover:text-prode-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button 
        onClick={logout}
        className="px-4 py-2 border border-prode-border-control rounded-[6px] text-[13px] font-[700] hover:bg-prode-surface-row transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

const AppLayout = ({ children, showBottomNav = true }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-prode-bg text-prode-text font-body flex flex-col items-center">
      {isAuthenticated && showBottomNav && <DesktopNav />}
      {/* 
        Mobile: max-w-[430px] 
        Desktop: max-w-5xl (1024px)
      */}
      <div className="w-full max-w-[430px] md:max-w-5xl flex flex-col flex-1 pb-[88px] md:pb-8 relative">
        {children}
      </div>
      {isAuthenticated && showBottomNav && (
        <div className="md:hidden w-full max-w-[430px] fixed bottom-0 z-50">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showBottomNav: PropTypes.bool,
};

export default AppLayout;

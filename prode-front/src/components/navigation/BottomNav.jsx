import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Inicio" },
  { path: "/predictions", label: "Fixture" },
  { path: "/ranking", label: "Ranking" },
  { path: "/groups", label: "Grupos" },
  { path: "/profile", label: "Perfil" },
];

const BottomNav = ({ shellWidth = "max-w-[430px] md:max-w-[720px]" }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-prode-bg border-t border-prode-border">
      <div
        className={`w-full ${shellWidth} flex justify-between px-2 pt-2 pb-4`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 ${
                isActive ? "text-prode-text" : "text-prode-text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-[22px] h-[22px] rounded-[4px] ${
                    isActive
                      ? "bg-prode-select-bg"
                      : "border-2 border-prode-border-control"
                  }`}
                />
                <span
                  className={`text-[11px] uppercase tracking-wider ${
                    isActive ? "font-[800]" : "font-[700]"
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

BottomNav.propTypes = {
  shellWidth: PropTypes.string,
};

export default BottomNav;

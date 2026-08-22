import PropTypes from "prop-types";
import BottomNav from "../navigation/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { SHELL_WIDTH } from "./shellWidth";

const AppLayout = ({ children, showBottomNav = true, width = "default" }) => {
  const { isAuthenticated } = useAuth();
  const shellWidth = SHELL_WIDTH[width];
  const hasBottomNav = isAuthenticated && showBottomNav;

  return (
    <div className="min-h-screen bg-prode-bg text-prode-text font-body flex flex-col items-center">
      <div
        className={`w-full ${shellWidth} flex flex-col flex-1 ${
          hasBottomNav ? "pb-[88px]" : "pb-8"
        } relative`}
      >
        {children}
      </div>
      {hasBottomNav && <BottomNav shellWidth={shellWidth} />}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showBottomNav: PropTypes.bool,
  width: PropTypes.oneOf(["default", "wide"]),
};

export default AppLayout;

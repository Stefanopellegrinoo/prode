import PropTypes from "prop-types";
import BottomNav from "../navigation/BottomNav";
import { useAuth } from "../../context/AuthContext";

const SHELL_WIDTH = {
  default: "max-w-[430px] md:max-w-[720px]",
  wide: "max-w-[430px] md:max-w-[880px]",
};

const AppLayout = ({ children, showBottomNav = true, width = "default" }) => {
  const { isAuthenticated } = useAuth();
  const shellWidth = SHELL_WIDTH[width];

  return (
    <div className="min-h-screen bg-prode-bg text-prode-text font-body flex flex-col items-center">
      <div className={`w-full ${shellWidth} flex flex-col flex-1 pb-[88px] relative`}>
        {children}
      </div>
      {isAuthenticated && showBottomNav && (
        <div className={`w-full ${shellWidth} fixed bottom-0 z-50`}>
          <BottomNav />
        </div>
      )}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showBottomNav: PropTypes.bool,
  width: PropTypes.oneOf(["default", "wide"]),
};

export default AppLayout;

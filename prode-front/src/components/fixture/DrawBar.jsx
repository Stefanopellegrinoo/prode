import PropTypes from "prop-types";

const DrawBar = ({ isSelected, isLocked, onClick }) => {
  const baseClasses =
    "h-[44px] rounded-[6px] flex items-center justify-center text-[14px] font-[700] uppercase tracking-[0.06em] transition-colors duration-120 cursor-pointer w-full mt-[6px]";

  const lockedSelectedStyle = isLocked && isSelected
    ? { opacity: "var(--prode-plate-locked-selected-opacity)" }
    : undefined;

  let stateClasses = "";
  if (isLocked) {
    if (isSelected) {
      stateClasses = "bg-prode-text text-prode-bg cursor-default";
    } else {
      stateClasses =
        "bg-prode-plate-locked-bg text-prode-plate-locked-fg border border-prode-plate-locked-border cursor-default";
    }
  } else {
    if (isSelected) {
      stateClasses = "bg-prode-text text-prode-bg";
    } else {
      stateClasses = "bg-prode-elevated text-prode-text hover:brightness-110";
    }
  }

  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onClick}
      className={`${baseClasses} ${stateClasses}`}
      style={lockedSelectedStyle}
      disabled={isLocked}
    >
      Empate
    </button>
  );
};

DrawBar.propTypes = {
  isSelected: PropTypes.bool,
  isLocked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DrawBar;

import PropTypes from "prop-types";

const TeamPlate = ({ team, isSelected, isLocked, onClick }) => {
  const baseClasses =
    "flex-1 min-h-[88px] rounded-[6px] flex flex-col items-center justify-center gap-[3px] transition-colors duration-120 cursor-pointer";

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
      <div className="font-display text-[24px] font-[900] uppercase tracking-wide">
        {team.shortName}
      </div>
      <div className="text-[13px] font-[600] opacity-80">{team.name}</div>
    </button>
  );
};

TeamPlate.propTypes = {
  team: PropTypes.shape({
    shortName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  isLocked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default TeamPlate;

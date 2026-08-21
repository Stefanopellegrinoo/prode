import PropTypes from "prop-types";

// Horizontal scrollable tab row for subdivisions (Primera, Intermedia, ...).
// withCounter=false is used by Ranking/GroupDetail (no mini-chip); Fixture uses true.
const SubdivisionTabs = ({ items, activeId, onChange, withCounter = false }) => {
  return (
    <div className="flex gap-[2px] overflow-x-auto scrollbar-hide">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isComplete = withCounter && item.total > 0 && item.done === item.total;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`shrink-0 flex items-center gap-[7px] px-[13px] py-[11px] rounded-t-[6px] text-[15px] whitespace-nowrap cursor-pointer transition-colors ${
              isActive
                ? "font-[800] bg-prode-select-bg text-prode-select-fg"
                : "font-[600] text-prode-text-muted"
            }`}
          >
            {item.name}
            {withCounter && (
              <span
                className={`text-[11px] font-[800] tabular-nums px-[5px] py-[2px] rounded-[3px] ${
                  isActive
                    ? "bg-prode-bg text-prode-text"
                    : isComplete
                    ? "bg-prode-success-bg text-prode-success"
                    : "bg-prode-elevated text-prode-text-disabled"
                }`}
              >
                {item.done}/{item.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

SubdivisionTabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      done: PropTypes.number,
      total: PropTypes.number,
    })
  ).isRequired,
  activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  withCounter: PropTypes.bool,
};

export default SubdivisionTabs;

import PropTypes from "prop-types";

// Presentational only — no data logic, no timers. Pages decide when to
// render it and what `children`/`action` say (wired in F5).
const Banner = ({ tone = "neutral", action, children }) => {
  if (tone === "offline") {
    return (
      <div className="bg-[#0B0F0D] text-[#EDEFEA] rounded-[8px] px-[14px] py-3 flex items-center gap-[10px]">
        <div className="w-[8px] h-[8px] rounded-full bg-[#FFB020] shrink-0" />
        <div className="flex-1 text-[14px] font-[600] leading-[1.4]">{children}</div>
      </div>
    );
  }

  const isUrgent = tone === "urgent";

  return (
    <div className="bg-prode-surface border border-prode-border rounded-[8px] px-[14px] py-3 flex items-center gap-[10px]">
      <div className="flex-1 text-[14px] font-[600] leading-[1.4] text-prode-text-muted">
        {children}
      </div>
      {action &&
        (isUrgent ? (
          <button
            type="button"
            onClick={action.onClick}
            className="h-9 px-3 rounded-[5px] bg-prode-select-bg text-prode-select-fg text-[13px] font-[800] shrink-0"
          >
            {action.label}
          </button>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="text-[13px] font-[800] underline underline-offset-[3px] text-prode-text shrink-0"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
};

Banner.propTypes = {
  tone: PropTypes.oneOf(["neutral", "offline", "urgent"]),
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }),
  children: PropTypes.node,
};

export default Banner;

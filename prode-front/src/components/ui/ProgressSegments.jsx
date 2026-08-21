import PropTypes from "prop-types";

// Dashboard's action card progress bar — one segment per real match of the
// fecha (design/tasks call it "17 segments" because that's how many matches
// the demo tournament happened to have that day; the count is always the
// real total, never a hardcoded 17).
//
// Filled color uses the existing `--prode-success` token in both themes.
// The Light `.dc.html` hardcodes `#1F7A54` (brand green) instead of its own
// theme's `#166B47` success — a one-off inconsistent with the Dark file
// (which does use its success token, `#7BD8A8`). Reusing the semantic token
// here (same call as Predictions' save-flash, apply-progress Unit 4 note 6)
// beats adding a one-off hex just to chase that inconsistency.
const ProgressSegments = ({ total, filled }) => {
  if (total <= 0) return null;

  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-[6px] rounded-[2px] ${
            i < filled ? "bg-prode-success" : "bg-prode-elevated"
          }`}
        />
      ))}
    </div>
  );
};

ProgressSegments.propTypes = {
  total: PropTypes.number.isRequired,
  filled: PropTypes.number.isRequired,
};

export default ProgressSegments;

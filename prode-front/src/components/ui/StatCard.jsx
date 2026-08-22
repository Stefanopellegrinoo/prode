import PropTypes from "prop-types";

// Generic 2x2 stat tile — Dashboard "Tu campaña" and Perfil reuse this.
// `label` is the fully-composed string (e.g. "de 1.322 jugadores"); this
// component never builds copy from parts, callers own the real numbers.
const StatCard = ({ value, label, sub, tone = "default" }) => (
  <div className="bg-prode-surface border border-prode-border rounded-[10px] p-4 flex flex-col gap-1">
    <div
      className={`font-display text-[34px] font-[900] tabular-nums leading-none ${
        tone === "success" ? "text-prode-success" : "text-prode-text"
      }`}
    >
      {value}
    </div>
    <div className="text-[14px] font-[600] text-prode-text-muted">{label}</div>
    {sub && <div className="text-[12px] font-[600] text-prode-text-disabled">{sub}</div>}
  </div>
);

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  sub: PropTypes.string,
  tone: PropTypes.oneOf(["default", "success"]),
};

export default StatCard;

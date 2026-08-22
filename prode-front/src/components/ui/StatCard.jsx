import PropTypes from "prop-types";

// Generic 2x2 stat tile — Dashboard "Tu campaña" and Perfil reuse this.
// `label` is the fully-composed string (e.g. "de 1.322 jugadores"); this
// component never builds copy from parts, callers own the real numbers.
// `size` follows each prototype: Dashboard.dc.html uses 34px tiles, Perfil.dc.html 26px.
const StatCard = ({ value, label, sub, tone = "default", size = "lg" }) => (
  <div className="bg-prode-surface border border-prode-border rounded-[10px] p-4 flex flex-col gap-1">
    <div
      className={`font-display font-[900] tabular-nums leading-none ${
        size === "sm" ? "text-[26px]" : "text-[34px]"
      } ${tone === "success" ? "text-prode-success" : "text-prode-text"}`}
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
  size: PropTypes.oneOf(["lg", "sm"]),
};

export default StatCard;

import PropTypes from "prop-types";

const variants = {
  live: {
    classes: "bg-prode-live text-white",
    label: "● En vivo",
  },
  saved: {
    classes: "bg-prode-text text-prode-bg",
    label: "✓ Guardado",
  },
  unsaved: {
    classes: "bg-prode-elevated text-prode-text",
    label: "Sin guardar",
  },
  pending: {
    classes: "bg-prode-warning-bg text-prode-warning",
    label: "Pendiente de envío",
  },
  hit: {
    classes: "bg-prode-success-bg text-prode-success",
    label: "✓ +3 pts",
  },
  miss: {
    classes: "bg-prode-error-bg text-prode-error",
    label: "✕ 0 pts", // Derived from style although not explicitly listed in badge variants but matches hits
  },
  admin: {
    classes: "bg-prode-elevated text-prode-text",
    label: "Admin",
  },
  scheduled: {
    classes: "bg-prode-elevated text-prode-text-muted",
    label: "Programado",
  },
};

const StatusBadge = ({ variant, customLabel }) => {
  if (!variant || !variants[variant]) return null;

  const config = variants[variant];
  
  return (
    <div
      className={`h-[26px] px-[9px] rounded-[4px] text-[12px] font-[800] uppercase tracking-[0.06em] flex items-center shrink-0 ${config.classes}`}
    >
      {customLabel || config.label}
    </div>
  );
};

StatusBadge.propTypes = {
  variant: PropTypes.oneOf([
    "live",
    "saved",
    "unsaved",
    "pending",
    "hit",
    "miss",
    "admin",
    "scheduled",
  ]),
  customLabel: PropTypes.string,
};

export default StatusBadge;

import PropTypes from "prop-types";
import { SHELL_WIDTH } from "../layouts/shellWidth";

// Floating save action for the Fixture screen. Hidden entirely when there's
// nothing to save and no confirmation to show. Position mirrors BottomNav:
// fixed above the (always-visible, see F0/ADR-3) 88px bottom nav on every
// breakpoint, width matched to the page's shell via `shellWidth` (same pattern
// BottomNav already established for the same reason — fixed elements escape
// the shell's max-width flow).
const SaveBar = ({
  count,
  saving,
  flash,
  flashLabel = "✓ Pronósticos guardados",
  onSave,
  shellWidth = SHELL_WIDTH.wide,
}) => {
  if (count === 0 && !flash) return null;

  return (
    <div
      className={`fixed bottom-[88px] left-1/2 -translate-x-1/2 w-full ${shellWidth} pt-3 px-3 pb-5 z-30 bg-gradient-to-t from-prode-bg to-transparent pointer-events-none animate-slide-up`}
    >
      {flash ? (
        <div className="h-14 rounded-[8px] bg-prode-success-bg text-prode-success flex items-center justify-center text-[16px] font-[800]">
          {flashLabel}
        </div>
      ) : (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="pointer-events-auto w-full h-14 rounded-[8px] bg-prode-select-bg text-prode-select-fg flex items-center justify-center text-[16px] font-[800] disabled:opacity-60"
        >
          {saving ? "Guardando..." : `Guardar ${count} ${count === 1 ? "pronóstico" : "pronósticos"}`}
        </button>
      )}
    </div>
  );
};

SaveBar.propTypes = {
  count: PropTypes.number.isRequired,
  saving: PropTypes.bool,
  flash: PropTypes.bool,
  flashLabel: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  shellWidth: PropTypes.string,
};

export default SaveBar;

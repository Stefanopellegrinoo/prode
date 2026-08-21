import PropTypes from "prop-types";

// Info panel toggled by the header ⓘ button on GroupDetail. "Administrar"
// only renders for the group's creator — the backend already rejects a
// non-admin remove attempt, this just avoids offering a button that will
// always fail.
const GroupInfoPanel = ({ prize, inviteCode, copied, onCopy, isAdmin, editing, onToggleEdit, onLeave }) => (
  <div className="bg-prode-surface border-b border-prode-border p-4 flex flex-col gap-5">
    <div className="flex flex-col gap-1">
      <div className="text-[11px] font-[800] uppercase tracking-[0.1em] text-prode-text-disabled">Premio</div>
      <div className="text-[15px] font-[600] leading-[1.45]">{prize}</div>
    </div>

    <div className="flex flex-col gap-[6px]">
      <div className="text-[11px] font-[800] uppercase tracking-[0.1em] text-prode-text-disabled">
        Código de invitación
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-[48px] bg-prode-elevated border border-prode-border-control rounded-[6px] px-[14px] flex items-center font-display text-[18px] font-[800] tracking-[0.2em]">
          {inviteCode}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="h-[48px] px-4 rounded-[6px] bg-prode-select-bg text-prode-select-fg text-[14px] font-[800]"
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
    </div>

    <div className="flex gap-2 pt-2 border-t border-prode-border-divider">
      {isAdmin && (
        <button
          type="button"
          onClick={onToggleEdit}
          className={`flex-1 h-[44px] rounded-[6px] text-[14px] font-[700] transition-colors ${
            editing
              ? "bg-prode-text text-prode-bg"
              : "border border-prode-border-control text-prode-text hover:bg-prode-surface-row"
          }`}
        >
          {editing ? "Listo" : "Administrar"}
        </button>
      )}
      <button
        type="button"
        onClick={onLeave}
        className="flex-1 h-[44px] border border-prode-error text-prode-error rounded-[6px] text-[14px] font-[700] hover:bg-prode-error-bg transition-colors"
      >
        Abandonar grupo
      </button>
    </div>
  </div>
);

GroupInfoPanel.propTypes = {
  prize: PropTypes.string.isRequired,
  inviteCode: PropTypes.string,
  copied: PropTypes.bool,
  onCopy: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  editing: PropTypes.bool,
  onToggleEdit: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
};

export default GroupInfoPanel;

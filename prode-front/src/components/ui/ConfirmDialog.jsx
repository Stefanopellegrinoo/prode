import PropTypes from "prop-types";

const ConfirmDialog = ({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050806] bg-opacity-80 px-4">
      <div className="w-full max-w-[360px] bg-prode-surface border border-prode-border rounded-[10px] p-5 flex flex-col gap-2">
        <div className="font-display text-[20px] font-[900] uppercase leading-[1.1]">{title}</div>
        <p className="text-[14px] leading-[1.5] text-prode-text-muted">{message}</p>

        <div className="flex gap-2 pt-[6px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-[48px] rounded-[6px] border border-prode-border-control text-[14px] font-[700] hover:bg-prode-surface-row transition-colors"
          >
            {cancelLabel || "Cancelar"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-[48px] rounded-[6px] bg-prode-destructive-bg text-white text-[14px] font-[800] hover:opacity-90 transition-opacity"
          >
            {confirmLabel || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;

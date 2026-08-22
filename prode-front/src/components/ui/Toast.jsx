import PropTypes from "prop-types";

// Always solid black, regardless of theme — legible outdoors (handoff: "se lee al sol").
const Toast = ({ message, type, onRetry, onClose }) => {
  const isError = type === "error";

  return (
    <div className="bg-[#0B0F0D] text-[#EDEFEA] rounded-[8px] px-4 py-[14px] flex items-center gap-[10px] shadow-lg min-w-[280px] max-w-[360px]">
      {isError && (
        <div className="w-[8px] h-[8px] rounded-full bg-[#E88B8B] shrink-0" />
      )}
      <span className="flex-1 text-[15px] font-[700]">{message}</span>
      {isError && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="text-[14px] font-[800] underline underline-offset-[3px] shrink-0"
        >
          Reintentar
        </button>
      ) : (
        <button
          type="button"
          onClick={onClose}
          className="text-[16px] leading-none shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onRetry: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default Toast;

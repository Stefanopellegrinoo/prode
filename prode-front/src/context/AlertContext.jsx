import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import Toast from "../components/ui/Toast";

const AlertContext = createContext(null);

const TOAST_DURATION_MS = 3000;

export const AlertProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", options = {}) => {
      const id = ++nextId.current;
      setToasts((prev) => [...prev, { id, message, type, onRetry: options.onRetry }]);
      // Error toasts persist until the caller resolves them (retry/dismiss); the rest auto-dismiss.
      if (type !== "error") {
        setTimeout(() => hideToast(id), TOAST_DURATION_MS);
      }
      return id;
    },
    [hideToast]
  );

  return (
    <AlertContext.Provider value={{ showToast, hideToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast
                message={t.message}
                type={t.type}
                onRetry={t.onRetry}
                onClose={() => hideToast(t.id)}
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node,
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return ctx;
};

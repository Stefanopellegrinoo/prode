import { useAlert } from "../context/AlertContext";

// Retrocompat wrapper around AlertContext — the 17 existing call sites keep
// destructuring { showToast, hideToast, ToastContainer } unchanged.
// The single real toast portal now lives in AlertProvider (mounted once in
// App.jsx); ToastContainer is a no-op so per-page renders stay valid.
export const useToast = () => {
  const { showToast, hideToast } = useAlert();

  const ToastContainer = () => null;

  return { showToast, hideToast, ToastContainer };
};

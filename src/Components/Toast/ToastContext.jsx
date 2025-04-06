import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, duration + 300); // Ensure the toast disappears after the animation
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// context/ToastContext.jsx
import React, { createContext, useState, useCallback } from "react";
import ToastNotification from "components/modules/ToastNotification";

export const ToastContext = createContext();

let id = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "success", duration = 3000) => {
    const toastId = ++id;
    setToasts((prev) => [...prev, { id: toastId, message, type, duration }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => add(msg, "success", dur ?? 3000),
    error: (msg, dur) => add(msg, "error", dur ?? 3000),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => remove(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export { ToastProvider };

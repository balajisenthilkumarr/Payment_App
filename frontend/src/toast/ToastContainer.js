import React, { useState, useEffect } from "react";
import Toast from "./Toast";
import "./Toast.css";

const ToastContainer = ({ socket }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (socket) {
      socket.on("payment initiated", (message) => {
        addToast(message, "info");
      });

      socket.on("paymentCompleted", (message) => {
        addToast(message, "success");
      });

      socket.on("receiveMessage", (message) => {
        addToast(message, "success");
      });
    }

    return () => {
      if (socket) {
        socket.off("payment initiated");
        socket.off("paymentCompleted");
        socket.off("receiveMessage");
      }
    };
  }, [socket]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

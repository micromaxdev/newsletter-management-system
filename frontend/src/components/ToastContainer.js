import React from 'react';
import ToastNotification from './ToastNotification';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          notification={toast}
          onClose={() => onRemoveToast(toast.id)}
          duration={toast.duration || 5000}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

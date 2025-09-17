import React, { useEffect, useState } from 'react';
import { Mail, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './ToastNotification.css';

const ToastNotification = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show notification
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide notification
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    if (notification.type === 'new-email') {
      return <Mail className="toast-icon email" />;
    }
    
    switch (notification.level) {
      case 'error':
        return <AlertCircle className="toast-icon error" />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" />;
      case 'success':
        return <CheckCircle className="toast-icon success" />;
      default:
        return <Info className="toast-icon info" />;
    }
  };

  const getToastClass = () => {
    let baseClass = 'toast-notification';
    if (isVisible && !isLeaving) baseClass += ' visible';
    if (isLeaving) baseClass += ' leaving';
    if (notification.type === 'new-email') baseClass += ' email-toast';
    return baseClass;
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <div className="toast-icon-container">
          {getIcon()}
        </div>
        <div className="toast-message">
          <div className="toast-title">
            {notification.type === 'new-email' ? 'New Email' : 'Notification'}
          </div>
          <div className="toast-text">
            {notification.message}
          </div>
          {notification.email && (
            <div className="toast-email-preview">
              <strong>From:</strong> {notification.email.from?.name || notification.email.from?.address}
              <br />
              <strong>Subject:</strong> {notification.email.subject}
            </div>
          )}
        </div>
        <button className="toast-close" onClick={handleClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;

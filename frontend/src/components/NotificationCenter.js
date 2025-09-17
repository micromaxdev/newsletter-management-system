import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = ({ 
  notifications, 
  onMarkAsRead, 
  onClearAll,
  onEmailClick,
  isConnected 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type, level) => {
    if (type === 'new-email') return <Mail className="icon" />;
    if (type === 'system') {
      switch (level) {
        case 'error': return <AlertCircle className="icon error" />;
        case 'warning': return <AlertTriangle className="icon warning" />;
        case 'success': return <CheckCircle className="icon success" />;
        default: return <Info className="icon info" />;
      }
    }
    return <Info className="icon" />;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // If it's an email notification, open the email
    if (notification.type === 'new-email' && notification.email && onEmailClick) {
      onEmailClick(notification.email);
      setIsOpen(false); // Close the notification panel
    }
  };

  return (
    <div className="notification-center">
      {/* Notification Bell */}
      <div 
        className={`notification-bell ${!isConnected ? 'disconnected' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
        {!isConnected && (
          <div className="connection-indicator" title="WebSocket disconnected" />
        )}
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="header-actions">
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={onClearAll}
                >
                  Clear All
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell className="empty-icon" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type === 'new-email' ? 'clickable' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type, notification.level)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    {notification.email && (
                      <div className="email-preview">
                        <strong>From:</strong> {notification.email.from?.name || notification.email.from?.address}
                        <br />
                        <strong>Subject:</strong> {notification.email.subject}
                        {notification.type === 'new-email' && (
                          <div className="click-hint">Click to open email</div>
                        )}
                      </div>
                    )}
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && <div className="unread-indicator" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

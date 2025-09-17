import { useEffect, useState, useCallback } from 'react';
import socketService from '../services/socketService';

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [newEmails, setNewEmails] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Connect to WebSocket when hook is used
  useEffect(() => {
    // Only connect if not already connected
    if (!socketService.getConnectionStatus().connected) {
      socketService.connect();
    }

    // Listen for connection status
    const handleConnectionStatus = (data) => {
      setIsConnected(data.connected);
      if (data.connected) {
        setConnectionError(null);
      }
    };

    const handleConnectionError = (error) => {
      setConnectionError(error);
      setIsConnected(false);
    };

    // Listen for new emails
    const handleNewEmail = (data) => {
      console.log('New email received via WebSocket:', data);
      console.log('Email data:', data.email);
      console.log('Message:', data.message);
      
      setNewEmails(prev => {
        const updated = [data, ...prev];
        console.log('Updated newEmails array:', updated);
        return updated;
      });
      
      // Add notification
      const notification = {
        id: Date.now(),
        type: 'new-email',
        message: data.message,
        email: data.email,
        timestamp: data.timestamp,
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      // Add toast notification
      setToasts(prev => [{
        id: `toast-${Date.now()}`,
        ...notification,
        duration: 6000
      }, ...prev]);
    };

    // Listen for system notifications
    const handleSystemNotification = (data) => {
      console.log('System notification:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'system',
        message: data.message,
        level: data.level,
        data: data.data,
        timestamp: data.timestamp,
        read: false
      }, ...prev]);
    };

    // Set up event listeners
    socketService.on('connection-status', handleConnectionStatus);
    socketService.on('connection-error', handleConnectionError);
    socketService.on('new-email', handleNewEmail);
    socketService.on('system-notification', handleSystemNotification);

    // Cleanup on unmount
    return () => {
      socketService.off('connection-status', handleConnectionStatus);
      socketService.off('connection-error', handleConnectionError);
      socketService.off('new-email', handleNewEmail);
      socketService.off('system-notification', handleSystemNotification);
      
      // Only disconnect if this is the last component using the socket
      // In a real app, you might want to use a ref counter
      // For now, we'll keep the connection alive for the session
    };
  }, []);

  // Function to mark notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Function to clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Function to clear new emails
  const clearNewEmails = useCallback(() => {
    console.log('Clearing new emails array');
    setNewEmails([]);
  }, []);

  // Function to remove toast
  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  // Function to join user room
  const joinUserRoom = useCallback((userId) => {
    socketService.joinUserRoom(userId);
  }, []);

  // Function to leave user room
  const leaveUserRoom = useCallback((userId) => {
    socketService.leaveUserRoom(userId);
  }, []);

  return {
    isConnected,
    connectionError,
    newEmails,
    notifications,
    toasts,
    markNotificationAsRead,
    clearNotifications,
    clearNewEmails,
    removeToast,
    joinUserRoom,
    leaveUserRoom,
    socketService
  };
};

export default useWebSocket;

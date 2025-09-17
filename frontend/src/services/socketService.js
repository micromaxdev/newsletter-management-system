import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect() {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    if (this.socket && !this.isConnected) {
      console.log('Socket exists but not connected, reconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5007';
    this.socket = io(API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      this.isConnected = true;
      this.emit('connection-status', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
      this.isConnected = false;
      this.emit('connection-status', { connected: false });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 WebSocket connection error:', error);
      this.isConnected = false;
      this.emit('connection-error', error);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Listen for events
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }

    console.log(`🔔 Setting up listener for event: ${event}`);
    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Emit events to server
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socket: this.socket
    };
  }

  // Join user room (for user-specific notifications)
  joinUserRoom(userId) {
    this.emit('join-user-room', userId);
  }

  // Leave user room
  leaveUserRoom(userId) {
    this.emit('leave-user-room', userId);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

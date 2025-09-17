const socketIo = require('socket.io');

let io = null;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS.split(","),
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Make io available globally
  global.io = io;
  
  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};

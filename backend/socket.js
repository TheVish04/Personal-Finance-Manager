// backend/socket.js
const { Server } = require('socket.io');

let io;

/**
 * Initialize Socket.io with the given HTTP server.
 */
function initSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // or specify your frontend origin
    },
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
    });
  });
}

/**
 * Get the initialized Socket.io instance.
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initSocketIO, getIO };

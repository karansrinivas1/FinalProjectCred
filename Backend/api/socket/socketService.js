// socket/socketService.js
const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIo(server);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle events (you can send messages to the frontend via socket.emit)
    socket.on('sendMessage', (data) => {
      // Emit a message to all connected clients
      io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

const sendMessageToClients = (message) => {
  if (io) {
    io.emit('receiveMessage', message);
  }
};

module.exports = { initSocket, sendMessageToClients };

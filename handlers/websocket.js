const sharedSession = require('express-socket.io-session');
const session = require('./session');
const chatController = require('../controllers/chatController');
const { catchErrors } = require('./errorHandlers');

module.exports = io => {
  io.use(sharedSession(session));
  // Authentication
  io.use(catchErrors(chatController.getUser));

  io.on('connect', socket => {
    socket.on('room', room => {
      socket.join(room);

      socket.on('message', message => {
        socket.broadcast.to(room).emit('message', { from: socket.user, message });
      });
    });
  });

  // TODO: Handle unauthenticated requests
};

// const socket = require ('socket.io');
import http from 'http';
import { Server } from 'socket.io';

export default (http: http.Server) => {
  const io = new Server(http);

  io.on('connection', function(socket: any) {
    console.log('Connected!!!')
    socket.on('DIALOGS:JOIN', (dialogId: string) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
    });
    socket.on('DIALOGS:TYPING', (obj: any) => {
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
  });

  return io;
};

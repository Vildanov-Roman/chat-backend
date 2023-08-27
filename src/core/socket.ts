const socket = require ('socket.io');
import http from 'http';
import { Socket } from 'socket.io';

export default (http: http.Server) => {
  
  const io = socket(http);

  io.on('connection', function(socket: Socket) {
    console.log("connected!!!!");
  })

  // io.on('connection', function(socket: any) {
  //   socket.on('DIALOGS:JOIN', (dialogId: string) => {
  //     socket.dialogId = dialogId;
  //     socket.join(dialogId);
  //   });
  //   socket.on('DIALOGS:TYPING', (obj: any) => {
  //     socket.broadcast.emit('DIALOGS:TYPING', obj);
  //   });
  // });

  return io;
};
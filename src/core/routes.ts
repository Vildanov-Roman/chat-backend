import bodyParser from "body-parser";
import express from 'express';
import { Server as SocketServer, Socket } from "socket.io";
const cors = require('cors');

import {
  UserCtrl,
  DialogCtrl,
  MessageCtrl,
} from "../controllers";

import { updateLastSeen, checkAuth } from "../middlewares";

export default (app: express.Express, io: SocketServer) => {
  const UserController = new UserCtrl(io);
  const DialogController = new DialogCtrl(io);
  const MessageController = new MessageCtrl(io);

  app.use(cors());

  app.use(bodyParser.json());
  app.use(updateLastSeen);
  app.use(checkAuth);
  
  app.get("/user/me", UserController.getMe);
  app.get("/user/:id", UserController.show);
  app.delete("/user/:id", UserController.delete);
  app.post("/user/registration", UserController.create);
  app.post("/user/login", UserController.login);
  
  app.get("/dialogs", DialogController.index);
  app.post("/dialogs", DialogController.create);
  app.delete("/dialogs/:id", DialogController.delete);
  
  app.get("/messages", MessageController.index);
  app.post("/messages", MessageController.create);
  app.delete("/messages/:id", MessageController.delete);
}

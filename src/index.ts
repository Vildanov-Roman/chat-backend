const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const dotenv = require('dotenv')

const http = require('http');

import bodyParser from "body-parser";
import { UserController, DialogController, MessageController } from "./controllers";
import { updateLastSeen, checkAuth } from "./middlewares"

const User = new UserController();
const Dialog = new DialogController();
const Messages = new MessageController();

const app = express();
const server = http.createServer(app);
const io = socket(server);

dotenv.config();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err:any) => console.error("Error connecting to MongoDB:", err));


app.use(bodyParser.json());
app.use(updateLastSeen);
app.use(checkAuth)

app.get('/user/me', User.getMe);
app.get('/user/:id', User.show);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);
app.post('/user/login', User.login);

app.get('/dialogs', Dialog.index);
app.post('/dialogs', Dialog.create)
app.delete('/dialogs/:id', Dialog.delete)

app.get('/messages', Messages.index);
app.post('/messages', Messages.create);
app.delete('/messages/:id', Messages.delete)

io.on('connection', function(socket: any) {
    socket.emit("test command", "QWEQWEQWEQWEQWEQWEQWE")
    console.log("CONNECTED!!!!");
 });

 server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});

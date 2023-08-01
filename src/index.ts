const express = require('express');
const mongoose = require('mongoose');

import bodyParser from "body-parser";

import { UserController, DialogController, MessageController } from "./controllers";

import { updateLastSeen } from "./middlewares"

const User = new UserController();
const Dialog = new DialogController();
const Messages = new MessageController();

mongoose.connect('mongodb+srv://Roman:Ferrari1984!@chatprogect.3kommti.mongodb.net/Chat');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(updateLastSeen);

app.get('/user/:id', User.show);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);

app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs', Dialog.create)
app.delete('/dialogs/:id', Dialog.delete)

app.get('/messages', Messages.index);
app.post('/messages', Messages.create);
app.delete('/messages/:id', Messages.delete)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

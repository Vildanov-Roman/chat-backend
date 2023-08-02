const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

import bodyParser from "body-parser";

import { UserController, DialogController, MessageController } from "./controllers";

import { updateLastSeen } from "./middlewares"

const User = new UserController();
const Dialog = new DialogController();
const Messages = new MessageController();

const app = express();
dotenv.config();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err:any) => console.error("Error connecting to MongoDB:", err));


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

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});

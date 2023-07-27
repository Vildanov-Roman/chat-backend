const express = require('express');
const mongoose = require('mongoose');

import bodyParser from "body-parser";

import { UserController, DialogController } from "./controllers";

const User = new UserController();
const Dialog = new DialogController();

mongoose.connect('mongodb+srv://Roman:Ferrari1984!@chatprogect.3kommti.mongodb.net/Chat');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/user/:id', User.show);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);

app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs', Dialog.create)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');

import bodyParser from "body-parser";

import { UserController } from "./controllers";

const User = new UserController();

mongoose.connect('mongodb+srv://Roman:Ferrari1984!@chatprogect.3kommti.mongodb.net/Chat');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/user/:id', User.show)

app.delete('/user/:id', User.delete)

app.post('/user/registration', User.create);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

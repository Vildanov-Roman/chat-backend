import express from "express";
import mongoose from "mongoose";

import User from "./schemas/User";

const app = express()
const port = 8080

mongoose.connect('mongodb://127.0.0.1:27017/chat');

app.get('/', (req: any, res: any) => {
    res.send('Hello Vil!');
    const user = new User({ email: 'test@dom.com', fullname: 'Test User' });
    user.save().then(() => console.log('Knock Knock'));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

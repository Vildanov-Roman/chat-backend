import { createServer } from 'http';
import dotenv from "dotenv";
import express from "express";
// const cors = require("cors");

import "./core/db";
import createRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSocket(http);


dotenv.config();

createRoutes(app, io);

http.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

const mongoose = require("mongoose");

import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB_HOST, {
    promiseLibrary: global.Promise,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("Error connecting to MongoDB:", err));

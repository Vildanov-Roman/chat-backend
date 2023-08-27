const mongoose = require("mongoose");

import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => console.error("Error connecting to MongoDB:", err));

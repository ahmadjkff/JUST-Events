import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

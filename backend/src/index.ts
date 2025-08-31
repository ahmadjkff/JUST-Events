import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3001;

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce") // ecommerce the name of the db
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

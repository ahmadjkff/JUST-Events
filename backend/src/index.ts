import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import studentRouter from "./routes/studentRouter";
dotenv.config();

const app = express();
const port = 3002;
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

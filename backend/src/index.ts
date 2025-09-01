import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
import studentRouter from "./routes/studentRoute";
dotenv.config();

const app = express();
const port = 3002;
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.use("/user", userRoute);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

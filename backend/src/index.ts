import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute";
import adminRoute from "./routes/adminRoute";
import studentRoute from "./routes/studentRoute";
import supervisorRoute from "./routes/supervisorRoute";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/student", studentRoute);
app.use("/supervisor", supervisorRoute);
app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

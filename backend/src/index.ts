import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/authRoutes/userRoute";
import adminRoute from "./routes/authRoutes/adminRoute";
import studentRoute from "./routes/eventRoutes/studentRoute";
import supervisorRoute from "./routes/eventRoutes/supervisorRoute";
import eventAdminRoute from "./routes/eventRoutes/adminRoute";
import supervisorAndAdminRoute from "./routes/eventRoutes/supervisorAndAdminRoute";
import eventUserRoute from "./routes/eventRoutes/userRoute";
import notificationRoute from "./routes/notificationRoute";
import path from "path";
import aiRoute from "./routes/aiRoute";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if you need cookies
  })
);
const port = process.env.PORT;
app.use(express.json());
app.use("/eventsimage", express.static(path.join(__dirname, "eventsimage")));
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/event", eventUserRoute);
app.use("/student", studentRoute);
app.use("/supervisor", supervisorRoute);
app.use("/event/admin", eventAdminRoute);
app.use("/event/supervisor-admin", supervisorAndAdminRoute);
app.use("/notifications", notificationRoute);
app.use("/ai", aiRoute);

app.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

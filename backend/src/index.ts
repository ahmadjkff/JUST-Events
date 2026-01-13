import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import userRoute from "./routes/authRoutes/userRoute";
import adminRoute from "./routes/authRoutes/adminRoute";
import studentRoute from "./routes/eventRoutes/studentRoute";
import supervisorRoute from "./routes/eventRoutes/supervisorRoute";
import eventAdminRoute from "./routes/eventRoutes/adminRoute";
import supervisorAndAdminRoute from "./routes/eventRoutes/supervisorAndAdminRoute";
import eventUserRoute from "./routes/eventRoutes/userRoute";
import notificationRoute from "./routes/notificationRoute";
import adminDashboard from "./routes/adminDashboard";
import path from "path";
import aiRoute from "./routes/aiRoute";
import { initializeSocket } from "./services/socketService";
dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173" , "*"],
    credentials: true, 
  })
);
const port = process.env.PORT;
app.use(express.json());
app.use("/eventsimage", express.static(path.join(__dirname, "eventsimage")));
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Make io accessible to routes
app.set("io", io);

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/admin/dashboard", adminDashboard);
app.use("/event", eventUserRoute);
app.use("/student", studentRoute);
app.use("/supervisor", supervisorRoute);
app.use("/event/admin", eventAdminRoute);
app.use("/event/supervisor-admin", supervisorAndAdminRoute);
app.use("/notifications", notificationRoute);
app.use("/ai", aiRoute);

httpServer.listen(port, () => {
  console.log(`connected on port: ${port}`);
});

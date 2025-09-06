import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import adminRoute from "./routes/adminRoute";
import stagesRoute from "./routes/stagesRoute";

const app = express();
app.use(bodyParser.json());

const MONGOOSE_URI =
  "mongodb+srv://ahmadjkff1_db_user:0KUIcI6znOZkGYUa@cluster0.6dztitw.mongodb.net/justsimulator?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGOOSE_URI)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(`failed to connect mongoose ${err}`));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/stage", stagesRoute);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Simulator API running on http://localhost:${PORT}`)
);

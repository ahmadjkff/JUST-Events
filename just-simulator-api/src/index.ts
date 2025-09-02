import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";

const app = express();
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Simulator API running on http://localhost:${PORT}`)
);

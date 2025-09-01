import express from "express";
import { login, register } from "../services/userService";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    return res.status(statusCode).send(data);
  } catch {
    return res.status(404).send("Somethin went Wrong");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });
    return res.status(statusCode).send(data);
  } catch {
    return res.status(404).send("Somethin went Wrong");
  }
});

export default router;

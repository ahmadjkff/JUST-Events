import express from "express";
import { login } from "../../services/authServices/userService";
import AppError from "../../types/AppError";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const data = await login(email, password);
    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully", data });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
});

export default router;

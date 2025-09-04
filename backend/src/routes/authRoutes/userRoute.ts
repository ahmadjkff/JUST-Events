import express from "express";
import { login } from "../../services/userService";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const { statusCode, data, message, success } = await login(email, password);
    return res.status(statusCode).json({ success, message, data });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
});

export default router;

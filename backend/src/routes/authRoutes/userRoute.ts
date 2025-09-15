import express from "express";
import { login } from "../../services/authServices/userService";
import AppError from "../../types/AppError";
import userModel from "../../models/userModel";
import validateJWT from "../../middlewares/validateJWT";
import NodeCache from "node-cache";
import { IExtendRequest } from "../../types/extendedRequest";

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

const cache = new NodeCache({ stdTTL: 600 });

router.get("/", validateJWT, async (req: IExtendRequest, res) => {
  try {
    const cacheKey = req.user._id.toString();
    const cachedUser = cache.get(cacheKey);

    if (cachedUser) {
      console.log("Returning cached user");
      return res.status(200).json({ success: true, user: cachedUser });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    cache.set(cacheKey, user);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("User route error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

import { Router } from "express";
import { users } from "../data/mockData";
import userModel from "../models/userModel";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({
      status: "error",
      statusCode: 401,
      message: "Invalid username or password",
    });
  }

  res.status(200).json({
    status: "success",
    statusCode: 200,
    user: {
      email: email,
      firstName: user.firstName,
      lastName: user.lastName,
      faculty: user.faculty,
      role: user.role,
      universityId: user.universityId,
    },
  });
});

router.post("/logout", (req, res) => {
  res.json({ status: "success", message: "Logged out successfully" });
});

export default router;

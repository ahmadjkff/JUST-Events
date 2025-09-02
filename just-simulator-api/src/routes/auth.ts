import { Router } from "express";
import { users } from "../data/mockData";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = users[email as keyof typeof users];

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
    },
  });
});

router.post("/logout", (req, res) => {
  res.json({ status: "success", message: "Logged out successfully" });
});

export default router;

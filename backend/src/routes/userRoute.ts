import jwt from "jsonwebtoken";
import express from "express";
import userModel from "../models/userModel";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the simulator API to validate credentials
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === "error") {
      return res.status(400).json(data.message);
    }

    // Find user in local DB
    let user = await userModel.findOne({ email });

    // create/update user in local DB
    if (user) {
      user.firstName = data.user.firstName;
      user.lastName = data.user.lastName;
      user.role = data.user.role;
      user.faculty = data.user.faculty;
      await user.save();
    } else {
      user = await userModel.create({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email,
        role: data.user.role,
        faculty: data.user.faculty,
      });
    }

    const token = generateJWT({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
    });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        faculty: user.faculty,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).send(`Something went wrong: ${error.message}`);
  }
});



const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

export default router;

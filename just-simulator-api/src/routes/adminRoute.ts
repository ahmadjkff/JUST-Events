import express from "express";
import { Roles } from "../types/Roles";
import userModel from "../models/userModel";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password, firstName, lastName, faculty, role } = req.body;
    if (!email || !password || !firstName || !lastName || !faculty || !role) {
      return res.status(400).json("All fields are required");
    }
    await userModel.create({
      email,
      password,
      firstName,
      lastName,
      faculty,
      role,
    });
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json(`Server error : ${error}`);
  }
});

router.put("/edit-role", async (req, res) => {
  try {
    const { email, newRole } = req.body;

    if (!email || !newRole) {
      return res.status(400).json("Email and newRole are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    if (!Object.values(Roles).includes(newRole)) {
      return res.status(400).json("Invalid role specified");
    }
    user.role = newRole;
    await user.save();

    res.status(200).json("User role updated successfully");
  } catch (error) {
    res.status(500).json(`Server error : ${error}`);
  }
});

export default router;

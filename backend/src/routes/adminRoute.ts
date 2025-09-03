import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isAdmin } from "../middlewares/validateUserRole";
import userModel from "../models/userModel";
import { Roles } from "../types/userTypes";

const router = express.Router();

router.get("/", validateJWT, isAdmin, async (req: IExtendRequest, res) => {
  const userId = req.user._id;
  res.status(201).send("Admin route");
});

router.put(
  "/edit-role",
  validateJWT,
  isAdmin,
  async (req: IExtendRequest, res) => {
    try {
      const { email, newRole } = req.body;

      if (!email || !newRole) {
        return res.status(400).json("Email and newRole are required");
      }

      if (!Object.values(Roles).includes(newRole)) {
        return res.status(400).json("Invalid role specified");
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Send to simulator
      const response = await fetch(
        "http://localhost:5000/api/admin/edit-role",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newRole }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .json(`Error from simulator: ${errorText}`);
      }

      // Update your DB only if simulator succeeded
      user.role = newRole;
      await user.save();

      res.status(200).json("User role updated successfully");
    } catch (error) {
      res.status(500).json(`Server error: ${error}`);
    }
  }
);

export default router;

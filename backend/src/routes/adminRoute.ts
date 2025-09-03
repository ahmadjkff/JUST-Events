import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isAdmin } from "../middlewares/validateUserRole";
import userModel from "../models/userModel";
import { Roles } from "../types/userTypes";
import { eventModel } from "../models/eventModel";

const router = express.Router();
// approve event by admin
router.put(
  "/events/:eventId/approve",
  validateJWT,
  isAdmin,
  async (req: IExtendRequest, res) => {
    const eventId = req.params.eventId;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    event.status = "approved";

    await event.save();

    res.status(200).json({
      message: "Event approved successfully",
      approveBy: req.user.firstName + " " + req.user.lastName,
      event,
    });
  }
);
// reject event by admin
router.put(
  "/events/:eventId/reject",
  validateJWT,
  isAdmin,
  async (req: IExtendRequest, res) => {
    const eventId = req.params.eventId;

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    event.status = "rejected";

    await event.save();

    res.status(200).json({
      message: "Event rejected successfully",
      rejectedBy: req.user.firstName + " " + req.user.lastName,
      event,
    });
  }
);

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

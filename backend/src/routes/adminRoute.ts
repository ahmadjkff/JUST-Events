import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isAdmin } from "../middlewares/validateUserRole";
import { eventModel } from "../models/eventModel";
import { editRole } from "../services/adminService";

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
      data: {
        message: "Event rejected successfully",
        rejectedBy: req.user.firstName + " " + req.user.lastName,
        event,
      },
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
      const { statusCode, data } = await editRole(email, newRole);
      res
        .status(statusCode)
        .json({ data: { message: data.message, user: data.user } });
    } catch (error) {
      res.status(500).json(`Server error: ${error}`);
    }
  }
);

export default router;

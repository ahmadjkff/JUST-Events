import express from "express";
import { EventStatus } from "../../types/eventTypes";
import validateJWT from "../../middlewares/validateJWT";
import { isAdmin } from "../../middlewares/validateUserRole";
import { getEventsByStatus } from "../../services/eventServices/userService";
import {
  addVolunteer,
  changeEventStatus,
} from "../../services/eventServices/adminService";

const router = express.Router();

router.get("/:status", validateJWT, isAdmin, async (req, res) => {
  try {
    const status = req.params.status;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status parameter is required" });
    }

    const { statusCode, data, message, success } =
      await getEventsByStatus(status);

    return res.status(statusCode).json({ message, success, data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error.message}` });
  }
});

router.put("/change-status", validateJWT, isAdmin, async (req, res) => {
  // to change (action and eventId) to req.body
  try {
    const { action, eventId } = req.body;

    if (!action || !eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Action and Event ID are required" });
    }
    const { statusCode, data, message, success } = await changeEventStatus(
      eventId,
      action as EventStatus
    );
    res.status(statusCode).json({ success, message, data });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: `Server error ${error.message}` });
  }
});

router.put("/add-volunteer", validateJWT, isAdmin, async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID and User ID are required" });
    }
    const { statusCode, data, message, success } = await addVolunteer(
      eventId,
      userId
    );
    res.status(statusCode).json({ success, message, data });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: `Server error ${error.message}` });
  }
});

export default router;

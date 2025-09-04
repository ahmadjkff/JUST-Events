import express from "express";
import { EventStatus } from "../../types/eventTypes";
import {
  addVolunteer,
  changeEventStatus,
  getEventsByStatus,
} from "../../services/eventService";
import validateJWT from "../../middlewares/validateJWT";
import { isAdmin } from "../../middlewares/validateUserRole";

const router = express.Router();

router.get("/:status", validateJWT, isAdmin, async (req, res) => {
  const status = req.params.status;

  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status parameter is required" });
  }

  const { statusCode, data } = await getEventsByStatus(status);

  return res.status(statusCode).json(data);
});

router.put("/:action/:eventId", validateJWT, isAdmin, async (req, res) => {
  try {
    const { action, eventId } = req.params;
    if (!action || !eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Action and Event ID are required" });
    }
    const { statusCode, data } = await changeEventStatus(
      eventId,
      action as EventStatus
    );
    res.status(statusCode).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    const { statusCode, data } = await addVolunteer(eventId, userId);
    res.status(statusCode).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;

import express from "express";
import { EventStatus } from "../../types/eventTypes";
import validateJWT from "../../middlewares/validateJWT";
import { isAdmin } from "../../middlewares/validateUserRole";
import { getEventsByStatus } from "../../services/eventServices/userService";
import {
  addVolunteer,
  changeEventStatus,
} from "../../services/eventServices/adminService";
import AppError from "../../types/AppError";

const router = express.Router();

router.get("/", validateJWT, async (req, res) => {
  try {
    const { status } = req.query;

    const events = await getEventsByStatus(status as string | undefined);

    return res.status(200).json({
      message: status
        ? `${status} events fetched successfully`
        : "All events fetched successfully",
      success: true,
      data: events,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Server error ${error.message}`,
    });
  }
});

router.put(
  "/change-status/:eventId",
  validateJWT,
  isAdmin,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { action } = req.body;

      if (!action || !eventId) {
        return res.status(400).json({
          success: false,
          message: "Action and Event ID are required",
        });
      }

      const data = await changeEventStatus(eventId, action);
      return res.status(200).json({
        success: true,
        message: `Event status changed to ${data.status}`,
        data,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res
        .status(500)
        .json({ success: false, message: `Server error ${error.message}` });
    }
  }
);

router.put(
  "/add-volunteer/:userId/:eventId",
  validateJWT,
  isAdmin,
  async (req, res) => {
    try {
      const { eventId, userId } = req.params;

      if (!eventId || !userId) {
        return res.status(400).json({
          success: false,
          message: "Event ID and User ID are required",
        });
      }

      const event = await addVolunteer(eventId, userId);
      return res.status(200).json({
        success: true,
        message: "Volunteer added successfully",
        data: { event },
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }
);

export default router;

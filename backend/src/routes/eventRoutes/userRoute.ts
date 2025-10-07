import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { getEventsByStatus } from "../../services/eventServices/userService";
import AppError from "../../types/AppError";
import { getSpecificEvent } from "../../services/eventServices/userService";
import eventModel from "../../models/eventModel";
import RegistrationModel from "../../models/registrationModel";

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

router.get("/:eventId", validateJWT, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    const { data, statusCode, success, message } =
      await getSpecificEvent(eventId);
    res.status(statusCode).json({ success, message, data });
  } catch (error: any) {
    res.status(500).json({ message: `Server error ${error.message}` });
  }
});

router.get("/registered-students/:eventId", validateJWT, async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }
    const event = await eventModel
      .findById(eventId)
      .populate("registeredStudents", "firstName lastName email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({
      success: true,
      message: "Registered students fetched",
      data: event.registeredStudents,
    });
  } catch (error: any) {
    res.status(500).json({ message: `Server error ${error.message}` });
  }
});

router.get(
  "/registration/:eventId/:studentId",
  validateJWT,
  async (req, res) => {
    try {
      const { eventId, studentId } = req.params;
      if (!eventId || !studentId) {
        return res
          .status(400)
          .json({ message: "eventId and studentId are required" });
      }
      const registration = await RegistrationModel.findOne({
        event: eventId,
        student: studentId,
      });
      if (!registration) {
        return res
          .status(404)
          .json({ message: "Registration not found", data: null });
      }
      res.status(200).json({
        success: true,
        message: "Registration fetched",
        data: registration,
      });
    } catch (error: any) {
      res.status(500).json({ message: `Server error ${error.message}` });
    }
  }
);

export default router;

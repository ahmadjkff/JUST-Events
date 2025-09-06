import express, { Request, Response } from "express";
import {
  generateCertificate,
  studentService,
} from "../../services/eventServices/studentService";
import eventModel from "../../models/eventModel";
import RegistrationModel from "../../models/registrationModel";
import userModel from "../../models/userModel";
import { IExtendRequest } from "../../types/extendedRequest";
import validateJWT from "../../middlewares/validateJWT";

const router = express.Router();

/**
 * Register for an event
 */

router.post("/register/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Event not found",
      });
    }

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    // Prevent duplicate registration
    const existing = await RegistrationModel.findOne({
      student: studentId,
      event: eventId,
    });
    if (existing) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Already registered for this event",
      });
    }

    const registration = await studentService.register(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registered successfully",
      data: registration,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Cancel event registration
 */
router.delete("/cancel/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    await studentService.cancel(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Volunteer for event
 */
router.post("/volunteer/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const updated = await studentService.volunteer(eventId, studentId);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Volunteer added successfully",
      data: updated,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ statusCode: 400, success: false, message: error.message });
  }
});

/**
 * Provide feedback
 */
router.post("/feedback/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId, rating, comment } = req.body;
    const { eventId } = req.params;

    if (!eventId || !studentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Missing eventId or studentId",
      });
    }

    const feedback = await studentService.feedback(
      eventId,
      studentId,
      rating,
      comment
    );

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ statusCode: 400, success: false, message: error.message });
  }
});

router.get(
  "/certificate/:eventId",
  validateJWT,
  async (req: IExtendRequest, res) => {
    const userId = req.user!._id; // from JWT
    const eventId = req.params.eventId;

    // Verify student participated in the event
    const event = await eventModel.findById(eventId);
    if (!event) {
      // || !event.registeredStudents.some((rs) => rs.student.equals(userId))
      return res
        .status(403)
        .json({ success: false, message: "Not eligible for certificate" });
    }

    const student = await userModel.findById(userId);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await generateCertificate(
      res,
      student.firstName + " " + student.lastName,
      event.title,
      event.date
    );
  }
);

export default router;

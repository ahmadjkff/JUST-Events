import express, { Request, Response } from "express";
import {
  generateCertificate,
  register,
  cancel,
  volunteer,
} from "../../services/eventServices/studentService";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
import { IExtendRequest } from "../../types/extendedRequest";
import validateJWT from "../../middlewares/validateJWT";

const router = express.Router();

/**
 * Register for an event
 */

// TO-DO : replace studentId with userId from JWT
router.post(
  "/register/:eventId/:studentId",
  async (req: Request, res: Response) => {
    try {
      const { eventId, studentId } = req.params;

      if (!eventId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId",
        });
      }

      const registration = await register(eventId, studentId);

      res.status(200).json({
        success: true,
        message: "Registered successfully",
        data: registration,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * Cancel event registration
 */
// TO-DO : replace studentId with userId from JWT
router.delete(
  "/cancel/:eventId/:studentId",
  async (req: Request, res: Response) => {
    try {
      const { eventId, studentId } = req.params;

      if (!eventId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId",
        });
      }

      await cancel(eventId, studentId);

      res.status(200).json({
        success: true,
        message: "Registration cancelled successfully",
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * Volunteer for event
 */

// TO-DO : replace studentId with userId from JWT
router.post(
  // To-Do: Check the event is approved before registration
  "/volunteer/:eventId/:studentId",
  async (req: Request, res: Response) => {
    try {
      const { eventId, studentId } = req.params;

      if (!eventId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId",
        });
      }

      const updated = await volunteer(eventId, studentId);

      res.status(200).json({
        success: true,
        message: "Volunteer added successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * Provide feedback
 */
// TO-DO : replace studentId with userId from JWT
router.post(
  "/feedback/:eventId/:studentId",
  async (req: Request, res: Response) => {
    try {
      const { rating, comment } = req.body;
      const { eventId, studentId } = req.params;

      if (!eventId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId",
        });
      }

      const event = await eventModel.findById(eventId);
      if (!event)
        return { message: "Event not found ", statusCode: 403, success: false };

      event.feedback.push({
        student: require("mongoose").Types.ObjectId(studentId),
        rating,
        comment: comment ? comment : "",
      });
      await event.save();
      res.status(200).json({
        success: true,
        message: "Feedback submitted successfully",
        data: event.feedback,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * get certificate
 */

router.get(
  "/certificate/:eventId",
  validateJWT,
  async (req: IExtendRequest, res) => {
    const userId = req.user!._id; // from JWT
    const eventId = req.params.eventId;

    // Verify student participated in the event
    const event = await eventModel.findById(eventId);
    if (!event) {
      // To-Do || !event.registeredStudents.some((rs) => rs.student.equals(userId))
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

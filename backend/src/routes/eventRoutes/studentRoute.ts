import express, { Request, Response } from "express";
import eventModel from "../../models/eventModel";
import RegistrationModel from "../../models/registration";
import { FeedbackModel } from "../../models/feedbackModel";
import { certificateModel } from "../../models/certificateModel";


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

    // Prevent duplicate registration
    const existing = await RegistrationModel.findOne({ student: studentId, event: eventId });
    if (existing) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Already registered for this event",
      });
    }

    const registration = await RegistrationModel.create({
      student: studentId,
      event: eventId,
      isVolunteer: false,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registered successfully",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
    });
  }
});

/**
 * Cancel event registration
 */
router.delete("/cancel/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    const deleted = await RegistrationModel.findOneAndDelete({
      student: studentId,
      event: eventId,
    });

    if (!deleted) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Registration not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
    });
  }
});

/**
 * Volunteer for event
 */
router.post("/volunteer/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    const registration = await RegistrationModel.findOneAndUpdate(
      { student: studentId, event: eventId },
      { isVolunteer: true },
      { new: true, upsert: true } // create if not exist
    );

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Volunteer added successfully",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
    });
  }
});

/**
 * Provide feedback
 */
router.post("/feedback/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId, rating, comment } = req.body;
    const { eventId } = req.params;

    const feedback = await FeedbackModel.create({
      student: studentId,
      event: eventId,
      rating,
      comment,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
    });
  }
});

/**
 * Download certificate
 */
router.get("/certificate/:eventId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const { eventId } = req.params;

    const certificate = await certificateModel.findOne({
      student: studentId,
      event: eventId,
    });

    if (!certificate) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Certificate retrieved successfully",
      data: certificate,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Server error",
    });
  }
});

export default router;

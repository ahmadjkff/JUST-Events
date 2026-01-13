import express, { Request, Response } from "express";
import {
  generateCertificate,
  register,
  cancel,
  volunteer,
} from "../../services/eventServices/studentService";
import eventModel, { IEvent } from "../../models/eventModel";
import userModel from "../../models/userModel";
import { IExtendRequest } from "../../types/extendedRequest";
import validateJWT from "../../middlewares/validateJWT";

import { EventStatus } from "../../types/eventTypes";
import { isStudentOrSupervisor } from "../../middlewares/validateUserRole";
import e from "express";

const router = express.Router();

//  Register for an event
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

// Get all events a student has registered for
router.get(
  "/my-events",
  validateJWT,
  async (req: IExtendRequest, res: Response) => {
    try {
      const studentId = req.user!._id;

      const events = await eventModel
        .find({
          status: EventStatus.APPROVED,
          registeredStudents: studentId,
        })
        .sort({ date: -1 }).lean();


      res.status(200).json({
        success: true,
        message: "Registered events fetched successfully",
        data: events,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// Cancel event registration
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

//   Volunteer for event
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

// Provide feedback
router.post(
  "/feedback/:eventId",
  validateJWT,
  isStudentOrSupervisor,
  async (req: IExtendRequest, res: Response) => {
    try {
      const { rating, comment } = req.body;
      const { eventId } = req.params;
      const studentId = req.user!._id;

      if (!eventId || !studentId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId",
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const event = await eventModel.findById(eventId);
      if (!event)
        return res
          .status(403)
          .json({ message: "Event not found", success: false });

      event.feedback.unshift({
        student: req.user!._id,
        rating,
        comment: comment || "",
      });
      await event.save();

      const populatedEvent = await eventModel
        .findById(eventId)
        .populate("feedback.student", "firstName lastName img");

      res.status(200).json({
        success: true,
        message: "Feedback submitted successfully",
        data: populatedEvent?.feedback,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

//
router.delete(
  "/feedback/:eventId/:feedbackId",
  validateJWT,
  isStudentOrSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const { eventId, feedbackId } = req.params;
      const studentId = req.user!._id;
      if (!eventId || !studentId || !feedbackId) {
        return res.status(400).json({
          success: false,
          message: "Missing eventId or studentId or feedbackId",
        });
      }
      const event = await eventModel.findById(eventId);
      if (!event)
        return res
          .status(403)
          .json({ message: "Event not found", success: false });

      const feedback = event.feedback.find((comment) => {
        return comment._id?.toString() === feedbackId;
      });
      if (!feedback)
        return res
          .status(404)
          .json({ message: "Feedback not found", success: false });
      if (
        feedback.student.toString() !== studentId.toString() &&
        event.createdBy.toString() !== studentId.toString()
      )
        return res.status(403).json({
          message: "Not authorized to delete this feedback",
          success: false,
        });

      event.feedback = event.feedback.filter(
        (comment) => comment._id?.toString() !== feedbackId
      );
      await event.save();

      const populatedEvent = await event.populate(
        "feedback.student",
        "firstName lastName img"
      );

      res.status(200).json({
        success: true,
        message: "Feedback deleted successfully",
        data: populatedEvent?.feedback,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// get All Certificates of a Student
router.get(
  "/certificates",
  validateJWT,
  async (req: IExtendRequest, res: Response) => {
    const studentId = req.user._id;
    try {
      const events = await eventModel.find({ status: EventStatus.APPROVED });

      const completedEvents = events?.filter((event: IEvent) => {
        if (!event.date) return false;
        return (
          event.registeredStudents.includes(studentId) &&
          event.date < new Date()
        );
      });

      res.status(200).json({
        success: true,
        message: "Certificates fetched successfully",
        data: completedEvents,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// get certificate
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

    const student = await userModel.findById(userId).lean();
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const supervisor = await userModel.findById(event.createdBy).lean();

    if (!supervisor) return;

    await generateCertificate(
      res,
      student.firstName + " " + student.lastName,
      event.title,
      event.date ?? new Date(),
      `${supervisor.firstName} ${supervisor.lastName}`
    );
  }
);

export default router;

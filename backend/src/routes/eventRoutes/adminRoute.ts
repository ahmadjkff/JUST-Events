import { IVolunteer } from "./../../../../frontend/src/types/eventTypes";
import express from "express";

import validateJWT from "../../middlewares/validateJWT";
import { isAdmin } from "../../middlewares/validateUserRole";

import {
  changeEventStatus,
  fetchVolunteers,
} from "../../services/eventServices/adminService";
import AppError from "../../types/AppError";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";

const router = express.Router();

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

router.get("/volunteers", validateJWT, isAdmin, async (req, res) => {
  try {
    // Assuming you have a function to fetch volunteers
    const volunteers = await fetchVolunteers(); // Implement this function as needed
    return res.status(200).json({
      success: true,
      message: " Volunteers fetched successfully",
      data: volunteers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

// router.put(
//   "/control-volunteer/:studentId/:eventId",
//   validateJWT,
//   isAdmin,
//   async (req, res, next) => {
//     try {
//       const { eventId, studentId } = req.params;
//       const { action } = req.body; // "assign" or "remove"

//       const event = await eventModel
//         .findById(eventId)
//         .populate("volunteers.student");
//       if (!event) throw new AppError("Event not found", 404);

//       const student = await userModel.findById(studentId);
//       if (!student) throw new AppError("Student not found", 404);

//       if (action === "assign") {
//         // mark as approved
//         const volunteer = event.volunteers.find(
//           (v: any) => v.student.toString() === studentId
//         );
//         if (volunteer) {
//           volunteer.status = "approved";
//         } else {
//           event.volunteers.push({ student: studentId, status: "approved" });
//         }
//       }

//       if (action === "remove") {
//         // mark as rejected
//         const volunteer = event.volunteers.find(
//           (v: any) => v.student.toString() === studentId
//         );
//         if (volunteer) {
//           volunteer.status = "rejected";
//         }
//       }

//       await event.save();
//       res.status(200).json({ success: true, data: event });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default router;

import express, { Router } from "express";
import validateJWT from "../../middlewares/validateJWT";
import { IExtendRequest } from "../../types/extendedRequest";
import { isSupervisor } from "../../middlewares/validateUserRole";
import {
  approveOrRejectStudentApplacition,
  createEvent,
  deleteEvent,
  editEvent,
  exportRegisteredStudent,
  getSupervisorAppliactions,
} from "../../services/eventServices/supervisorService";
import { EventStatus } from "../../types/eventTypes";

const router = express.Router();

// create new event and wait for admin response (rejected or approved)
router.post(
  "/",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const { title, description, location, department, category, date } =
        req.body;

      if (
        !title ||
        !description ||
        !location ||
        !department ||
        !category ||
        !date
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (title.length < 3) {
        return res
          .status(400)
          .json({ message: "Title must be at least 3 characters long" });
      }
      if (description.length < 10) {
        return res.status(400).json({
          message: "Description must be at least 10 characters long",
        });
      }

      const supervisorId = req.user._id;
      const { data, statusCode, message, success } = await createEvent({
        title,
        description,
        location,
        department,
        category,
        date,
        supervisorId,
      });
      res.status(statusCode).json({ success, message, data });
    } catch (error: any) {
      res.status(500).send(`Server error ${error.message}`);
    }
  }
);

//delete event
router.delete(
  "/:eventId",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const eventId = req.params.eventId;

      if (!eventId) {
        return res.status(400).json({ message: "EventId is required" });
      }

      const supervisorId = req.user._id;
      const { data, statusCode, message, success } = await deleteEvent({
        eventId,
        supervisorId,
      });
      res.status(statusCode).json({ success, message, data });
    } catch (error: any) {
      res.status(500).send(`Server error ${error.message}`);
    }
  }
);

//edit event
router.put(
  "/:eventId",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const { title, description, location, department, category, date } =
        req.body;
      const eventId = req.params.eventId;

      if (!eventId) {
        return res.status(400).json({ message: "EventId is required" });
      }

      const supervisorId = req.user._id;
      const { data, statusCode, message, success } = await editEvent({
        eventId,
        supervisorId,
        title,
        description,
        location,
        department,
        category,
        date,
      });
      res.status(statusCode).json({ success, message, data });
    } catch (error: any) {
      res.status(500).send(`Server error ${error.message}`);
    }
  }
);

router.put(
  "/:eventId/registration/:studentId",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const studentId = req.params.studentId;
      const eventId = req.params.eventId;
      const { action } = req.body; // approved or rejected
      const supervisorId = req.user._id;

      if (!studentId || !eventId) {
        return res
          .status(400)
          .json({ message: "eventId and studentId are required" });
      }
      if (!supervisorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!action) {
        res.status(401).json({ message: "event status is required" });
      }
      const { data, statusCode, success, message } =
        await approveOrRejectStudentApplacition({
          studentId,
          eventId,
          action,
          supervisorId,
        });

      res.status(statusCode).json({ success, message, data });
    } catch (error: any) {
      res.status(500).send(`Server error ${error.message}`);
    }
  }
);

router.get(
  "/:eventId/registrations/export",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const supervisorId = req.user._id;
      const eventId = req.params.eventId;

      if (!supervisorId || !eventId) {
        return res
          .status(400)
          .json({ message: "eventId and supervisor are required" });
      }
      const { data, statusCode, success, message } =
        await exportRegisteredStudent({
          supervisorId,
          eventId,
        });

      if (!success || !data) {
        return res
          .status(statusCode)
          .json({ success: false, message: message });
      }
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + "studentList.xlsx"
      );
      // Save Excel file
      await data.xlsx.write(res);
      res.end();
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.get(
  "/appliactions",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const supervisorId = req.user._id;
      if (!supervisorId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const { status } = req.query;
      const validStatuses = Object.values(EventStatus);
      if (status && !validStatuses.includes(status as EventStatus)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status value." });
      }
      const appliactions = await getSupervisorAppliactions(
        supervisorId,
        status as EventStatus
      );
      res.status(200).json({ success: true, data: appliactions });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: `Server error ${error.message}` });
    }
  }
);

export default router;

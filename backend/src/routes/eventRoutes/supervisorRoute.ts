import express from "express";
import validateJWT from "../../middlewares/validateJWT";
import { IExtendRequest } from "../../types/extendedRequest";
import { isSupervisor } from "../../middlewares/validateUserRole";
import {
  approveOrRejectStudentapplacition,
  createEvent,
} from "../../services/supervisorService";

const router = express.Router();

// create new event and wait for admin response (rejected or approved)
router.post(
  "/",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const { title, description, location, date } = req.body;

      if (!title || !description || !location || !date) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const supervisorId = req.user._id;
      const { data, statusCode } = await createEvent({
        title,
        description,
        location,
        date,
        supervisorId,
      });
      res.status(statusCode).json(data);
    } catch {
      res.status(403).send("something went wrong");
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
      const { data, statusCode } = await approveOrRejectStudentapplacition({
        studentId,
        eventId,
        action,
        supervisorId,
      });

      res.status(statusCode).json(data);
    } catch {
      res.status(403).send("something went wrong");
    }
  }
);

export default router;

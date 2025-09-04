import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isSupervisor } from "../middlewares/validateUserRole";
import { createEvent } from "../services/supervisorService";

const router = express.Router();

// create new event and wait for admin response (rejected or approved)
router.post(
  "/events",
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

export default router;

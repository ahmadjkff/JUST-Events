import express from "express";
import validateJWT from "../middlewares/validateJWT";
import { IExtendRequest } from "../types/extendedRequest";
import { isSupervisor } from "../middlewares/validateUserRole";
import { eventModel } from "../models/eventModel";


const router = express.Router();

// create new event and wait for admin response (rejected or approved)
router.post(
  "/events",
  validateJWT,
  isSupervisor,
  async (req: IExtendRequest, res) => {
    try {
      const { title, description, location, date } = req.body;

      const event = new eventModel({
        title,
        description,
        location,
        date,
        createdBy: req.user._id,
        status: "pending",
      });

      await event.save();
      res
        .status(201)
        .json({ message: "Event created and awaiting approval", event });
    } catch {
      res.status(403).send("something went wrong");
    }
  }
);

export default router;

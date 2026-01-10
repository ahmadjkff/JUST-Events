import { RegistrationModel } from "../models/registrationModel";
import express from "express";
import { isAdmin } from "../middlewares/validateUserRole";
import userModel from "../models/userModel";
import eventModel from "../models/eventModel";
import { EventStatus, RegistrationStatus } from "../types/eventTypes";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

router.get("/supervisors", validateJWT, async (req, res) => {
  try {
    const supervisors = (await userModel.find({ role: "supervisor" }).lean())
      .length;
    res.status(200).send(supervisors);
  } catch (error: any) {
    res.status(500).send(error.message || "Failed to retrieve supervisors");
  }
});

router.get("/volunteers", validateJWT, async (req, res) => {
  try {
    const volunteers = (
      await RegistrationModel.find({
        isVolunteer: true,
        status: RegistrationStatus.APPROVED,
      }).lean()
    ).length;

    res.status(200).send(volunteers);
  } catch (error: any) {
    res.status(500).send(error.message || "Failed to retrieve volunteers");
  }
});

router.get("/pending-requests", validateJWT, async (req, res) => {
  try {
    const pendingEvents = (
      await eventModel
        .find({
          status: EventStatus.PENDING,
        })
        .lean()
    ).length;
    const pendingVolunteers = (
      await RegistrationModel.find({
        isVolunteer: true,
        status: RegistrationStatus.PENDING,
      }).lean()
    ).length;

    res.status(200).send(pendingVolunteers + pendingEvents);
  } catch (error: any) {
    res
      .status(500)
      .send(error.message || "Failed to retrieve pedning requests");
  }
});

export default router;

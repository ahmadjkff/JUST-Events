import mongoose from "mongoose";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
import { EventStatus } from "../../types/eventTypes";
import AppError from "../../types/AppError";
import RegistrationModel from "../../models/registrationModel";

export const changeEventStatus = async (eventId: string, action: string) => {
  const normalizedAction = action.toLowerCase();

  if (!Object.values(EventStatus).includes(normalizedAction as EventStatus)) {
    throw new AppError("Invalid action", 400);
  }

  const event = await eventModel.findById(eventId);
  if (!event) throw new AppError("Event not found", 400);

  event.status = normalizedAction as EventStatus;
  await event.save();

  return event;
};

export const fetchVolunteers = async () => {
  const volunteers = await RegistrationModel.find({ isVolunteer: true })
    .populate("student")
    .populate("event");

  return volunteers;
};

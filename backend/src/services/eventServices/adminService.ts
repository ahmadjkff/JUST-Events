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

export const controlVolunteerApplication = async (
  eventId: string,
  userId: string,
  action: "assign" | "remove"
) => {
  const event = await eventModel.findById(eventId);
  if (!event) throw new AppError("Event not found", 400);

  const user = await userModel.findById(userId);
  if (!user) throw new AppError("User not found", 400);

  if (action !== "remove" && event.volunteers.some((v) => v.equals(userId))) {
    throw new AppError("User already a volunteer for this event", 400);
  }
  if (action === "remove") {
    event.volunteers = event.volunteers.filter((v) => !v.equals(userId));
    RegistrationModel.findOneAndDelete({
      event: eventId,
      student: userId,
      isVolunteer: true,
    }).exec();
    await event.save();
    return event;
  }

  event.volunteers.push(new mongoose.Types.ObjectId(userId));
  await event.save();

  const deleted = await RegistrationModel.findOneAndDelete({
    event: eventId,
    student: userId,
    isVolunteer: true,
    status: "pending",
  }).exec();
  console.log("deleted", deleted);

  return event;
};

export const fetchVolunteers = async () => {
  const volunteers = await RegistrationModel.find({ isVolunteer: true })
    .populate("student")
    .populate("event");

  return volunteers;
};

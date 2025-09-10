import mongoose from "mongoose";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
import { EventStatus } from "../../types/eventTypes";
import AppError from "../../types/AppError";

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

export const addVolunteer = async (eventId: string, userId: string) => {
  const event = await eventModel.findById(eventId);
  if (!event) throw new AppError("Event not found", 400);

  const user = await userModel.findById(userId);
  if (!user) throw new AppError("User not found", 400);

  if (event.volunteers.some((v) => v.equals(userId))) {
    throw new AppError("User already a volunteer for this event", 400);
  }

  event.volunteers.push(new mongoose.Types.ObjectId(userId));
  await event.save();

  return event;
};

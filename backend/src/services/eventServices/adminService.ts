import mongoose from "mongoose";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
import { EventStatus } from "../../types/eventTypes";
import IResponseStructure from "../../types/responseStructure";

export const changeEventStatus = async (
  eventId: string,
  action: string
): Promise<IResponseStructure> => {
  try {
    if (!Object.values(EventStatus).includes(action as EventStatus)) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid action",
      };
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return {
        statusCode: 404,
        success: false,
        message: "Event not found",
      };
    }

    event.status = action as EventStatus;
    await event.save();

    return {
      statusCode: 200,
      success: true,
      message: `Event ${action}`,
      data: { event },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: `Server error ${error.message}`,
    };
  }
};

export const addVolunteer = async (eventId: string, userId: string) => {
  const event = await eventModel.findById(eventId);
  if (!event) throw new Error("Event not found");

  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (event.volunteers.some((v) => v.equals(userId))) {
    throw new Error("User is already a volunteer");
  }

  event.volunteers.push(new mongoose.Types.ObjectId(userId));
  await event.save();

  return event;
};

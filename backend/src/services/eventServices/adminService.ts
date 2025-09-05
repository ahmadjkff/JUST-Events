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

export const addVolunteer = async (
  eventId: string,
  userId: string
): Promise<IResponseStructure> => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      return {
        statusCode: 404,
        success: false,
        message: "Event not found",
      };
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "User not found",
      };
    }

    if (
      event.volunteers.includes(userId as unknown as mongoose.Types.ObjectId)
    ) {
      return {
        statusCode: 400,
        success: false,
        message: "User is already a volunteer for this event",
      };
    }

    event.volunteers = event.volunteers || [];
    event.volunteers.push(userId as unknown as mongoose.Types.ObjectId);
    await event.save();
    return {
      statusCode: 200,
      success: true,
      message: "Volunteer added successfully",
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

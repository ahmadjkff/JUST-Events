import { eventModel, IEvent } from "../models/eventModel";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import { EventStatus } from "../types/eventTypes";
import IResponseStructure from "../types/responseStructure";

export const getEventsByStatus = async (
  status: string
): Promise<IResponseStructure> => {
  try {
    if (!Object.values(EventStatus).includes(status as EventStatus)) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid status parameter",
      };
    }

    const events = await eventModel.find({ status });

    return {
      statusCode: 200,
      success: true,
      message: `${status} Events fetched successfully`,
      data: {
        events,
      },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: "Server error",
    };
  }
};

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
      message: "Server error",
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
      message: "Server error",
    };
  }
};

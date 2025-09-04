import { eventModel, IEvent } from "../models/eventModel";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import { EventStatus } from "../types/eventTypes";

export const getEventsByStatus = async (status: string) => {
  try {
    if (!Object.values(EventStatus).includes(status as EventStatus)) {
      return {
        statusCode: 400,
        data: { success: false, message: "Invalid status parameter" },
      };
    }

    const events = await eventModel.find({ status });

    return {
      statusCode: 200,
      data: {
        success: true,
        message: `${status} Events fetched successfully`,
        events,
      },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      data: { success: false, message: "Server error", error: error.message },
    };
  }
};

export const changeEventStatus = async (eventId: string, action: string) => {
  try {
    if (!Object.values(EventStatus).includes(action as EventStatus)) {
      return {
        statusCode: 400,
        data: { success: false, message: "Invalid action" },
      };
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return {
        statusCode: 404,
        data: { success: false, message: "Event not found" },
      };
    }

    event.status = action as EventStatus;
    await event.save();

    return {
      statusCode: 200,
      data: { success: true, message: `Event ${action}`, event },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      data: { success: false, message: "Server error", error: error.message },
    };
  }
};

export const addVolunteer = async (eventId: string, userId: string) => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event) {
      return {
        statusCode: 404,
        data: { success: false, message: "Event not found" },
      };
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        data: { success: false, message: "User not found" },
      };
    }
    event.volunteers = event.volunteers || [];
    event.volunteers.push(userId as unknown as mongoose.Types.ObjectId);
    await event.save();
    return {
      statusCode: 200,
      data: { success: true, message: "Volunteer added successfully", event },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      data: { success: false, message: "Server error", error: error.message },
    };
  }
};

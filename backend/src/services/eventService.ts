import { eventModel, IEvent } from "../models/eventModel";
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

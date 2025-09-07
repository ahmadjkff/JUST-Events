import eventModel from "../../models/eventModel";
import { EventStatus } from "../../types/eventTypes";
import IResponseStructure from "../../types/responseStructure";

export const getEventsByStatus = async (
  status: string
): Promise<IResponseStructure> => {
  try {
    const normalizedStatus = status.toUpperCase();
    if (!Object.values(EventStatus).includes(normalizedStatus as EventStatus)) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid status parameter",
      };
    }

    const events = await eventModel.find({ status: normalizedStatus });

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
      message: `Server error ${error.message}`,
    };
  }
};

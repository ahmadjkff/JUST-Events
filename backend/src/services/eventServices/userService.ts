import eventModel from "../../models/eventModel";
import { EventStatus } from "../../types/eventTypes";
import IResponseStructure from "../../types/responseStructure";

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
      message: `Server error ${error.message}`,
    };
  }
};

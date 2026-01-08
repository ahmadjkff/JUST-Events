import eventModel from "../../models/eventModel";
import RegistrationModel from "../../models/registrationModel";
import AppError from "../../types/AppError";
import { EventStatus } from "../../types/eventTypes";

export const getEventsByStatus = async (status?: string) => {
  const normalizedStatus = status ? status.toLowerCase() : null;
  if (
    status &&
    !Object.values(EventStatus).includes(normalizedStatus as EventStatus)
  ) {
    throw new AppError("Invalid status parameter", 400);
  }

  const query = normalizedStatus ? { status: normalizedStatus } : {};

  const events = await eventModel.find(query).populate("volunteers").sort({ createdAt: -1 });

  return events;
};

export const getSpecificEvent = async (eventId: string) => {
  try {
    const event = await eventModel
      .findOne({ _id: eventId })
      .populate("feedback.student", "firstName lastName img")
      .sort({ createdAt: -1 })
      .lean();
      
    if (!event)
      return { message: "Event not found ", statusCode: 403, success: false };

    const appliactions = await RegistrationModel.find({
      event: eventId,
      isVolunteer: false,
    })
      .populate("student", "firstName lastName email")
      .select("-event")
      .lean();

    return {
      success: true,
      message: "Event and applications fetched successfully",
      statusCode: 200,
      data: { event, appliactions },
    };
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};

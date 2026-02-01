import eventModel from "../../models/eventModel";
import RegistrationModel from "../../models/registrationModel";
import AppError from "../../types/AppError";
import { EventStatus } from "../../types/eventTypes";

export const getEventsByStatus = async (status?: string) => {
  const normalizedStatus = status ? status.toLowerCase() : null;

  // Validate status
  if (
    status &&
    !Object.values(EventStatus).includes(normalizedStatus as EventStatus)
  ) {
    throw new AppError("Invalid status parameter", 400);
  }

  // Build query
  const query = normalizedStatus ? { status: normalizedStatus } : {};

  // Fetch events
  const events = await eventModel
    .find(query)
    .populate("volunteers")
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });

  // Update past approved events

    const currentDate = new Date();

    for (const event of events) {
      if (event.date  && event.date < currentDate && event.status !== EventStatus.COMPLETED) {
        event.status = EventStatus.COMPLETED;
        await event.save();
      }
    }

  return events;
};

export const getSpecificEvent = async (eventId: string) => {
  try {
    const event = await eventModel
      .findOne({ _id: eventId })
      .populate("feedback.student", "firstName lastName img")
      .populate("createdBy", "firstName lastName email")
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

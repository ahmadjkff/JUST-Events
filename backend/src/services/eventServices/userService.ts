import eventModel from "../../models/eventModel";
import AppError from "../../types/AppError";
import { EventStatus } from "../../types/eventTypes";

export const getEventsByStatus = async (status?: string) => {
  const normalizedStatus = status ? status.toLowerCase() : null;
  if (
    status &&
    !Object.values(EventStatus).includes(normalizedStatus as EventStatus)
  )
    throw new AppError("Invalid status parameter", 400);

  const query = normalizedStatus ? { status: normalizedStatus } : {};
  const events = await eventModel.find(query);

  return events;
};

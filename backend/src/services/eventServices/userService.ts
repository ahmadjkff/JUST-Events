import eventModel from "../../models/eventModel";
import AppError from "../../types/AppError";
import { EventStatus } from "../../types/eventTypes";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 });

export const getEventsByStatus = async (status?: string) => {
  const cacheKey = status ? `events_${status.toLowerCase()}` : "events_all";

  const cachedEvents = cache.get(cacheKey);
  if (cachedEvents) return cachedEvents;

  const normalizedStatus = status ? status.toLowerCase() : null;
  if (
    status &&
    !Object.values(EventStatus).includes(normalizedStatus as EventStatus)
  ) {
    throw new AppError("Invalid status parameter", 400);
  }

  const query = normalizedStatus ? { status: normalizedStatus } : {};

  const events = await eventModel.find(query);

  cache.set(cacheKey, events);

  return events;
};

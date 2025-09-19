import { useState, type FC, type PropsWithChildren } from "react";
import { EventContext } from "./EventContext";
import type { IEvent } from "../../types/eventTypes";

const EventProvider: FC<PropsWithChildren> = ({ children }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsByStatus, setEventsByStatus] = useState<{
    approved: IEvent[];
    pending: IEvent[];
    rejected: IEvent[];
  }>({ approved: [], pending: [], rejected: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (status?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event${status ? `?status=${status}` : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      if (status) {
        setEventsByStatus((prev) => ({ ...prev, [status]: data.data }));
      } else {
        setEvents(data.data);
      }

      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch events";
      console.error("Error fetching events:", error);
      setEvents([]);
      setEventsByStatus({ approved: [], pending: [], rejected: [] });
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{ events, eventsByStatus, isLoading, fetchEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;

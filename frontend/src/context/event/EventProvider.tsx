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
  const [volunteersByStatus, setVolunteersByStatus] = useState<{
    assigned: any[];
    pending: any[];
    removed: any[];
  }>({ assigned: [], pending: [], removed: [] });
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
        },
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

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/admin/volunteers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch volunteers");
      }

      // Assuming the API returns volunteers with a 'status' field
      const assigned = data.data.filter((v: any) => v.status === "approved");
      const pending = data.data.filter((v: any) => v.status === "pending");
      const removed = data.data.filter((v: any) => v.status === "rejected");

      setVolunteersByStatus({ assigned, pending, removed });

      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch volunteers";
      console.error("Error fetching volunteers:", message);
      setVolunteersByStatus({ assigned: [], pending: [], removed: [] });
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        eventsByStatus,
        volunteersByStatus,
        isLoading,
        fetchEvents,
        fetchVolunteers,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;

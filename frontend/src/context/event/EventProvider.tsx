import { useState, type FC, type PropsWithChildren } from "react";
import { EventContext } from "./EventContext";

const EventProvider: FC<PropsWithChildren> = ({ children }) => {
  const [events, setEvents] = useState<any[]>([]); // To-Do Replace 'any' with your actual event type
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

      setEvents(data.data);

      return { success: true, data: data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch events";
      console.error("Error fetching events:", error);
      setEvents([]);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventContext.Provider value={{ events, isLoading, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;

import { useState, type FC, type PropsWithChildren } from "react";
import { SupervisorContext } from "./SupervisorContext";
import type { EventCategory, EventDepartment } from "../../types/eventTypes";

const SupervisorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [event, setEvent] = useState<any>(null); // TODO: Replace 'any' with Event type
  const [isLoading, setIsLoading] = useState(false);

  const createEvent = async (
    title: string,
    description: string,
    location: string,
    department: EventDepartment,
    category: EventCategory,
    date: Date
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/supervisor`, // ✅ adjust path to your backend
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            description,
            location,
            department,
            category,
            date: date.toISOString(), // ✅ ensure string format
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      console.log("Created event:", data.data);
      setEvent(data.data);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create event";
      console.error("Error creating event:", error);
      setEvent(null);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}`, // ✅ adjust path to your backend
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }
      console.log("Deleted event:", data.message);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      console.error("Error deleting event:", error);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SupervisorContext.Provider
      value={{ event, isLoading, createEvent, deleteEvent }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export default SupervisorProvider;

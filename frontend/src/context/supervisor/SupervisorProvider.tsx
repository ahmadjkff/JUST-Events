import { useState, type FC, type PropsWithChildren } from "react";
import { SupervisorContext } from "./SupervisorContext";

const SuperviorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [event, setEvent] = useState();
  const [applications, setApplications] = useState();

  const fetchSupervisorApplications = async (status: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/supervisor/appliactions?status=${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      setEvents(data.data.data.grouped);
      console.log("fetched applications:", data.data.data.grouped);
      console.log("number of Events:", data.data.data.totalEvents);
      return { success: true, data: data.data.data, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      console.error("Error deleting event:", error);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };
  const getEventById = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      setEvent(data.data.event);
      setApplications(data.data.appliactions);
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch event";
      console.error("Error fetching event:", error);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SupervisorContext.Provider
      value={{
        isLoading,
        events,
        event,
        applications,
        fetchSupervisorApplications,
        getEventById,
      }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export default SuperviorProvider;

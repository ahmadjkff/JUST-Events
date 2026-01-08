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
    approved: any[];
    pending: any[];
    rejected: any[];
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
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const approved = data.data.filter((v: any) => v.status === "approved");
      const pending = data.data.filter((v: any) => v.status === "pending");
      const rejected = data.data.filter((v: any) => v.status === "rejected");

      setVolunteersByStatus({ approved, pending, rejected });

      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch volunteers";
      console.error("Error fetching volunteers:", message);
      setVolunteersByStatus({ approved: [], pending: [], rejected: [] });
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistredStudents = async (eventId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/registered-students/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch registered students");
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error fetching registered students:", error);
      return {
        success: false,
        message: "Failed to fetch registered students",
        data: [],
      };
    }
  };

  const fetchVolunteeredStudents = async (eventId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/volunteered-students/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch registered students");
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Error fetching registered students:", error);
      return {
        success: false,
        message: "Failed to fetch registered students",
        data: [],
      };
    }
  };

  const addFeedback = async (
    eventId: string,
    rating: number,
    comment: string,
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/student/feedback/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, comment }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update the events state with new feedback
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, feedback: data.data } : event,
          ),
        );
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to add feedback",
      };
    }
  };

  const deleteFeedback = async (eventId: string, feedbackId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/student/feedback/${eventId}/${feedbackId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update the events state to remove the deleted feedback
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, feedback: data.data } : event,
          ),
        );
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to delete feedback",
      };
    }
  };

  const fetchEventById = async (eventId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/event/${eventId}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      setEvents(data.data.event);

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch event by ID",
      };
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
        fetchRegistredStudents,
        addFeedback,
        deleteFeedback,
        fetchEventById,
        fetchVolunteeredStudents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;

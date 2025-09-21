import type { EventCategory, EventDepartment } from "../../../types/eventTypes";

export const createEvent = async (
  title: string,
  description: string,
  location: string,
  department: EventDepartment,
  category: EventCategory,
  date: Date
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor`,
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
          date: date.toISOString(),
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create event");
    }

    console.log("Created event:", data.data);
    return { success: true, data: data.data, message: data.message };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create event";
    console.error("Error creating event:", error);
    return { success: false, message };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}`,
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
    return { success: true, data: data.data, message: data.message };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete event";
    console.error("Error deleting event:", error);
    return { success: false, message };
  }
};

export const editEvent = async (
  eventId: string,
  title: string,
  description: string,
  location: string,
  department: EventDepartment,
  category: EventCategory,
  date: Date
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}`,
      {
        method: "PUT",
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
          date: date.toISOString(),
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to Edit event");
    }

    console.log("Edited event:", data.data);
    return { success: true, data: data.data, message: data.message };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to edit event";
    console.error("Error edit event:", error);
    return { success: false, message };
  }
};

export const updateApplicationStatus = async (
eventId :string,
studentId : string,
action :"approved" | "rejected"| "pending") => {

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}/registration/${studentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({action}),
    })
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update application status");
    }
    console.log("Updated application status:", data.data);
    return { success: true, data: data.data, message: data.message };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update application status";
    console.error("Error updating application status:", error);
    return { success: false, message}
  }
}

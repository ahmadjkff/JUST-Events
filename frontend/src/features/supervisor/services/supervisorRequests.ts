import type { EventCategory, EventDepartment } from "../../../types/eventTypes";

export const createEvent = async (
  stageId: string,
  title: string,
  description: string,
  location: string,
  department: EventDepartment,
  category: EventCategory,
  img: File,
) => {
  try {
    const formData = new FormData();
    formData.append("stageId", stageId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("department", department);
    formData.append("category", category);
    formData.append("img", img);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
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
      },
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
  date: Date,
  img: File,
) => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("department", department);
    formData.append("category", category);
    formData.append("date", date.toISOString());
    formData.append("img", img);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
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
  eventId: string,
  studentId: string,
  action: "approved" | "rejected" | "pending",
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}/registration/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update application status");
    }
    console.log("Updated application status:", data.data);
    return { success: true, data: data.data, message: data.message };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update application status";
    console.error("Error updating application status:", error);
    return { success: false, message };
  }
};

export const exportRegisterdStudentList = async (eventId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/supervisor/${eventId}/registrations/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    console.log("Export response status:", response.status);
    console.log("Export response headers:", [...response.headers]);

    if (!response.ok) {
      const errorText = await response.json(); // log server error message
      const error = errorText.message;
      throw new Error(error || "Failed to export Registered student");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // detect file type from headers
    const contentType = response.headers.get("Content-Type");
    const ext = contentType?.includes("spreadsheet") ? "xlsx" : "csv";
    a.download = `registered_students_${eventId}.${ext}`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    return { success: true, message: "File downloaded successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to export Registered student";
    console.error("Failed to export Registered student:", error);
    return { success: false, message };
  }
};

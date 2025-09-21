export const changeEventStatus = async (eventId: string, action: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/event/admin/change-status/${eventId}`,
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
      throw new Error(data.message || "Failed to change event status");
    }
    return { success: true, message: data.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    console.log("message: ", message);

    return { success: false, message };
  }
};

export const controlVolunteerApplication = async (
  eventId: string,
  userId: string,
  action: "assign" | "remove",
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/event/admin/control-volunteer/${userId}/${eventId}`,
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
      throw new Error(data.message || `Failed to ${action} volunteer`);
    }
    return { success: true, message: data.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    console.log("message: ", message);

    return { success: false, message };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }
    return { success: true, users: data.data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fetch failed";
    console.log("message: ", message);

    return { success: false, message };
  }
};

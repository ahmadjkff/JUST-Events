export const manageUserRole = async (userId: string, newRole: string) => {
  try {
    const result = await fetch(
      `${import.meta.env.VITE_BASE_URL}/admin/edit-role/${userId}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newRole }),
      }
    );
    const data = await result.json();
    if (!result.ok) {
      throw new Error(data.message || "Failed to update user role");
    }
    return { success: true, message: data.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.log("message: ", message);

    return { success: false, message };
  }
};

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
      }
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

export const assignVolunteer = async (eventId: string, userId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/event/admin/add-volunteer/${userId}/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to assign volunteer");
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

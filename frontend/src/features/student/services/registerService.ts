import toast from "react-hot-toast";

export const registerForEvent = async (eventId: string, studentId: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/student/register/${eventId}/${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!data.success) {
    toast.error(data.message || "Failed to register for event");
    throw new Error(data.message || "Failed to register for event");
  }

  toast.success(data.message || "Registered for event successfully");
  return data;
};

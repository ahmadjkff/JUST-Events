import toast from "react-hot-toast";

export const cancelRegistration = async (
  eventId: string,
  studentId: string,
) => {
  console.log(
    "Canceling registration for event:",
    eventId,
    "and student:",
    studentId,
  );

  const res = await fetch(
    `http://localhost:3001/student/cancel/${eventId}/${studentId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!res.ok) {
    toast.error("Failed to cancel registration");
    throw new Error("Failed to cancel registration");
  }

  toast.success("Registration cancelled successfully");

  return await res.json();
};

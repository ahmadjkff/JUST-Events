export const cancelRegistration = async (eventId: string, studentId: string) => {
  const res = await fetch(
    `http://localhost:5000/student/cancel/${eventId}/${studentId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to cancel registration");
  }

  return await res.json();
};

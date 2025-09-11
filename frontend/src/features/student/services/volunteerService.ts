export const volunteerForEvent = async (eventId: string, studentId: string) => {
  const res = await fetch(
    `http://localhost:5000/student/volunteer/${eventId}/${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to volunteer for event");
  }

  return await res.json();
};

export const provideFeedback = async (
  eventId: string,
  studentId: string,
  rating: number,
  comment?: string
) => {
  const res = await fetch(
    `http://localhost:5000/student/feedback/${eventId}/${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rating, comment }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }

  return await res.json();
};

export const provideFeedback = async (
  eventId: string,
  studentId: string,
  rating: number,
  comment?: string,
) => {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/student/feedback/${eventId}/${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rating, comment }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }

  return await res.json();
};

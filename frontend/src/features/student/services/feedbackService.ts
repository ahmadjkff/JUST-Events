import api from "../../../utils/utils";

export const provideFeedback = async (
  eventId: string,
  studentId: string,
  rating: number,
  comment?: string
) => {
  const res = await api.post(`/student/feedback/${eventId}/${studentId}`, {
    rating,
    comment,
  });
  return res.data;
};

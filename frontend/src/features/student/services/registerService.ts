import api from "../../../utils/utils";

export const registerForEvent = async (eventId: string, studentId: string) => {
  const res = await api.post(`/student/register/${eventId}/${studentId}`);
  return res.data;
};
import api from "../../../utils/utils";


export const cancelRegistration = async (eventId: string, studentId: string) => {
  const res = await api.delete(`/student/cancel/${eventId}/${studentId}`);
  return res.data;
};
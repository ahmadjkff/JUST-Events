import api from "../../../utils/utils";


export const volunteerForEvent = async (eventId: string, studentId: string) => {
  const res = await api.post(`/student/volunteer/${eventId}/${studentId}`);
  return res.data;
};

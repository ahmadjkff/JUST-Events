import { eventModel } from "../models/eventModel";
import { EventStatus } from "../types/eventTypes";

interface IBody {
  title: string;
  description: string;
  location: string;
  date: Date;
  supervisorId: string;
}

export const createEvent = async ({
  title,
  description,
  location,
  date,
  supervisorId,
}: IBody) => {
  const event = new eventModel({
    title,
    description,
    location,
    date,
    createdBy: supervisorId,
    status: "pending",
  });

  await event.save();

  return { data: { event }, statusCode: 201 };
};

interface IApproveOrReject {
  studentId: string;
  eventId: string;
  action: EventStatus;
  supervisorId: string;
}
export const approveOrRejectStudentapplacition = async ({
  studentId,
  eventId,
  action,
  supervisorId,
}: IApproveOrReject) => {
  const event = await eventModel.findById(eventId);
  if (!event) return { data: "Event not found", statusCode: 403 };

  if (event.createdBy.toString() !== supervisorId.toString()) {
    return { data: "Not authorized", statusCode: 404 };
  }

  const student = event.registeredStudents.find(
    (r) => r.student.toString() === studentId
  );

  if (!student) {
    return { data: "Student not registered", statusCode: 404 };
  }

  student.status =
    action === EventStatus.APPROVED
      ? EventStatus.APPROVED
      : EventStatus.REJECTED;
  await event.save();

  return {
    data: {
      event,
      message: `Student registration ${student.status}`,
    },
    statusCode: 200,
  };
};

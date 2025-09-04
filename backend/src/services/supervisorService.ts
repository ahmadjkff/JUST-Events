import { eventModel } from "../models/eventModel";
import { EventStatus } from "../types/eventTypes";
import IResponseStructure from "../types/responseStructure";

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
}: IBody): Promise<IResponseStructure> => {
  const event = new eventModel({
    title,
    description,
    location,
    date,
    createdBy: supervisorId,
    status: "pending",
  });

  await event.save();

  return {
    data: { event },
    statusCode: 201,
    success: true,
    message: "Event created successfully",
  };
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
}: IApproveOrReject): Promise<IResponseStructure> => {
  const event = await eventModel.findById(eventId);
  if (!event)
    return { message: "Event not found", statusCode: 403, success: false };

  if (event.createdBy.toString() !== supervisorId.toString()) {
    return { message: "Not authorized", statusCode: 404, success: false };
  }

  const student = event.registeredStudents.find(
    (r) => r.student.toString() === studentId
  );

  if (!student) {
    return {
      message: "Student not registered",
      statusCode: 404,
      success: false,
    };
  }

  student.status =
    action === EventStatus.APPROVED
      ? EventStatus.APPROVED
      : EventStatus.REJECTED;
  await event.save();

  return {
    message: `Student registration ${student.status}`,
    success: true,
    data: {
      event,
    },
    statusCode: 200,
  };
};

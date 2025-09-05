import { log } from "console";
import { eventModel } from "../../models/eventModel";
import { EventStatus } from "../../types/eventTypes";
import IResponseStructure from "../../types/responseStructure";

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
  try {
    const response = await fetch(`http://localhost:5000/api/stage/${location}`);

    if (!response.ok) {
      return {
        message: `${location} ${response.statusText}`,
        statusCode: response.status,
        success: false,
      };
    }

    const data = await response.json();

    if (data.data.stage.status === "reserved") {
      return {
        message: "Stage is reserved",
        statusCode: 400,
        success: false,
      };
    }

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
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};

interface IDeleteEvent {
  eventId: string;
  supervisorId: string;
}

export const deleteEvent = async ({
  eventId,
  supervisorId,
}: IDeleteEvent): Promise<IResponseStructure> => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event)
      return { message: "Event not found ", statusCode: 403, success: false };

    if (event.createdBy.toString() !== supervisorId.toString()) {
      return { message: "Not authorized", statusCode: 404, success: false };
    }

    await eventModel.deleteOne({ _id: eventId });

    return {
      message: "Event deleted successfully",
      statusCode: 200,
      data: event,
      success: true,
    };
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};

interface IEditEvent {
  eventId: string;
  supervisorId: string;
  title: string;
  description: string;
  location: string;
  date: Date;
}

export const editEvent = async ({
  eventId,
  supervisorId,
  title,
  description,
  location,
  date,
}: IEditEvent): Promise<IResponseStructure> => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event)
      return { message: "Event not found ", statusCode: 403, success: false };

    if (event.createdBy.toString() !== supervisorId.toString()) {
      return { message: "Not authorized", statusCode: 404, success: false };
    }
    if (title) {
      event.title = title;
    }
    if (description) {
      event.description = description;
    }
    if (location) {
      event.location = location;
    }
    if (date) {
      event.date = date;
    }

    await event.save();

    return {
      message: "Event updated successfully",
      statusCode: 200,
      data: event,
      success: true,
    };
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};

interface IApproveOrReject {
  studentId: string;
  eventId: string;
  action: EventStatus;
  supervisorId: string;
}
export const approveOrRejectStudentApplacition = async ({
  studentId,
  eventId,
  action,
  supervisorId,
}: IApproveOrReject): Promise<IResponseStructure> => {
  try {
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
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};

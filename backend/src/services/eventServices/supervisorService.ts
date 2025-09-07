import { eventModel } from "../../models/eventModel";
import { EventStatus } from "../../types/eventTypes";
import IResponseStructure from "../../types/responseStructure";
import RegistrationModel from "../../models/registrationModel";
import ExcelJS from "exceljs";
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

    const isRegistered = await RegistrationModel.findOne({
      student: studentId,
      event: eventId,
    });

    if (!isRegistered) {
      {
        return {
          success: false,
          statusCode: 404,
          message: "Student is not registered for this event",
        };
      }
    }

    isRegistered.status =
      action === EventStatus.APPROVED
        ? EventStatus.APPROVED
        : EventStatus.REJECTED;

    await isRegistered.save();

    return {
      success: true,
      statusCode: 200,
      message: `Student registration ${isRegistered.status}`,
      data: isRegistered,
    };
  } catch (error: any) {
    return {
      message: `Server error ${error.message}`,
      statusCode: 500,
      success: false,
    };
  }
};
interface IExportRegStudent {
  supervisorId: string;
  eventId: string;
}
export const exportRegisteredStudent = async ({
  supervisorId,
  eventId,
}: IExportRegStudent) => {
  const event = await eventModel.findById(eventId);
  if (!event)
    return { message: "Event not found", statusCode: 403, success: false };

  if (event.createdBy.toString() !== supervisorId.toString()) {
    return { message: "Not authorized", statusCode: 404, success: false };
  }

  const registrations = await RegistrationModel.find({
    event: eventId,
    status: "approved",
  })
    .populate("student", "firstName lastName email")
    .populate("event", "title description location");

  if (!registrations.length) {
    return {
      message: "No approved students found",
      statusCode: 404,
      success: false,
    };
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Approved Students");

  worksheet.columns = [
    { header: "First Name", key: "firstName", width: 20 },
    { header: "Last Name", key: "lastName", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Registered At", key: "registeredAt", width: 25 },
    { header: "Event Title", key: "title", width: 25 },
    { header: "Event description", key: "description", width: 30 },
    { header: "Event location", key: "location", width: 25 },
  ];

  registrations.forEach((r: any) => {
    worksheet.addRow({
      firstName: (r.student as any).firstName,
      lastName: (r.student as any).lastName,
      email: (r.student as any).email,
      registeredAt: r.createdAt.toISOString(),
      title: (r.event as any).title,
      description: (r.event as any).description,
      location: (r.event as any).location,
    });
  });

  return {
    success: true,
    message: "Excel file generated successfully",
    statusCode: 200,
    data: workbook,
  };
};

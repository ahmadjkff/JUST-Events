import { eventModel } from "../../models/eventModel";

import {
  EventCategory,
  EventDepartment,
  EventStatus,
  RegistrationStatus,
} from "../../types/eventTypes";

import IResponseStructure from "../../types/responseStructure";
import RegistrationModel from "../../models/registrationModel";
import ExcelJS from "exceljs";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

interface IBody {
  stageId: string;
  title: string;
  description: string;
  location: string;
  department: EventDepartment;
  category: EventCategory;
  img: string;
  supervisorId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export const createEvent = async ({
  // To-Do: check if date is in the future
  stageId,
  title,
  description,
  location,
  department,
  category,
  img,
  supervisorId,
  date,
  startTime,
  endTime,
  capacity,
}: IBody): Promise<IResponseStructure> => {
  try {
    const eventDate = new Date(date);
    if (Number.isNaN(eventDate.getTime())) {
      return {
        message: "Invalid event date",
        statusCode: 400,
        success: false,
      };
    }

    const event = new eventModel({
      title,
      description,
      location,
      department,
      category,
      date: eventDate,
      startTime,
      endTime,
      img,
      createdBy: supervisorId,
      status: "pending",
      capacity,
    });

    await event.save();

    // Book the stage in the simulator API
    const bookingResponse = await fetch(
      `${process.env.SIMULATOR_API}/stage/${stageId}/book`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId,
          date,
          start: startTime,
          end: endTime,
          capacity,
          eventId: event._id,
        }),
      }
    );

    if (!bookingResponse.ok) {
      const bookingError = await bookingResponse.json().catch(() => ({}));
      // Roll back created event if booking fails
      await eventModel.deleteOne({ _id: event._id });

      return {
        message:
          bookingError.message ||
          `Failed to book stage (status ${bookingResponse.status})`,
        statusCode: bookingResponse.status,
        success: false,
      };
    }

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

    if (event.img) {
      const imagePath = path.join(__dirname, "..", "..", event.img);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Fetch all stages and find the booking for this event
    try {
      const stagesResponse = await fetch(`${process.env.SIMULATOR_API}/stage`, {
        method: "GET",
      });

      if (stagesResponse.ok) {
        const stagesData = await stagesResponse.json();
        const stages = stagesData.data || [];

        // Map through stages to find and delete the booking
        await Promise.all(
          stages.map(async (stage: any) => {
            if (stage.bookings && Array.isArray(stage.bookings)) {
              const booking = stage.bookings.find(
                (b: any) => b.eventId?.toString() === eventId.toString()
              );

              if (booking && booking._id) {
                await fetch(
                  `${process.env.SIMULATOR_API}/stage/${stage._id}/bookings/${booking._id}`,
                  { method: "DELETE" }
                );
              }
            }
          })
        );
      }
    } catch (error: any) {
      // Log the error but continue with event deletion
      console.error("Error deleting booking from stage:", error.message);
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
  department: EventDepartment;
  category: EventCategory;
  date: Date;
  img: string | null;
}

export const editEvent = async ({
  eventId,
  supervisorId,
  title,
  description,
  location,
  department,
  category,
  date,
  img,
}: IEditEvent): Promise<IResponseStructure> => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event)
      return { message: "Event not found ", statusCode: 403, success: false };

    if (event.createdBy.toString() !== supervisorId.toString()) {
      return { message: "Not authorized", statusCode: 404, success: false };
    }

    if (event.img && img) {
      const oldImgPath = path.join(__dirname, "..", "..", event.img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
      event.img = img;
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
    if (department) {
      event.department = department;
    }
    if (category) {
      event.category = category;
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
  action: RegistrationStatus;
  supervisorId: string;
}
export const approveOrRejectStudentApplacition = async ({
  //To-Do: remove the application when application is rejected
  studentId,
  eventId,
  action,
  supervisorId,
}: IApproveOrReject): Promise<IResponseStructure> => {
  try {
    const event = await eventModel.findById(eventId);
    if (!event)
      return { message: "Event not found", statusCode: 403, success: false };

    if (event.status !== EventStatus.APPROVED) {
      return {
        message: "You can only manage applications for approved events",
        statusCode: 400,
        success: false,
      };
    }
    if (
      action === "approved" &&
      event.capacity === event.registeredStudents.length
    ) {
      return {
        message: "Capacity is full",
        statusCode: 400,
        success: false,
      };
    }

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

    if (!Object.values(RegistrationStatus).includes(action)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid action",
      };
    }

    isRegistered.status = action;

    if (
      action === RegistrationStatus.REJECTED ||
      action === RegistrationStatus.PENDING
    ) {
      await RegistrationModel.findOneAndDelete({
        student: studentId,
        event: eventId,
      });

      // Also remove from event.registeredStudents
      event.registeredStudents = event.registeredStudents.filter(
        (id) => id.toString() !== studentId.toString()
      );
      await event.save();

      return {
        success: true,
        statusCode: 200,
        message: `Student registration ${action}`,
      };
    }

    if (
      !event.registeredStudents.includes(
        new mongoose.Types.ObjectId(studentId)
      ) &&
      action === RegistrationStatus.APPROVED
    ) {
      event.registeredStudents.push(new mongoose.Types.ObjectId(studentId));
    }

    await isRegistered.save();
    await event.save();

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
  // Find event
  const event = await eventModel.findById(eventId);
  if (!event)
    return { message: "Event not found", statusCode: 403, success: false };

  if (event.createdBy.toString() !== supervisorId.toString()) {
    return { message: "Not authorized", statusCode: 404, success: false };
  }

  // Find approved registrations
  const registrations = await RegistrationModel.find({
    event: eventId,
    status: "approved",
    isVolunteer: false,
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

  // Event info block at the top
  worksheet.mergeCells("A1:D1");
  worksheet.getCell("A1").value = `Event Title: ${event.title}`;
  worksheet.getCell("A1").font = { bold: true };

  worksheet.mergeCells("A2:D2");
  worksheet.getCell("A2").value = `Event Description: ${event.description}`;
  worksheet.getCell("A2").font = { bold: true };

  worksheet.mergeCells("A3:D3");
  worksheet.getCell("A3").value = `Event Location: ${event.location}`;
  worksheet.getCell("A3").font = { bold: true };

  worksheet.mergeCells("A4:D4");
  worksheet.getCell(
    "A4"
  ).value = `Total Registered Students: ${registrations.length}`;
  worksheet.getCell("A4").font = { bold: true };

  worksheet.addRow([]); // spacer row

  // ✅ Explicit header row for student table
  const headerRow = worksheet.addRow([
    "First Name",
    "Last Name",
    "Email",
    "Registered At",
  ]);

  // Style header row (bold + light gray background)
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDDDDD" }, // light gray
    };
  });

  // Insert student rows with formatted date
  registrations.forEach((r: any) => {
    const createdAt = new Date(r.createdAt);
    const formattedDate = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1
    ).padStart(2, "0")}-${String(createdAt.getDate()).padStart(
      2,
      "0"
    )} ${String(createdAt.getHours()).padStart(2, "0")}:${String(
      createdAt.getMinutes()
    ).padStart(2, "0")}`;

    worksheet.addRow([
      (r.student as any).firstName,
      (r.student as any).lastName,
      (r.student as any).email,
      formattedDate,
    ]);
  });

  // Auto-size columns based on full content length
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column?.eachCell?.({ includeEmpty: true }, (cell) => {
      const val = cell.value ? cell.value.toString() : "";
      // Use full content length instead of longest word
      maxLength = Math.max(maxLength, val.length);
    });
    column.width = Math.min(Math.max(maxLength + 2, 12), 40); // min 12, max 40
  });

  return {
    success: true,
    message: "Excel file generated successfully",
    statusCode: 200,
    data: workbook,
  };
};

export const getSupervisorAppliactions = async (
  supervisorId: string,
  status: string
) => {
  try {
    // 1. Get all events by supervisor
    const events = await eventModel
      .find({ createdBy: supervisorId, status })
      .select("_id title description location date status department category")
      .lean();

    // 2. For each event, get the registrations

    const grouped = await Promise.all(
      events.map(async (event) => {
        const applications = await RegistrationModel.find({
          event: event._id,
          isVolunteer: false,
        })
          .populate("student", "firstName lastName email")
          .select("-event") // remove event field from applications
          .lean();

        return { event, applications };
      })
    );

    return {
      success: true,
      message: "Applications grouped by event",
      statusCode: 200,
      data: { grouped, totalEvents: events.length },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
    };
  }
};

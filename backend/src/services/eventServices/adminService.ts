import mongoose from "mongoose";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
import { EventStatus } from "../../types/eventTypes";
import AppError from "../../types/AppError";
import RegistrationModel from "../../models/registrationModel";
import * as notificationService from "../notificationService";
import { NotificationType } from "../../types/notificationTypes";
import { Server } from "socket.io";
import {
  broadcastEventStatusChange,
  broadcastEventStatusToStudents,
  broadcastApprovedEvent,
  broadcastNotification,
  broadcastBulkNotifications,
} from "../socketService";

export const changeEventStatus = async (
  eventId: string,
  action: string,
  io?: Server
) => {
  const normalizedAction = action.toLowerCase();

  if (!Object.values(EventStatus).includes(normalizedAction as EventStatus)) {
    throw new AppError("Invalid action", 400);
  }

  const event = await eventModel.findById(eventId);
  if (!event) throw new AppError("Event not found", 400);

  event.status = normalizedAction as EventStatus;
  await event.save();

  // Send notification to supervisor about event approval/rejection
  const supervisor = await userModel.findById(event.createdBy);
  if (supervisor) {
    const notificationType =
      normalizedAction === EventStatus.APPROVED
        ? NotificationType.EVENT_APPROVED
        : NotificationType.EVENT_REJECTED;

    const notificationTitle =
      normalizedAction === EventStatus.APPROVED
        ? `Event Approved: "${event.title}"`
        : `Event Rejected: "${event.title}"`;

    const notificationMessage =
      normalizedAction === EventStatus.APPROVED
        ? `Your event "${event.title}" has been approved and is now live.`
        : `Your event "${event.title}" has been rejected. Please review and try again.`;

    const notification = await notificationService.createNotification(
      (supervisor._id as any).toString(),
      notificationTitle,
      notificationMessage,
      notificationType,
      eventId
    );

    // Broadcast notification via socket
    if (io) {
      broadcastNotification(
        io,
        (supervisor._id as any).toString(),
        notification
      );
      // Broadcast status change to supervisor
      broadcastEventStatusChange(
        io,
        (supervisor._id as any).toString(),
        event,
        normalizedAction
      );
    }
  }

  // Create notifications for registered students
  const registeredStudents = event.registeredStudents || [];

  if (
    normalizedAction === EventStatus.APPROVED &&
    registeredStudents.length > 0
  ) {
    const notifications = await notificationService.createBulkNotifications(
      registeredStudents.map((id) => id.toString()),
      `Event "${event.title}" Approved`,
      `The event "${event.title}" has been approved and is now available for registration.`,
      NotificationType.EVENT_APPROVED,
      eventId
    );

    // Broadcast notifications and status changes via socket
    if (io) {
      registeredStudents.forEach((studentId, index) => {
        broadcastNotification(io, studentId.toString(), notifications[index]);
        broadcastEventStatusToStudents(
          io,
          [studentId.toString()],
          event,
          normalizedAction
        );
      });

      // Broadcast approved event to all students for browse events page
      broadcastApprovedEvent(io, event);
    }
  } else if (
    normalizedAction === EventStatus.REJECTED &&
    registeredStudents.length > 0
  ) {
    const notifications = await notificationService.createBulkNotifications(
      registeredStudents.map((id) => id.toString()),
      `Event "${event.title}" Rejected`,
      `The event "${event.title}" has been rejected. Registration has been cancelled.`,
      NotificationType.EVENT_REJECTED,
      eventId
    );

    // Broadcast notifications and status changes via socket
    if (io) {
      registeredStudents.forEach((studentId, index) => {
        broadcastNotification(io, studentId.toString(), notifications[index]);
        broadcastEventStatusToStudents(
          io,
          [studentId.toString()],
          event,
          normalizedAction
        );
      });
    }
  }

  return event;
};

export const fetchVolunteers = async () => {
  const volunteers = await RegistrationModel.find({ isVolunteer: true })
    .populate("student")
    .populate("event");

  return volunteers;
};

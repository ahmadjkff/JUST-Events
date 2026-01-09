import notificationModel, { INotification } from "../models/notificationModel";
import { NotificationType } from "../types/notificationTypes";
import mongoose from "mongoose";
import AppError from "../types/AppError";

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedEvent?: string,
  relatedUser?: string
): Promise<INotification> => {
  const notification = await notificationModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    title,
    message,
    type,
    relatedEvent: relatedEvent
      ? new mongoose.Types.ObjectId(relatedEvent)
      : undefined,
    relatedUser: relatedUser
      ? new mongoose.Types.ObjectId(relatedUser)
      : undefined,
    isRead: false,
  });

  return notification.populate(
    "relatedEvent relatedUser",
    "title firstName lastName"
  );
};

export const getNotificationsByUser = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<INotification[]> => {
  const notifications = await notificationModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate("relatedEvent", "title")
    .populate("relatedUser", "firstName lastName");

  return notifications;
};

export const getUnreadNotificationCount = async (
  userId: string
): Promise<number> => {
  const count = await notificationModel.countDocuments({
    userId,
    isRead: false,
  });

  return count;
};

export const markAsRead = async (
  notificationId: string
): Promise<INotification> => {
  const notification = await notificationModel.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await notificationModel.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  const result = await notificationModel.findByIdAndDelete(notificationId);

  if (!result) {
    throw new AppError("Notification not found", 404);
  }
};

export const deleteAllNotifications = async (userId: string): Promise<void> => {
  await notificationModel.deleteMany({ userId });
};

export const createBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: NotificationType,
  relatedEvent?: string,
  relatedUser?: string
): Promise<INotification[]> => {
  const notifications = await notificationModel.insertMany(
    userIds.map((userId) => ({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      message,
      type,
      relatedEvent: relatedEvent
        ? new mongoose.Types.ObjectId(relatedEvent)
        : undefined,
      relatedUser: relatedUser
        ? new mongoose.Types.ObjectId(relatedUser)
        : undefined,
      isRead: false,
    }))
  );

  return notificationModel.find({ _id: { $in: notifications.map(doc => doc._id) } })
    .populate("relatedEvent", "title")
    .populate("relatedUser", "firstName lastName");
};

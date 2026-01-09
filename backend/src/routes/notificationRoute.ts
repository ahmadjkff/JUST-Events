import express from "express";
import validateJWT from "../middlewares/validateJWT";
import type { IExtendRequest } from "../types/extendedRequest";
import * as notificationService from "../services/notificationService";
import AppError from "../types/AppError";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", validateJWT, async (req: IExtendRequest, res) => {
  try {
    const userId = req.user._id.toString();
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const notifications = await notificationService.getNotificationsByUser(
      userId,
      limit,
      offset
    );

    const unreadCount =
      await notificationService.getUnreadNotificationCount(userId);

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve notifications",
    });
  }
});

// Get unread notification count
router.get("/unread-count", validateJWT, async (req: IExtendRequest, res) => {
  try {
    const userId = req.user._id.toString();
    const count = await notificationService.getUnreadNotificationCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve unread count",
    });
  }
});

// Mark a notification as read
router.put(
  "/:notificationId/mark-as-read",
  validateJWT,
  async (req: IExtendRequest, res) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: "Notification ID is required",
        });
      }
      const notification = await notificationService.markAsRead(notificationId);

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: error.message || "Failed to mark notification as read",
      });
    }
  }
);

// Mark all notifications as read
router.put(
  "/mark-all-as-read",
  validateJWT,
  async (req: IExtendRequest, res) => {
    try {
      const userId = req.user._id.toString();
      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to mark notifications as read",
      });
    }
  }
);

// Delete a notification
router.delete(
  "/:notificationId",
  validateJWT,
  async (req: IExtendRequest, res) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: "Notification ID is required",
        });
      }
      await notificationService.deleteNotification(notificationId);

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete notification",
      });
    }
  }
);

// Delete all notifications
router.delete("/", validateJWT, async (req: IExtendRequest, res) => {
  try {
    const userId = req.user._id.toString();
    await notificationService.deleteAllNotifications(userId);

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete notifications",
    });
  }
});

export default router;

import { useState, type FC, type PropsWithChildren, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";
import type { INotification } from "../../types/notificationTypes";

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async (limit: number = 50, offset: number = 0) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications?limit=${limit}&offset=${offset}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      setNotifications(data.data);
      setUnreadCount(data.unreadCount);

      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications";
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications/unread-count`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch unread count");
      }

      setUnreadCount(data.data.unreadCount);
      return { success: true, data: data.data };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch unread count";
      console.error("Error fetching unread count:", error);
      return { success: false, message };
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications/${notificationId}/mark-as-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return { success: true, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";
      console.error("Error marking notification as read:", error);
      return { success: false, message };
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications/mark-all-as-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark all notifications as read",
        );
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      setUnreadCount(0);

      return { success: true, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read";
      console.error("Error marking all notifications as read:", error);
      return { success: false, message };
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete notification");
      }

      // Update local state
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return { success: true, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete notification";
      console.error("Error deleting notification:", error);
      return { success: false, message };
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/notifications`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete all notifications");
      }

      // Update local state
      setNotifications([]);
      setUnreadCount(0);

      return { success: true, message: data.message };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete all notifications";
      console.error("Error deleting all notifications:", error);
      return { success: false, message };
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

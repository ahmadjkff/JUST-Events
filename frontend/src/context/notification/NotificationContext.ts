import { createContext, useContext } from "react";
import type { INotification } from "../../types/notificationTypes";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (
    limit?: number,
    offset?: number,
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: INotification[];
  }>;
  fetchUnreadCount: () => Promise<{
    success: boolean;
    data?: { unreadCount: number };
  }>;
  markAsRead: (notificationId: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  markAllAsRead: () => Promise<{
    success: boolean;
    message?: string;
  }>;
  deleteNotification: (notificationId: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  deleteAllNotifications: () => Promise<{
    success: boolean;
    message?: string;
  }>;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  fetchNotifications: async () => Promise.resolve({ success: false }),
  fetchUnreadCount: async () => Promise.resolve({ success: false }),
  markAsRead: async () => Promise.resolve({ success: false }),
  markAllAsRead: async () => Promise.resolve({ success: false }),
  deleteNotification: async () => Promise.resolve({ success: false }),
  deleteAllNotifications: async () => Promise.resolve({ success: false }),
});

export const useNotification = () => useContext(NotificationContext);

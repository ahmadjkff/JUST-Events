import { useNotification } from "../context/notification/NotificationContext";

export const useNotificationBell = () => {
  const { unreadCount, fetchUnreadCount } = useNotification();

  return {
    unreadCount,
    fetchUnreadCount,
  };
};

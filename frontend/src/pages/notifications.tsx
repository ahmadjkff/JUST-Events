import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";
import { useTranslation } from "react-i18next";
import { useNotification } from "../context/notification/NotificationContext";
import { useState } from "react";
import { Bell, Trash2, CheckCircle2, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import type { INotification } from "../types/notificationTypes";
import { NotificationType } from "../types/notificationTypes";
import Loading from "../components/ui/Loading";

function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  useTitle(`${t("notifications.title")} - JUST Events`);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotification();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.EVENT_APPROVED:
      case NotificationType.REGISTRATION_APPROVED:
      case NotificationType.VOLUNTEER_APPROVED:
        return "✅";
      case NotificationType.EVENT_REJECTED:
      case NotificationType.REGISTRATION_REJECTED:
      case NotificationType.VOLUNTEER_REJECTED:
        return "❌";
      case NotificationType.CERTIFICATE_READY:
        return "🎓";
      case NotificationType.FEEDBACK_RECEIVED:
        return "💬";
      case NotificationType.EVENT_REMINDER:
        return "📅";
      case NotificationType.NEW_EVENT_AVAILABLE:
        return "🆕";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    if (
      type === NotificationType.EVENT_APPROVED ||
      type === NotificationType.REGISTRATION_APPROVED ||
      type === NotificationType.VOLUNTEER_APPROVED
    ) {
      return "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20";
    }
    if (
      type === NotificationType.EVENT_REJECTED ||
      type === NotificationType.REGISTRATION_REJECTED ||
      type === NotificationType.VOLUNTEER_REJECTED
    ) {
      return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20";
    }
    if (type === NotificationType.CERTIFICATE_READY) {
      return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
    return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const handleNotificationClick = (notification: INotification) => {
    setExpandedId(expandedId === notification._id ? null : notification._id);
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type and user role
    if (
      notification.type === NotificationType.NEW_EVENT_AVAILABLE &&
      user?.role === "admin"
    ) {
      // Navigate admin to control events page
      navigate("/admin/control-events");
    } else if (
      (notification.type === NotificationType.REGISTRATION_APPROVED ||
        notification.type === NotificationType.REGISTRATION_REJECTED) &&
      user?.role === "student" &&
      notification.relatedEvent
    ) {
      // Navigate student to event details
      navigate(`/event/${notification.relatedEvent._id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notifications? This action cannot be undone.",
      )
    ) {
      await deleteAllNotifications();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                {t("notifications.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("notifications.description")}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              {unreadCount} {unreadCount === 1 ? "unread" : "unread"}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          {/* Stats Card */}
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">
                    {t("notifications.headerTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredNotifications.length} notification
                    {filteredNotifications.length !== 1 ? "s" : ""} to view
                  </p>
                </div>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t("notifications.markAllAsRead")}
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleDeleteAll}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                      <Archive className="h-4 w-4" />
                      {t("notifications.clearAll")}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {t("notifications.filterAll")} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === "unread"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {t("notifications.filterUnread")} ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <Loading message={t("common.loading")} />
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
                <h3 className="mb-2 text-lg font-semibold">
                  {t("notifications.empty")}
                </h3>
                <p className="text-muted-foreground">
                  {filter === "unread"
                    ? t("notifications.noUnread")
                    : t("notifications.noNotifications")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification: INotification) => (
                <Card
                  key={notification._id}
                  className={`${getNotificationColor(
                    notification.type,
                  )} cursor-pointer border transition-all hover:shadow-md`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <span className="mt-1 text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {notification.message}
                          </p>
                          {expandedId === notification._id && (
                            <div className="border-opacity-10 mt-3 border-t border-current pt-3">
                              <div className="space-y-1 text-xs">
                                {notification.relatedEvent && (
                                  <p>
                                    <span className="font-semibold">
                                      Event:
                                    </span>{" "}
                                    {notification.relatedEvent.title}
                                  </p>
                                )}
                                {notification.relatedUser && (
                                  <p>
                                    <span className="font-semibold">From:</span>{" "}
                                    {notification.relatedUser.firstName}{" "}
                                    {notification.relatedUser.lastName}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          <span className="mt-2 block text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                        className="hover:bg-opacity-10 dark:hover:bg-opacity-10 ml-2 rounded-lg p-2 transition-colors hover:bg-black dark:hover:bg-white"
                        title="Delete notification"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;

export enum NotificationType {
  EVENT_APPROVED = "event_approved",
  EVENT_REJECTED = "event_rejected",
  REGISTRATION_APPROVED = "registration_approved",
  REGISTRATION_REJECTED = "registration_rejected",
  VOLUNTEER_APPROVED = "volunteer_approved",
  VOLUNTEER_REJECTED = "volunteer_rejected",
  NEW_EVENT_AVAILABLE = "new_event_available",
  EVENT_REMINDER = "event_reminder",
  FEEDBACK_RECEIVED = "feedback_received",
  CERTIFICATE_READY = "certificate_ready",
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedEvent?: {
    _id: string;
    title: string;
  };
  relatedUser?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

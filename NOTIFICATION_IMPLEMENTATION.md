# Notification System Implementation Guide

## Overview

The notification system has been fully implemented for the JUST Events application with both backend and frontend components.

## Backend Implementation

### 1. Database Model (`backend/src/models/notificationModel.ts`)

- **Collection**: `Notification`
- **Schema Fields**:
  - `userId`: Reference to the user receiving the notification
  - `title`: Notification title
  - `message`: Detailed notification message
  - `type`: NotificationType enum
  - `relatedEvent`: Optional reference to an event
  - `relatedUser`: Optional reference to a user (sender)
  - `isRead`: Boolean flag for read status
  - `timestamps`: Created and updated dates

### 2. Notification Types (`backend/src/types/notificationTypes.ts`)

- `EVENT_APPROVED`: Event has been approved
- `EVENT_REJECTED`: Event has been rejected
- `REGISTRATION_APPROVED`: Registration has been approved
- `REGISTRATION_REJECTED`: Registration has been rejected
- `VOLUNTEER_APPROVED`: Volunteer application approved
- `VOLUNTEER_REJECTED`: Volunteer application rejected
- `NEW_EVENT_AVAILABLE`: New event available
- `EVENT_REMINDER`: Event reminder
- `FEEDBACK_RECEIVED`: Feedback received
- `CERTIFICATE_READY`: Certificate is ready for download

### 3. Notification Service (`backend/src/services/notificationService.ts`)

Provides the following functions:

- `createNotification()`: Create a single notification
- `getNotificationsByUser()`: Fetch user notifications with pagination
- `getUnreadNotificationCount()`: Get count of unread notifications
- `markAsRead()`: Mark a specific notification as read
- `markAllAsRead()`: Mark all user notifications as read
- `deleteNotification()`: Delete a specific notification
- `deleteAllNotifications()`: Delete all user notifications
- `createBulkNotifications()`: Create notifications for multiple users

### 4. Notification Routes (`backend/src/routes/notificationRoute.ts`)

**All routes require JWT authentication**

- `GET /notifications` - Fetch user notifications (supports pagination)
- `GET /notifications/unread-count` - Get count of unread notifications
- `PUT /notifications/:notificationId/mark-as-read` - Mark notification as read
- `PUT /notifications/mark-all-as-read` - Mark all notifications as read
- `DELETE /notifications/:notificationId` - Delete a notification
- `DELETE /notifications` - Delete all notifications

### 5. Integration Points

The notification system is integrated with:

#### Event Admin Service

When event status changes to `APPROVED` or `REJECTED`, notifications are automatically created for all registered students.

#### Student Service

When a student registers for an event, a notification is created confirming the registration.

## Frontend Implementation

### 1. Notification Types (`frontend/src/types/notificationTypes.ts`)

- `INotification` interface matching backend schema
- `NotificationType` enum for type-safe notification handling

### 2. Notification Context (`frontend/src/context/notification/`)

- **NotificationContext.ts**: Defines context type with methods
- **NotificationProvider.tsx**: Provider component that:
  - Fetches notifications on mount
  - Auto-refreshes every 30 seconds
  - Manages notification state
  - Provides methods for marking as read, deleting, etc.

### 3. Notifications Page (`frontend/src/pages/notifications.tsx`)

Features:

- Real-time notification display
- Filter by all/unread notifications
- Mark individual notifications as read
- Mark all as read
- Delete individual notifications
- Delete all notifications
- Color-coded notification types
- Expandable details for related events/users
- Relative time display (e.g., "2 hours ago")
- Empty state messaging
- Loading indicators

### 4. Notification Hook (`frontend/src/hooks/useNotification.ts`)

Provides easy access to:

- `unreadCount`: Current unread notification count
- `fetchUnreadCount()`: Manually refresh unread count

### 5. Notification Provider Integration

The `NotificationProvider` is wrapped in `main.tsx` to make notifications available throughout the app.

## Translation Keys

### English (`frontend/src/locales/en/translation.json`)

All notification-related strings are under the `notifications` key:

- title, description, headerTitle, headerDescription
- empty states and loading messages
- filter options and action buttons
- success messages

### Arabic (`frontend/src/locales/ar/translation.json`)

Complete Arabic translations for all notification strings.

## Usage Examples

### Backend - Create a Notification

```typescript
import * as notificationService from "./services/notificationService";
import { NotificationType } from "./types/notificationTypes";

// Single notification
await notificationService.createNotification(
  userId,
  "Event Approved",
  "Your event has been approved",
  NotificationType.EVENT_APPROVED,
  eventId
);

// Bulk notifications
await notificationService.createBulkNotifications(
  userIds,
  "New Event",
  "A new event is available",
  NotificationType.NEW_EVENT_AVAILABLE,
  eventId
);
```

### Frontend - Using Notifications

```typescript
import { useNotification } from "../context/notification/NotificationContext";

function MyComponent() {
  const { notifications, unreadCount, markAsRead, deleteNotification } =
    useNotification();

  // Use notifications...
}
```

## Auto-Refresh Strategy

- Initial fetch on component mount
- Auto-refresh every 30 seconds via `setInterval`
- Interval cleanup on component unmount
- Proper error handling with fallback states

## Features Implemented

✅ Create, read, and delete notifications
✅ Mark notifications as read/unread
✅ Pagination support
✅ Unread count tracking
✅ Bulk notification creation
✅ Event and user relationship tracking
✅ Type-safe notification types
✅ Auto-refresh mechanism
✅ Comprehensive error handling
✅ Internationalization (EN/AR)
✅ Real-time state management
✅ Expandable notification details

## Future Enhancements

- WebSocket integration for real-time updates
- Email notifications for important events
- Notification preferences/settings
- Push notifications
- Notification filtering by type
- Search functionality
- Archive functionality
- Sound/desktop notifications

## Testing Checklist

- [ ] Create notification via backend service
- [ ] Fetch notifications with pagination
- [ ] Mark notification as read
- [ ] Mark all notifications as read
- [ ] Delete single notification
- [ ] Delete all notifications
- [ ] Verify unread count
- [ ] Test auto-refresh
- [ ] Test notification filtering
- [ ] Verify translations (EN/AR)
- [ ] Test error handling
- [ ] Verify responsive design

## Notes

- All timestamps are ISO format
- Notifications are indexed by userId and createdAt for efficiency
- Frontend automatically handles authentication via JWT token in localStorage
- Deleted notifications are permanently removed from database
- Unread count is decremented when marked as read

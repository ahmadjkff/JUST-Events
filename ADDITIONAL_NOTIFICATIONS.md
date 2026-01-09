# Additional Notification Features Implementation

## Overview

Three new notification flows have been implemented to improve communication between supervisors, admins, and students:

## 1. Supervisor Creates Event → Admin Notification

**Location**: `backend/src/services/eventServices/supervisorService.ts` (createEvent function)

### Flow:

- When a supervisor creates a new event
- A notification is sent to **all admins** in the system
- Admins receive a notification titled: `New Event Created: "Event Title"`
- Message: `"Supervisor has created a new event 'Event Title' pending your approval."`
- Notification Type: `NEW_EVENT_AVAILABLE`

### Code Implementation:

```typescript
const admins = await userModel.find({ role: Roles.ADMIN });
for (const admin of admins) {
  await notificationService.createNotification(
    admin._id.toString(),
    `New Event Created: "${title}"`,
    `Supervisor has created a new event "${title}" pending your approval.`,
    NotificationType.NEW_EVENT_AVAILABLE,
    event._id.toString()
  );
}
```

---

## 2. Admin Approves/Rejects Event → Supervisor Notification

**Location**: `backend/src/services/eventServices/adminService.ts` (changeEventStatus function)

### Flow:

- When an admin approves or rejects an event
- A notification is sent to the **supervisor who created the event**
- **Approval**: Title: `Event Approved: "Event Title"`, Message: `"Your event 'Event Title' has been approved and is now live."`
- **Rejection**: Title: `Event Rejected: "Event Title"`, Message: `"Your event 'Event Title' has been rejected. Please review and try again."`
- Notification Types: `EVENT_APPROVED` or `EVENT_REJECTED`

### Code Implementation:

```typescript
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

  await notificationService.createNotification(
    supervisor._id.toString(),
    notificationTitle,
    notificationMessage,
    notificationType,
    eventId
  );
}
```

---

## 3. Supervisor Approves/Rejects Registration → Student Notification

**Location**: `backend/src/services/eventServices/supervisorService.ts` (approveOrRejectStudentApplacition function)

### Flow:

- When a supervisor approves or rejects a student's registration
- A notification is sent to the **student**
- **Approval**: Title: `Registration Approved for "Event Title"`, Message: `"Your registration for 'Event Title' has been approved by [Supervisor Name]."`
- **Rejection**: Title: `Registration Rejected for "Event Title"`, Message: `"Your registration for 'Event Title' has been rejected by [Supervisor Name]."`
- Notification Types: `REGISTRATION_APPROVED` or `REGISTRATION_REJECTED`
- Related User: Supervisor who made the decision

### Code Implementation:

```typescript
const supervisor = await userModel.findById(supervisorId);
const student = await userModel.findById(studentId);

if (supervisor && student) {
  const notificationType =
    action === RegistrationStatus.APPROVED
      ? NotificationType.REGISTRATION_APPROVED
      : NotificationType.REGISTRATION_REJECTED;

  const notificationTitle =
    action === RegistrationStatus.APPROVED
      ? `Registration Approved for "${event.title}"`
      : `Registration Rejected for "${event.title}"`;

  const notificationMessage =
    action === RegistrationStatus.APPROVED
      ? `Your registration for "${event.title}" has been approved by ${supervisor.firstName} ${supervisor.lastName}.`
      : `Your registration for "${event.title}" has been rejected by ${supervisor.firstName} ${supervisor.lastName}.`;

  await notificationService.createNotification(
    studentId,
    notificationTitle,
    notificationMessage,
    notificationType,
    eventId,
    supervisorId
  );
}
```

---

## Files Modified:

1. **backend/src/services/eventServices/supervisorService.ts**

   - Added imports: `userModel`, `notificationService`, `NotificationType`, `Roles`
   - Added admin notification in `createEvent()` function
   - Added student notification in `approveOrRejectStudentApplacition()` function

2. **backend/src/services/eventServices/adminService.ts**
   - Added supervisor notification in `changeEventStatus()` function

---

## Notification Types Used:

- `NEW_EVENT_AVAILABLE` - For admin notification about new event
- `EVENT_APPROVED` - For supervisor when event is approved
- `EVENT_REJECTED` - For supervisor when event is rejected
- `REGISTRATION_APPROVED` - For student when registration is approved
- `REGISTRATION_REJECTED` - For student when registration is rejected

---

## User Experience Improvements:

✅ Admins stay informed about new events awaiting approval
✅ Supervisors get immediate feedback on their event submissions
✅ Students get notified about their registration status
✅ All notifications include relevant event details and actor information
✅ Notifications include timestamps and can be marked as read
✅ Students can see who made the decision on their registration

---

## Testing Steps:

1. **Test Admin Notification**:

   - Login as supervisor
   - Create a new event
   - Login as admin
   - Check notifications page for "New Event Created" notification

2. **Test Supervisor Notification**:

   - Login as admin
   - Find a pending event
   - Approve or reject it
   - Login as supervisor (creator)
   - Check notifications for approval/rejection message

3. **Test Student Notification**:
   - Login as student
   - Register for an event
   - Login as supervisor
   - Approve or reject the registration
   - Login as student
   - Check notifications for approval/rejection message

---

## Database Impact:

- New notifications are created in the `Notification` collection
- No schema changes needed - uses existing `INotification` interface
- Notifications properly reference related events, students, and supervisors
- All timestamps are automatically tracked

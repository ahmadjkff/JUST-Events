# Socket.io Implementation - JUST Events

## Overview

Real-time event and notification system using Socket.io for:

1. **Event Creation**: Admins receive notifications when supervisors create events
2. **Event Status Changes**: Supervisors get real-time updates when admins approve/reject events
3. **Notifications**: All users receive real-time notifications
4. **Approved Events**: Students see newly approved events without page refresh
5. **Event Management**: Admins see status changes in real-time

## Backend Implementation

### 1. Socket.io Service (`backend/src/services/socketService.ts`)

**Status**: ✅ COMPLETED

- Initializes Socket.io server with CORS configuration
- Manages user connections with role-based room assignments
- Provides emit functions for:
  - `broadcastNewEvent()` - Send new event to all admins
  - `broadcastEventStatusChange()` - Send status update to specific supervisor
  - `broadcastEventStatusToStudents()` - Send status to multiple students
  - `broadcastNotification()` - Send notification to specific user
  - `broadcastBulkNotifications()` - Send notifications to multiple users
  - `broadcastApprovedEvent()` - Send approved event to all students

### 2. Backend Server Setup (`backend/src/index.ts`)

**Status**: ✅ COMPLETED

- Changed from `app.listen()` to `httpServer.listen()` for Socket.io compatibility
- Added Socket.io initialization with `createServer(app)`
- Made io instance accessible via `app.set("io", io)` for routes

### 3. Admin Service Updates (`backend/src/services/eventServices/adminService.ts`)

**Status**: ✅ COMPLETED

- `changeEventStatus()` now accepts optional `io` parameter
- Emits `event_status_changed` to supervisor when event is approved/rejected
- Emits notifications via Socket.io immediately when created
- Emits `event_approved` to all students when event is approved

### 4. Supervisor Service Updates (`backend/src/services/eventServices/supervisorService.ts`)

**Status**: ✅ COMPLETED

- `createEvent()` accepts optional `io` parameter
- Broadcasts new event to all admins via `new_event_created` event
- Emits notifications to admins immediately via Socket.io
- `approveOrRejectStudentApplication()` accepts optional `io` parameter
- Broadcasts registration decision notifications via Socket.io

### 5. Route Updates

**Status**: ✅ COMPLETED

- `backend/src/routes/eventRoutes/adminRoute.ts` - Passes io to changeEventStatus
- `backend/src/routes/eventRoutes/supervisorRoute.ts` - Passes io to createEvent and approveOrRejectStudentApplication

## Frontend Implementation

### 1. Socket Service (`frontend/src/services/socketService.ts`)

**Status**: ✅ COMPLETED

- Initializes Socket.io client with token and user info
- Manages socket connection lifecycle (connect, disconnect)
- Provides listener functions for:
  - `onNewNotification()` - Listen for new notifications
  - `onNewEventCreated()` - Listen for new events (admin)
  - `onEventStatusChanged()` - Listen for event status changes (supervisor)
  - `onEventApproved()` - Listen for approved events (student)
- Cleanup functions to remove listeners

### 2. Notification Provider Updates (`frontend/src/context/notification/NotificationProvider.tsx`)

**Status**: ⚠️ NEEDS REVIEW

- Socket.io initialization in useEffect with JWT token decoding
- Listens for `new_notification` events
- Adds notifications to state immediately without waiting for API call
- Auto-refresh fallback every 30 seconds

### 3. Browse Events Page (`frontend/src/pages/browseEvents.tsx`)

**Status**: ⚠️ NEEDS REVIEW

- Listens for `event_approved` events
- Refetches approved events when new event is approved
- Shows newly approved events to students without page refresh

### 4. Control Events Page (`frontend/src/features/admin/pages/ControlEvents.tsx`)

**Status**: ⚠️ NEEDS REVIEW

- Listens for `event_status_changed` events
- Refetches all event statuses when change detected
- Real-time sync across multiple admin sessions

### 5. Admin Dashboard (`frontend/src/features/admin/pages/Dashboard.tsx`)

**Status**: ⚠️ NEEDS REVIEW

- Uses `useNewEventListener()` hook
- Refetches pending events when new event is created
- Real-time dashboard updates

### 6. New Event Listener Hook (`frontend/src/hooks/useNewEventListener.ts`)

**Status**: ✅ COMPLETED

- Listens for new events in admin pages
- Shows toast notification
- Optional callback for custom handling

## Socket.io Event Flow

### Event 1: New Event Creation

1. Supervisor creates event → calls `/supervisor/create` route
2. Backend: `createEvent()` broadcasts via `new_event_created` to "admins" room
3. All connected admins receive notification in real-time
4. Admin dashboard refreshes pending events
5. Notification saved to database

### Event 2: Event Status Change (Approve/Reject)

1. Admin changes status → calls `/event/admin/change-status` route
2. Backend: `changeEventStatus()` broadcasts via `event_status_changed` to supervisor
3. Backend: Also broadcasts `event_approved` to all "students" if approved
4. Supervisor sees update in real-time in ControlEvents page
5. Students see new approved event in BrowseEvents without refresh
6. Notifications created and sent in real-time

### Event 3: Registration Decision

1. Supervisor approves/rejects registration → calls `/supervisor/approve-or-reject` route
2. Backend: `approveOrRejectStudentApplication()` emits notification via Socket.io
3. Student receives notification in real-time
4. Notification appears immediately in notifications page

### Event 4: New Notification

1. Any notification created → triggers socket broadcast
2. NotificationProvider receives `new_notification` event
3. Notification added to state immediately (no API call needed)
4. Notification appears in UI immediately
5. Unread count increments

## Configuration

### Server Port

- Backend Socket.io: `http://localhost:3000` (default Express port)
- Frontend Client: Connects to `http://localhost:3000`
- Update `frontend/src/services/socketService.ts` line with server URL if different

### JWT Token

- Socket.io auth uses JWT token from localStorage
- Token includes `userId` and `role` for authorization

## Testing

### Test Real-time Notifications

1. Open two browser windows as different users
2. Supervisor creates event in one window
3. Admin window should show notification immediately
4. No page refresh needed

### Test Event Approval

1. Supervisor creates event (admin sees real-time)
2. Admin approves event
3. Student in another window should see event appear in Browse Events immediately
4. Supervisor should see status change immediately

### Test Bulk Notifications

1. Supervisor approves event with registered students
2. All registered students receive notification in real-time
3. Check notifications page for multiple notifications

## Known Issues & TODOs

1. **Dashboard.tsx** - Hook usage in useEffect needs verification
2. **BrowseEvents.tsx** - Syntax errors from patch need fixing
3. **ControlEvents.tsx** - Syntax errors from patch need fixing
4. **Performance** - Consider throttling broadcasts for high-volume events
5. **Offline Handling** - Auto-reconnect configured but needs testing
6. **Error Handling** - Add error callbacks for failed operations

## Files Modified

### Backend

- ✅ `backend/src/index.ts` - HTTP server setup
- ✅ `backend/src/services/socketService.ts` - Created new
- ✅ `backend/src/services/eventServices/adminService.ts` - Socket.io integration
- ✅ `backend/src/services/eventServices/supervisorService.ts` - Socket.io integration
- ✅ `backend/src/routes/eventRoutes/adminRoute.ts` - Pass io instance
- ✅ `backend/src/routes/eventRoutes/supervisorRoute.ts` - Pass io instance

### Frontend

- ✅ `frontend/src/services/socketService.ts` - Created new
- ✅ `frontend/src/context/notification/NotificationProvider.tsx` - Socket.io initialization
- ⚠️ `frontend/src/pages/browseEvents.tsx` - Needs syntax review
- ⚠️ `frontend/src/features/admin/pages/ControlEvents.tsx` - Needs syntax review
- ⚠️ `frontend/src/features/admin/pages/Dashboard.tsx` - Needs syntax review
- ✅ `frontend/src/hooks/useNewEventListener.ts` - Created new

## Dependencies Added

### Backend

- `socket.io` - WebSocket server

### Frontend

- `socket.io-client` - WebSocket client
- `jwt-decode` - JWT token decoding

## Next Steps

1. Fix syntax errors in corrupted frontend files
2. Test Socket.io connections with browser DevTools
3. Verify all broadcasts are received correctly
4. Add error logging for debugging
5. Test with multiple concurrent users
6. Implement rate limiting if needed
7. Consider adding socket.io middleware for more complex auth

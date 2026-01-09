import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (token: string, userId: string, userRole: string) => {
  if (socket) return socket;

  socket = io("http://localhost:3000", {
    auth: {
      token,
      userId,
      userRole,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket!.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

// Listen for new notifications
export const onNewNotification = (callback: (notification: any) => void) => {
  if (socket) {
    socket.on("new_notification", callback);
  }
};

// Listen for new event creation (admin)
export const onNewEventCreated = (callback: (event: any) => void) => {
  if (socket) {
    socket.on("new_event_created", callback);
  }
};

// Listen for event status changes (supervisor)
export const onEventStatusChanged = (callback: (data: any) => void) => {
  if (socket) {
    socket.on("event_status_changed", callback);
  }
};

// Listen for approved events (student)
export const onEventApproved = (callback: (event: any) => void) => {
  if (socket) {
    socket.on("event_approved", callback);
  }
};

// Remove listeners
export const removeNotificationListener = (callback: (notification: any) => void) => {
  if (socket) {
    socket.off("new_notification", callback);
  }
};

export const removeNewEventListener = (callback: (event: any) => void) => {
  if (socket) {
    socket.off("new_event_created", callback);
  }
};

export const removeStatusChangeListener = (callback: (data: any) => void) => {
  if (socket) {
    socket.off("event_status_changed", callback);
  }
};

export const removeApprovedEventListener = (callback: (event: any) => void) => {
  if (socket) {
    socket.off("event_approved", callback);
  }
};

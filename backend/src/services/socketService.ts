import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

// Map to track connected users by their userId
const connectedUsers: Map<string, Set<string>> = new Map();

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware to verify JWT token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    // Token verification can be added here if needed
    next();
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth.userId;
    const userRole = socket.handshake.auth.userRole;

    // Track connected users
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId)!.add(socket.id);

    console.log(
      `User ${userId} (${userRole}) connected with socket ${socket.id}`
    );

    // Join user to a personal room for targeted messages
    socket.join(`user_${userId}`);

    // Join role-based rooms for broadcasting
    if (userRole === "admin") {
      socket.join("admins");
    } else if (userRole === "supervisor") {
      socket.join("supervisors");
    } else if (userRole === "student") {
      socket.join("students");
    }

    // Handle disconnection
    socket.on("disconnect", () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

// Export functions to emit events
export const emitToUser = (
  io: Server,
  userId: string,
  event: string,
  data: any
) => {
  io.to(`user_${userId}`).emit(event, data);
};

export const emitToRole = (
  io: Server,
  role: string,
  event: string,
  data: any
) => {
  const roomName =
    role === "admin"
      ? "admins"
      : role === "supervisor"
        ? "supervisors"
        : "students";
  io.to(roomName).emit(event, data);
};

export const broadcastToAll = (io: Server, event: string, data: any) => {
  io.emit(event, data);
};

// Emit new event to all admins
export const broadcastNewEvent = (io: Server, event: any) => {
  emitToRole(io, "admin", "new_event_created", {
    event,
    timestamp: new Date(),
  });
};

// Emit event status change to supervisor
export const broadcastEventStatusChange = (
  io: Server,
  supervisorId: string,
  event: any,
  status: string
) => {
  emitToUser(io, supervisorId, "event_status_changed", {
    event,
    status,
    timestamp: new Date(),
  });
};

// Emit event status change to students with registered status
export const broadcastEventStatusToStudents = (
  io: Server,
  studentIds: string[],
  event: any,
  status: string
) => {
  studentIds.forEach((studentId) => {
    emitToUser(io, studentId, "event_status_changed", {
      event,
      status,
      timestamp: new Date(),
    });
  });
};

// Emit notification to specific user
export const broadcastNotification = (
  io: Server,
  userId: string,
  notification: any
) => {
  emitToUser(io, userId, "new_notification", {
    notification,
    timestamp: new Date(),
  });
};

// Emit bulk notifications
export const broadcastBulkNotifications = (
  io: Server,
  userIds: string[],
  notification: any
) => {
  userIds.forEach((userId) => {
    emitToUser(io, userId, "new_notification", {
      notification,
      timestamp: new Date(),
    });
  });
};

// Emit approved event to students for browse events page
export const broadcastApprovedEvent = (io: Server, event: any) => {
  emitToRole(io, "student", "event_approved", {
    event,
    timestamp: new Date(),
  });
};

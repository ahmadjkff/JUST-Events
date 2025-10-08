import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "../context/auth/AuthContext";
import { useEvent } from "../context/event/EventContext";
import type { IEvent } from "../types/eventTypes";
import { cancelRegistration } from "../features/student/services/cancelService";
import { registerForEvent } from "../features/student/services/registerService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteEvent } from "../features/supervisor/services/supervisorRequests";

const EventCard = ({ event }: { event: IEvent }) => {
  const { user } = useAuth();
  const { fetchEvents, eventsByStatus } = useEvent();
  const navigate = useNavigate();
  const [registrationStatuses, setRegistrationStatuses] = useState<
    Record<string, string>
  >({});
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStudentRegistrations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/event/student-registrations/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!res.ok) return;
        const data = await res.json();

        // Convert list into { [eventId]: status }
        const mappedStatuses = Object.fromEntries(
          data.data.map((r: any) => [r.event, r.status]),
        );

        setRegistrationStatuses(mappedStatuses);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) fetchStudentRegistrations();
  }, [user?._id]);

  const handleDeleteEvent = async (eventId: string) => {
    const result = await deleteEvent(eventId);
    if (result.success) {
      fetchEvents("approved");
    }
  };
  const getCategoryColor = (category: string) => {
    const colors = {
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Business:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Career:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };
  const checkIsStudentRegistered = (studentId: string, eventId: string) => {
    const event = eventsByStatus?.approved?.find((e) => e._id === eventId);
    return event ? event.registeredStudents.includes(studentId) : false;
  };

  const handleRegister = async (eventId: string, userId: string) => {
    await registerForEvent(eventId, userId);
    await fetchEvents("approved");
  };

  const handleRegistrationCancel = async (eventId: string, userId: string) => {
    try {
      const result = await cancelRegistration(eventId, userId);
      if (result.success) {
        // Clear that event’s status locally
        setRegistrationStatuses((prev) => {
          const updated = { ...prev };
          delete updated[eventId];
          return updated;
        });

        // Refetch the latest events from the server
        await fetchEvents("approved");
      } else {
        console.error("Failed to cancel registration:", result.message);
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
    }
  };
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
          <div className="flex gap-2">
            {!checkIsStudentRegistered(user?._id!, event._id) &&
              !registrationStatuses[event._id] && (
                <Button onClick={() => handleRegister(event._id, user?._id!)}>
                  {t("register")}
                </Button>
              )}

            {(checkIsStudentRegistered(user?._id!, event._id) ||
              registrationStatuses[event._id] === "pending" ||
              registrationStatuses[event._id] === "approved") && (
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleRegistrationCancel(event._id, user?._id!)}
              >
                Cancel Registration
              </Button>
            )}

            <Link to={`/event/${event._id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            {event.createdBy === user?._id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-red-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-600">
                      Delete Event
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Are you sure you want to Delete <b>{event.title} Event</b>
                      ? <br />
                      This action{" "}
                      <span className="font-semibold text-red-500">
                        cannot be undone
                      </span>{" "}
                      and attendees will lose access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300">
                      Close
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEvent(event._id)}
                      className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {event.createdBy === user?._id && (
              <Button
                size="sm"
                className="bg-blue-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg"
                onClick={() => navigate(`/supervisor/edit-event/${event._id}`)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {event.date.split("T")[0]}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {event.createdAt.split("T")[1]}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <Link to={`/registred-students/${event._id}`}>
              {event.registeredStudents.length} Attendees
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "../context/auth/AuthContext";
import { useEvent } from "../context/event/EventContext";
import type { IEvent } from "../types/eventTypes";
import { cancelRegistration } from "../features/student/services/cancelService";
import { registerForEvent } from "../features/student/services/registerService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchStudentRegistrations } from "../features/student/services/StudentService";

const EventCard = ({ event }: { event: IEvent }) => {
  const { user } = useAuth();
  const { fetchEvents } = useEvent();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const { t } = useTranslation();

  // Fetch all student registrations once
  useEffect(() => {
    if (!user?._id) return;

    const getRegistrations = async () => {
      const result = await fetchStudentRegistrations(user._id);
      if (result.success) {
        setRegistrations(result.data);
      }
    };

    getRegistrations();
  }, [user?._id]);

  // Helper to get registration status by eventId
  const getStatusForEvent = (eventId: string) => {
    const reg = registrations.find((r) => r.event === eventId);
    return reg ? reg.status : null;
  };

  const handleRegister = async (eventId: string, userId: string) => {
    await registerForEvent(eventId, userId);
    await fetchEvents("approved");

    setRegistrations((prev) => [
      ...prev,
      { event: eventId, status: "pending" },
    ]);
  };

  const handleRegistrationCancel = async (eventId: string, userId: string) => {
    try {
      const result = await cancelRegistration(eventId, userId);
      if (result.success) {
        setRegistrations((prev) => prev.filter((r) => r.event !== eventId));
        await fetchEvents("approved");
      } else {
        console.error("Failed to cancel registration:", result.message);
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
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
      Education:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Sports: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      Culture: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const status = getStatusForEvent(event._id);

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
            {!status && (
              <Button onClick={() => handleRegister(event._id, user?._id!)}>
                {t("eventDetails.register")}
              </Button>
            )}

            {(status === "approved" || status === "pending") && (
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleRegistrationCancel(event._id, user?._id!)}
              >
                {t("eventDetails.cancelRegistration")}
              </Button>
            )}

            <Link to={`/event/${event._id}`}>
              <Button variant="outline" size="sm">
                {t("eventDetails.details")}
              </Button>
            </Link>
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
            {event.startTime
              ? `${t("eventDetails.startsAt")} ${event.startTime}`
              : "N/A"}{" "}
            {event.endTime
              ? `- ${t("eventDetails.endsAt")} ${event.endTime}`
              : ""}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {t("eventDetails.location")}: {event.location}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <Link to={`/registred-students/${event._id}`}>
              {event.registeredStudents.length} {t("eventDetails.attendees")}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;

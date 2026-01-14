import { Card, CardTitle } from "./ui/Card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "../context/auth/AuthContext";
import { useEvent } from "../context/event/EventContext";
import { EventStatus, type IEvent } from "../types/eventTypes";
import { cancelRegistration } from "../features/student/services/cancelService";
import { registerForEvent } from "../features/student/services/registerService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchStudentRegistrations } from "../features/student/services/StudentService";
import { getCategoryColor } from "../constantColors";
import { volunteerForEvent } from "../features/student/services/volunteerService";
import toast from "react-hot-toast";

const EventCard = ({ event }: { event: IEvent }) => {
  const { user } = useAuth();
  const { fetchEvents } = useEvent();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // <-- added loading
  const { t } = useTranslation();

  // Fetch all student registrations once
  useEffect(() => {
    if (!user?._id) return;

    const getRegistrations = async () => {
      setLoading(true); // start loading
      const result = await fetchStudentRegistrations();
      if (result.success) {
        setRegistrations(result.data);
      }
      setLoading(false); // done loading
    };
    getRegistrations();
  }, [user?._id]);

  // Helper to get registration status by eventId
  const getRegistrationStatus = (eventId: string) => {
    const reg = registrations.find((r) => r.event === eventId);
    return reg
      ? !reg.isVolunteer &&
          (reg.status === EventStatus.Approved ||
            reg.status === EventStatus.Pending)
      : null;
  };

  const getVolunteerStatus = (eventId: string) => {
    const reg = registrations.find((r) => r.event === eventId);
    return reg
      ? reg.isVolunteer &&
          (reg.status === EventStatus.Approved ||
            reg.status === EventStatus.Pending)
      : null;
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

  const handleVolunteer = async (eventId: string, userId: string) => {
    try {
      await volunteerForEvent(eventId, userId);
      await fetchEvents("approved");
      setRegistrations((prev) => [
        ...prev,
        { event: eventId, status: "pending", isVolunteer: true },
      ]);
      toast.success("Successfully volunteered for the event");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to volunteer for event",
      );
    }
  };

  const registrationStatus = getRegistrationStatus(event._id);
  const volunteerStatus = getVolunteerStatus(event._id);

  const currentRegistration = registrations.find((r) => r.event === event._id);
  const currentVolunteer = registrations.find(
    (r) => r.event === event._id && r.isVolunteer,
  );

  if (loading)
    return (
      <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="flex h-60 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-muted-foreground text-sm">Loading event...</p>
          </div>
        </div>
      </Card>
    );

  return (
    <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
      <div className="flex h-60">
        {/* LEFT IMAGE */}
        <div className="w-56 shrink-0">
          <img
            src={`${import.meta.env.VITE_BASE_URL}${event?.img}`}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between p-4">
            <div className="space-y-2">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <Badge className={getCategoryColor(event.category)}>
                {event.category}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {!registrationStatus && !volunteerStatus && (
                <Button onClick={() => handleRegister(event._id, user?._id!)}>
                  {t("eventDetails.register")}
                </Button>
              )}
              {registrationStatus && !volunteerStatus && (
                <div className="flex items-center gap-3">
                  <p
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      currentRegistration?.status === "approved"
                        ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100"
                        : currentRegistration?.status === "pending"
                          ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100"
                    }`}
                  >
                    {currentRegistration?.status}
                  </p>

                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    size="sm"
                    onClick={() =>
                      handleRegistrationCancel(event._id, user?._id!)
                    }
                  >
                    {t("eventDetails.cancelRegistration")}
                  </Button>
                </div>
              )}
              {!registrationStatus && !volunteerStatus && (
                <Button onClick={() => handleVolunteer(event._id, user?._id!)}>
                  volunteer
                </Button>
              )}
              {volunteerStatus && !registrationStatus && (
                <div className="flex items-center gap-3">
                  <p
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      currentVolunteer?.status === "approved"
                        ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100"
                        : currentVolunteer?.status === "pending"
                          ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100"
                    }`}
                  >
                    {currentVolunteer?.status}
                  </p>
                </div>
              )}
              {volunteerStatus && !registrationStatus && (
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() =>
                    handleRegistrationCancel(event._id, user?._id!)
                  }
                >
                  cancel Volunteer
                </Button>
              )}
              <Link to={`/event/${event._id}`}>
                <Button variant="outline" size="sm">
                  {t("eventDetails.details")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            <p className="text-muted-foreground mb-4">{event.description}</p>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event?.date?.split("T")[0]}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.startTime}-{event.endTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {t("eventDetails.location")}: {event.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <Link to={`/registred-students/${event._id}`}>
                  {event?.registeredStudents?.length} / {event.capacity}{" "}
                  {t("eventDetails.attendees")}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <Link to={`/volunteered-students/${event._id}`}>
                  {event?.volunteers?.length} {t("eventDetails.volunteers")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;

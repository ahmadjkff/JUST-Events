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
    if (!user?._id) {
      setLoading(false);
      return;
    }

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
        <div className="flex min-h-[200px] items-center justify-center p-4 md:h-60">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-muted-foreground text-sm">Loading event...</p>
          </div>
        </div>
      </Card>
    );

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      {/* IMAGE - Takes full card height */}
      <div className="min-h-[200px] flex-1 sm:min-h-[300px]">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${event?.img}`}
          alt={event.title}
          className="h-90 w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* CONTENT - Fixed at bottom */}
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        {/* Title and Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="text-base break-words sm:text-lg">
              {event.title}
            </CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            {event.status === "approved" && (
              <>
                {!registrationStatus && !volunteerStatus && (
                  <Button
                    onClick={() => handleRegister(event._id, user?._id!)}
                    className="flex-1 text-xs sm:flex-none sm:text-sm"
                    size="sm"
                  >
                    {t("eventDetails.register")}
                  </Button>
                )}
                {registrationStatus && !volunteerStatus && (
                  <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <p
                      className={`rounded-full px-2 py-1 text-center text-xs font-medium sm:px-3 sm:text-sm ${
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
                      className="flex-1 bg-red-500 text-xs text-white hover:bg-red-600 sm:flex-none sm:text-sm"
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
                  <Button
                    onClick={() => handleVolunteer(event._id, user?._id!)}
                    className="flex-1 text-xs sm:flex-none sm:text-sm"
                    size="sm"
                  >
                    volunteer
                  </Button>
                )}
                {volunteerStatus && !registrationStatus && (
                  <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <p
                      className={`rounded-full px-2 py-1 text-center text-xs font-medium sm:px-3 sm:text-sm ${
                        currentVolunteer?.status === "approved"
                          ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100"
                          : currentVolunteer?.status === "pending"
                            ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100"
                            : "bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100"
                      }`}
                    >
                      {currentVolunteer?.status}
                    </p>
                    <Button
                      className="flex-1 bg-red-500 text-xs text-white hover:bg-red-600 sm:flex-none sm:text-sm"
                      size="sm"
                      onClick={() =>
                        handleRegistrationCancel(event._id, user?._id!)
                      }
                    >
                      cancel Volunteer
                    </Button>
                  </div>
                )}
              </>
            )}
            <Link to={`/event/${event._id}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs sm:w-auto sm:text-sm"
              >
                {t("eventDetails.details")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Description */}
        <div
          className="text-muted-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground line-clamp-2 text-sm sm:line-clamp-3 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:dark:bg-gray-800 [&_em]:italic [&_h1]:mt-1 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mt-1 [&_h2]:mb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mt-1 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h4]:mb-1 [&_h4]:text-sm [&_h4]:font-semibold [&_li]:mb-0.5 [&_li]:text-sm [&_ol]:mb-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:mb-1.5 [&_p]:leading-relaxed [&_strong]:font-semibold [&_u]:underline [&_ul]:mb-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        {/* Metadata */}
        <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{event?.date?.split("T")[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">
              {event.startTime}-{event.endTime}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">
              {t("eventDetails.location")}: {event.location}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <Link
              to={`/registred-students/${event._id}`}
              className="truncate hover:underline"
            >
              {event?.registeredStudents?.length} / {event.capacity}{" "}
              {t("eventDetails.attendees")}
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <Link
              to={`/volunteered-students/${event._id}`}
              className="truncate hover:underline"
            >
              {event?.volunteers?.length} {t("eventDetails.volunteers")}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;

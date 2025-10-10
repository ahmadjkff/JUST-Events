import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EventStatus, type IEvent, type IFeedback } from "../types/eventTypes";
import { useTranslation } from "react-i18next";

function EventDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent>();

  const fetchEvent = async (eventId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/event/${eventId}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const data = await response.json();

    setEvent(data.data.event);
  };

  useEffect(() => {
    fetchEvent(id || "");
  }, [id]);

  return (
    <div className="bg-background flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Event Image */}
          <img
            src={`${import.meta.env.VITE_BASE_URL}${event?.img}`}
            alt={event?.title}
            className="h-64 w-full rounded-xl object-cover shadow-md"
          />

          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {event?.title}
                </CardTitle>
                <Badge variant="secondary">
                  {event?.category.toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">{event?.department.toUpperCase()}</p>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">
                📅 <span className="font-medium">{t("event.date")}:</span>
                {` ${event?.date.split("T")[0]} ${t("event.at")} 
                 ${event?.startTime ? event.startTime : t("event.nA")} 
                 ${event?.endTime ? `- ${event.endTime}` : ""}`}
              </p>
              <p className="flex items-center gap-2">
                📍 <span className="font-medium">{t("event.location")}:</span>
                {event?.location}
              </p>
              <p className="text-foreground">{event?.description}</p>
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">{t("event.volunteers")}:</span>
                {event?.volunteers.length}
              </p>
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">{t("event.attendees")}:</span>
                {event?.registeredStudents.length}
              </p>
              <p className="flex items-center gap-2">
                📌 <span className="font-medium">{t("event.status")}:</span>
                <Badge
                  className={`${
                    event?.status === EventStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : event?.status === EventStatus.Approved
                      ? "bg-green-100 text-green-800"
                      : event?.status === EventStatus.Rejected
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(`eventStatus.${event?.status}`)}
                </Badge>
              </p>
            </CardContent>
          </Card>

          {/* Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t("event.feedbacks")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Feedback */}
              <div className="space-y-3 border-t pt-4">
                <p className="font-semibold">{t("event.addFeedback")}</p>
                <div className="flex gap-2 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 cursor-pointer" />
                  ))}
                </div>
                <Textarea placeholder={t("event.writeComment")} />
                <Button className="mt-2">{t("event.submitFeedback")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;

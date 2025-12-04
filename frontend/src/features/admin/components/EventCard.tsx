import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { type IEvent } from "../../../types/eventTypes";
import { useTranslation } from "react-i18next";
import { getCategoryColor } from "../../../constantColors";

const EventCard = ({
  event,
  updateStatus,
}: {
  event: IEvent;
  updateStatus: any;
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <CardHeader>
        <div
          className={`flex items-start justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="space-y-2">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
        </div>

        {/* ===== Buttons ===== */}
        <div className={`flex gap-2 px-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          {event.status !== "approved" && (
            <Button
              variant="outline"
              className="border-green-100 bg-green-100"
              onClick={() => updateStatus(event._id, "approved")}
            >
              {t("buttons.approve")}
            </Button>
          )}
          {event.status !== "pending" && (
            <Button
              variant="outline"
              className="border-gray-100 bg-gray-100"
              onClick={() => updateStatus(event._id, "pending")}
            >
              {t("buttons.setPending")}
            </Button>
          )}
          {event.status !== "rejected" && (
            <Button
              variant="outline"
              className="border-red-100 bg-red-100"
              onClick={() => updateStatus(event._id, "rejected")}
            >
              {t("buttons.reject")}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        <div
          className={`text-muted-foreground flex flex-wrap gap-4 text-sm ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : t("common.na")}
          </div>
          <div className="flex items-center gap-1">
            Start
            <Clock className="h-4 w-4" />
            {event.startTime ? event.startTime : t("common.na")}
          </div>
          <div className="flex items-center gap-1">
            End
            <Clock className="h-4 w-4" />
            {event.startTime ? event.endTime : t("common.na")}
          </div>
          <a
            href="https://www.google.com/maps/place/%D9%85%D8%AF%D8%B1%D8%AC+%D8%A7%D8%A8%D9%86+%D8%B3%D9%8A%D9%86%D8%A7%E2%80%AD"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </a>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {event.volunteers?.length} {t("event.attendees")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;

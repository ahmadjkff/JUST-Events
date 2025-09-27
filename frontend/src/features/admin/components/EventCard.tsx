import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { EventCategory, type IEvent } from "../../../types/eventTypes";

const getCategoryColor = (category: string) => {
  const colors = {
    [EventCategory.Tech]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    [EventCategory.Health]:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    [EventCategory.Education]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    [EventCategory.Community]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    [EventCategory.Arts]:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    [EventCategory.Other]:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const EventCard = ({
  event,
  updateStatus,
}: {
  event: IEvent;
  updateStatus: any;
}) => (
  <Card className="transition-shadow hover:shadow-md">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge className={getCategoryColor(event.category)}>
            {event.category.toUpperCase()}
          </Badge>
        </div>
      </div>
      <div className="flex justify-end gap-2 px-6">
        <Button
          variant={"outline"}
          className={`border-green-100 bg-green-100 text-green-800 ${event.status === "approved" ? "hidden" : ""}`}
          onClick={() => updateStatus(event._id, "approved")}
        >
          Approve
        </Button>
        <Button
          variant={"outline"}
          className={`border-gray-100 bg-gray-100 text-gray-800 ${event.status === "pending" ? "hidden" : ""}`}
          onClick={() => updateStatus(event._id, "pending")}
        >
          Set To Pending
        </Button>
        <Button
          variant={"outline"}
          className={`border-red-100 bg-red-100 text-red-800 ${event.status === "rejected" ? "hidden" : ""}`}
          onClick={() => updateStatus(event._id, "rejected")}
        >
          Reject
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <p className="text-muted-foreground mb-4">{event.description}</p>
      <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {event.createdAt
            ? new Date(event.createdAt).toLocaleTimeString()
            : "N/A"}
        </div>
        <a href="https://www.google.com/maps/place/%D9%85%D8%AF%D8%B1%D8%AC+%D8%A7%D8%A8%D9%86+%D8%B3%D9%8A%D9%86%D8%A7%E2%80%AD/@32.4965546,35.9911206,44m/data=!3m1!1e3!4m14!1m7!3m6!1s0x151b89381a3b428f:0xfd149214da321b7d!2z2KzYp9mF2LnYqSDYp9mE2LnZhNmI2YUg2YjYp9mE2KrZg9mG2YjZhNmI2KzZitinINin2YTYp9ix2K_ZhtmK2Kk!8m2!3d32.4949069!4d35.9860433!16zL20vMGNwbjE5!3m5!1s0x151b890061dec065:0xe9e762c6a1de6eb2!8m2!3d32.4966205!4d35.9909166!16s%2Fg%2F11vz11wx15?entry=ttu&g_ep=EgoyMDI1MDkyMi4wIKXMDSoASAFQAw%3D%3D">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
        </a>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {event.volunteers?.length} attendees
        </div>
      </div>
    </CardContent>
  </Card>
);

export default EventCard;

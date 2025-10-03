import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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

function EventDetails() {
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
          {/* صورة الحدث */}
          <img
            src={`${import.meta.env.VITE_BASE_URL}${event?.img}`}
            alt={event?.title}
            className="h-64 w-full rounded-xl object-cover shadow-md"
          />

          {/* تفاصيل الحدث */}
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
              <p className="text-muted-foreground">
                {event?.department.toUpperCase()}
              </p>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">
                📅 <span className="font-medium">Date:</span>
                {` ${event?.date.split("T")[0]} At
                 ${event?.date ? new Date(event.date).toLocaleTimeString() : ""}`}
              </p>
              <p className="flex items-center gap-2">
                📍 <span className="font-medium">Location:</span>
                {event?.location}
              </p>
              <p className="text-foreground">{event?.description}</p>
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">Volunteers:</span>
                {event?.volunteers.length}
              </p>
              <p className="flex items-center gap-2">
                👥 <span className="font-medium">Atendees:</span>
                {event?.registeredStudents.length}
              </p>
              <p className="flex items-center gap-2">
                📌 <span className="font-medium">Status:</span>
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
                  {event?.status}
                </Badge>
              </p>
              {/* {!event.isVolunteer && (
                <Button className="mt-4">🤝 Volunteer for this Event</Button>
              )} */}
            </CardContent>
          </Card>

          {/* Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Feedbacks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* {event?.feedback.length! > 0 ? (
                event?.feedback.map((fb: IFeedback) => (
                  <div key={fb.student._id} className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={fb.student.img} alt={fb.student.img} />
                      <AvatarFallback>
                        {fb.student.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{fb.user}</p>
                      <div className="mb-1 flex text-yellow-500">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{fb.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No feedbacks yet.</p>
              )} */}

              {/* إضافة Feedback */}
              <div className="space-y-3 border-t pt-4">
                <p className="font-semibold">Add your feedback</p>
                <div className="flex gap-2 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 cursor-pointer" />
                  ))}
                </div>
                <Textarea placeholder="Write your comment..." />
                <Button className="mt-2">Submit Feedback</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;

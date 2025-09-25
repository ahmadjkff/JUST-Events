import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventCard() {
  const { eventId } = useParams();
  const { getEventById, isLoading, event, applications } = useSupervisor();
  const navigate = useNavigate();
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      await getEventById(eventId);
    };
    fetchEvent();
  }, [eventId]);

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;
  if (!event)
    return <p className="mt-10 text-center text-red-500">Event not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Card className="mx-auto w-full max-w-5xl rounded-3xl border p-8 shadow-2xl">
        <CardHeader className="mb-6">
          <h2 className="text-4xl font-extrabold text-gray-900">
            {event.title}
          </h2>
          <p className="mt-3 text-lg text-gray-700">{event.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 text-lg text-gray-800 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-red-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-500" />
              <span>{applications.length} students registered</span>
            </div>
            <div>
              <span className="font-semibold">Category:</span>{" "}
              <span>{event.category}</span>
            </div>
            <div>
              <span className="font-semibold">Department:</span>{" "}
              <span>{event.department}</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => navigate(`/supervisor/event/${event._id}/applications`)}
              className="bg-blue-600 px-8 py-4 text-lg font-semibold hover:bg-blue-700"
            >
              Manage Applications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

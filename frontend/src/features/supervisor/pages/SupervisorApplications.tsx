import { useEffect } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SupervisorApplications() {
  const { events, fetchSupervisorApplications, isLoading } = useSupervisor();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupervisorApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Supervisor Events</h1>

      {events.length === 0 && <p className="text-gray-500">No events found.</p>}

      {events.map(({ event, applications }) => (
        <Card
          key={event._id}
          className="rounded-xl border border-gray-200 shadow-md cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() =>
            navigate(`/supervisor/event/${event._id}`, {
              state: { event: { ...event }, applications },
            })
          }
        >
          <CardHeader className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">{event.location}</p>
              <p className="mt-1 text-sm font-medium">
                Status:{" "}
                <span
                  className={
                    event.status === "approved"
                      ? "text-green-600"
                      : event.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {event.status.toUpperCase()}
                </span>
              </p>
              <p className="mt-1 text-sm font-medium">
                Approved Students:{" "}
                <span className="text-blue-600">
                  {applications.filter((app) => app.status === "approved").length}
                </span>
              </p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default SupervisorApplications;

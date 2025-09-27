import { useEffect, useState } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Loader2, AlertTriangle } from "lucide-react"; // for error icon
import { useNavigate } from "react-router-dom";
import { exportRegisterdStudentList } from "../services/supervisorRequests";

function SupervisorApplications() {
  const { events, fetchSupervisorApplications, isLoading } = useSupervisor();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlexportStudentList = async (eventId: string) => {
    try {
      const result = await exportRegisterdStudentList(eventId);
      if (!result.success) {
        console.log(result);
        setErrorMessage(
          result.message || "Failed to export registered students",
        );
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An unexpected error occurred while exporting.");
    }

    // Hide the error after 5 seconds
    setTimeout(() => setErrorMessage(null), 5000);
  };

  useEffect(() => {
    fetchSupervisorApplications("approved");
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
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Supervisor Events
      </h1>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {events.length === 0 && <p className="text-gray-500">No events found.</p>}

      {events.map(({ event, applications }) => (
        <Card
          key={event._id}
          className="cursor-pointer rounded-xl border border-gray-200 shadow-md transition-shadow hover:shadow-xl"
          onClick={() =>
            navigate(`/supervisor/event/${event._id}`, {
              state: { event: { ...event }, applications },
            })
          }
        >
          <CardHeader className="flex items-center justify-between">
            {/* Left side (event info) */}

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {event.title}
              </h2>
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
                  {
                    applications.filter((app: any) => app.status === "approved")
                      .length
                  }
                </span>
              </p>
            </div>

            {/* Right side (buttons) */}
            <div className="flex gap-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  navigate(`/supervisor/event/${event._id}/applications`);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Manage Applications
              </Button>
              <Button
                onClick={async (e) => {
                  e.stopPropagation(); // prevent card click
                  await handlexportStudentList(event._id);
                }}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Export Registered Students
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default SupervisorApplications;

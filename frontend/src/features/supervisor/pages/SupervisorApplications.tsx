import { useEffect, useState } from "react";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { exportRegisterdStudentList, deleteEvent } from "../services/supervisorRequests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../../../components/ui/AlertDialog";
import { useTranslation } from "react-i18next";

function SupervisorApplications() {
  const { t } = useTranslation();
  const { events, fetchSupervisorApplications, isLoading } = useSupervisor();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ---------------- Pagination ---------------- */
  const EVENTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  // Reset page when events list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [events.length]);
  /* -------------------------------------------- */

  const handlexportStudentList = async (eventId: string) => {
    try {
      const result = await exportRegisterdStudentList(eventId);
      if (!result.success) {
        setErrorMessage(result.message || t("supervisorApplications.errors.exportFailed"));
      }
    } catch (error) {
      setErrorMessage(t("supervisorApplications.errors.unexpectedErrorExport"));
    }
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const result = await deleteEvent(eventId);
      if (result.success) {
        await fetchSupervisorApplications("approved");
      } else {
        setErrorMessage(result.message || t("supervisorApplications.errors.deleteFailed"));
      }
    } catch (error) {
      setErrorMessage(t("supervisorApplications.errors.unexpectedErrorDelete"));
    }
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
        {t("supervisorApplications.header.title")}
      </h1>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {events.length === 0 && (
        <p className="text-gray-500">{t("supervisorApplications.noEventsFound")}</p>
      )}

      {currentEvents.map(({ event, applications }) => (
        <Card
          key={event._id}
          className="cursor-pointer rounded-xl border border-gray-200 shadow-md transition-shadow hover:shadow-xl"
          onClick={() =>
            navigate(`/event/${event._id}`, {
              state: { event: { ...event }, applications },
            })
          }
        >
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Event Info */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{event.location}</p>
              <p className="mt-1 text-sm font-medium">
                {t("supervisorApplications.status")}:{" "}
                <span
                  className={
                    event.status === "approved"
                      ? "text-green-600"
                      : event.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {t(`eventApplicationsStatus.${event.status}`)}
                </span>
              </p>
              <p className="mt-1 text-sm font-medium">
                {t("supervisorApplications.approvedStudents")}:{" "}
                <span className="text-blue-600">
                  {applications.filter((app: any) => app.status === "approved").length}
                </span>
              </p>
               <p className="mt-1 text-sm font-medium">
                {t("supervisorApplications.capacity")}:{" "}
                <span className="text-blue-600">
                  {event.capacity}
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-2 flex flex-col gap-3 sm:mt-0">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/supervisor/event/${event._id}/applications`);
                }}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {t("supervisorApplications.manageApplications")}
              </Button>

              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  await handlexportStudentList(event._id);
                }}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {t("supervisorApplications.exportRegisteredStudents")}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/supervisor/edit-event/${event._id}`);
                }}
                className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
              >
                {t("supervisorApplications.editEvent")}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-red-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("supervisorApplications.deleteEvent")}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent
                  className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold text-red-600">
                        {t("supervisorApplications.deleteEventTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        {t("supervisorApplications.deleteEventDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end gap-3">
                      <AlertDialogCancel className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300">
                        {t("supervisorApplications.close")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteEvent(event._id)}
                        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md"
                      >
                        {t("supervisorApplications.yesDelete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("common.previous")}
          </Button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("common.next")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SupervisorApplications;

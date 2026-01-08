import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { updateApplicationStatus } from "../services/supervisorRequests";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export default function EventApplications() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { getEventById, event, applications, isLoading } = useSupervisor();

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!eventId) return;
    getEventById(eventId);
  }, [eventId]);

  const handleUpdate = async (
    studentId: string,
    action: "approved" | "rejected" | "pending",
  ) => {
    if (!eventId) return;
    await updateApplicationStatus(eventId, studentId, action);
    await getEventById(eventId);
  };

  if (isLoading)
    return <p className="mt-10 text-center">{t("eventApplications.loading")}</p>;

  if (!event)
    return (
      <p className="mt-10 text-center text-red-500">
        {t("eventApplications.eventNotFound")}
      </p>
    );

  // 🔹 Pagination logic
  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen p-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        {event.title} - {t("eventApplications.applications")}
      </h1>

      {applications.length === 0 && (
        <p className="text-gray-500">
          {t("eventApplications.noApplications")}
        </p>
      )}

      {/* 🔹 Applications list */}
      {paginatedApplications.map((app: any) => (
        <Card key={app._id} className="mb-4 p-4 shadow-md">
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {app.student.firstName} {app.student.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {app.student.email}
              </p>
              <p className="mt-1 text-sm font-medium">
                {t("eventApplications.status")}:{" "}
                <span
                  className={
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }
                >
                  {t(`eventApplicationsStatus.${app.status}`)}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleUpdate(app.student._id, "approved")}
              >
                {t("eventApplications.approve")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleUpdate(app.student._id, "rejected")}
              >
                {t("eventApplications.reject")}
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleUpdate(app.student._id, "pending")}
              >
                {t("eventApplications.pending")}
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}

      {/* 🔹 Pagination buttons */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
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
        </div>
      )}
    </div>
  );
}

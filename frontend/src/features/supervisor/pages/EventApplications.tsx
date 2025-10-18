import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { updateApplicationStatus } from "../services/supervisorRequests";
import { useTranslation } from "react-i18next";  // إضافة الترجمة

export default function EventApplications() {
  const { t } = useTranslation();  // استخدام الترجمة
  const { eventId } = useParams();
  const { getEventById, event, applications, isLoading } = useSupervisor();

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
    // refetch to update the list
    await getEventById(eventId);
  };

  if (isLoading) return <p className="mt-10 text-center">{t("eventApplications.loading")}</p>;
  if (!event)
    return <p className="mt-10 text-center text-red-500">{t("eventApplications.eventNotFound")}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        {event.title} - {t("eventApplications.applications")}
      </h1>

      {applications.length === 0 && (
        <p className="text-gray-500">{t("eventApplications.noApplications")}</p>
      )}

      {applications.map((app: any) => (
        <Card key={app._id} className="mb-4 p-4 shadow-md">
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {app.student.firstName} {app.student.lastName}
              </p>
              <p className="text-sm text-gray-600">{app.student.email}</p>
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
                  {app.status.toUpperCase()}
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
    </div>
  );
}

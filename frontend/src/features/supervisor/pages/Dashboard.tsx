import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Calendar, CalendarCheck, User, XCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next"; 
import { useSupervisor } from "../../../context/supervisor/SupervisorContext";

function Dashboard() {
  const { t } = useTranslation();  
  const navigate = useNavigate();
  const { fetchSupervisorApplications } = useSupervisor();

  const [counts, setCounts] = useState({
    myEvents: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch approved events
        const approved = await fetchSupervisorApplications("approved");
        const pending = await fetchSupervisorApplications("pending");
        const rejected = await fetchSupervisorApplications("rejected");
        // Fetch my created events (for now just use total of all statuses)
        const myEvents =
          (approved.data?.totalEvents || 0) +
          (pending.data?.totalEvents || 0) +
          (rejected.data?.totalEvents || 0);

        setCounts({
          myEvents,
          approved: approved.data?.totalEvents || 0,
          pending: pending.data?.totalEvents || 0,
          rejected: rejected.data?.totalEvents || 0,
        });
      } catch (err) {
        console.error("Error fetching event counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const SYSTEM_SUMMARY = [
    {
      title: t("dashboard.systemSummary.createdEventsByMe"),
      subtitle: counts.myEvents,
      icon: User,
      description: t("dashboard.systemSummary.createdAndManaged"),
      color: "orange",
    },
    {
      title: t("dashboard.systemSummary.approvedEvents"),
      subtitle: counts.approved,
      icon: CalendarCheck,
      description: t("dashboard.systemSummary.approvedByAdmin"),
      color: "green",
    },
    {
      title: t("dashboard.systemSummary.pendingEvents"),
      subtitle: counts.pending,
      icon: Clock,
      description: t("dashboard.systemSummary.awaitingApproval"),
      color: "yellow",
    },
    {
      title: t("dashboard.systemSummary.rejectedEvents"),
      subtitle: counts.rejected,
      icon: XCircle,
      description: t("dashboard.systemSummary.rejectedByAdmin"),
      color: "red",
    },
  ];

  const DASHBOARD_ITEMS = [
    {
      title: t("dashboard.items.controlStudentApplications"),
      icon: Calendar,
      description: t("dashboard.items.controlDescription"),
      onClick: () => {
        navigate("/supervisor/control-applications");
      },
      color: "purple",
    },
    {
      title: t("dashboard.items.createEvent"),
      icon: CalendarCheck,
      description: t("dashboard.items.createEventDescription"),
      onClick: () => navigate("/supervisor/create-event"),
      color: "green",
    },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
      </header>

      <div className="space-y-6">

        <h2 className="text-center text-2xl font-bold">{t("dashboard.systemManagementTitle")}</h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          {DASHBOARD_ITEMS.map((item) => (
            <Card
              onClick={item.onClick}
              key={item.title}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <item.icon className={`h-8 w-8 text-${item.color}-500`} />
                  <div>
                    <p className="text-xl font-bold">{item.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-center text-2xl font-bold">{t("dashboard.systemSummaryTitle")}</h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {SYSTEM_SUMMARY.map((item) => (
            <Card
              key={item.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <item.icon className={`h-8 w-8 text-${item.color}-500`} />
                  <div>
                    <p className="text-2xl font-bold">{item.subtitle}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.title}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
